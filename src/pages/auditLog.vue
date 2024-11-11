<template>
  <v-container>
    <!-- 搜尋條件區塊 -->
    <v-row>
      <v-col
        cols="12"
        xl="3"
      >
        <v-row>
          <v-col cols="12">
            <v-card class="elevation-4 rounded-xl py-8 px-1 px-sm-10">
              <v-card-title>搜尋條件</v-card-title>
              <v-card-text class="pa-2">
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="searchCriteria.operatorId"
                      label="操作人員"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="searchCriteria.targetId"
                      label="被操作對象"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-select
                      v-model="searchCriteria.action"
                      :items="actionOptions"
                      label="操作類型"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-select
                      v-model="searchCriteria.targetModel"
                      :items="modelOptions"
                      label="資料類型"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="searchCriteria.startDate"
                      label="開始日期"
                      type="date"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="searchCriteria.endDate"
                      label="結束日期"
                      type="date"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    class="d-flex justify-end gap-2"
                  >
                    <v-btn
                      color="grey"
                      @click="resetSearch"
                    >
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                    <v-btn
                      color="cyan-darken-2"
                      prepend-icon="mdi-magnify"
                      :loading="tableLoading"
                      @click="performSearch"
                    >
                      搜尋
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        xl="9"
      >
        <!-- 表格區塊 -->
        <v-row class="elevation-4 rounded-xl py-8 px-1 px-sm-10 mt-6 bg-white">
          <v-col
            cols="12"
            class="ps-3 pb-6"
          >
            <h3>異動紀錄</h3>
          </v-col>
          <v-col cols="12">
            <v-data-table-server
              v-model:items-per-page="tableItemsPerPage"
              v-model:sort-by="tableSortBy"
              :items="tableItems"
              :headers="filteredHeaders"
              :loading="tableLoading"
              :items-length="tableItemsLength"
              :page="tablePage"
              hover
              density="compact"
              @update:options="handleTableOptionsChange"
            >
              <!-- 修改插槽語法 -->
              <template #[`item.createdAt`]="{ item }">
                {{ formatDate(item.createdAt) }}
              </template>
              <template #[`item.operatorId`]="{ item }">
                {{ item.operator?.name || '系統' }}
                <span
                  v-if="item.operator?.userId"
                  class="text-grey"
                >
                  ({{ item.operator.userId }})
                </span>
              </template>
              <template #[`item.targetId`]="{ item }">
                {{ item.target?.name || '-' }}
                <span
                  v-if="item.target?.userId"
                  class="text-grey"
                >
                  ({{ item.target.userId }})
                </span>
              </template>
              <template #[`item.targetModel`]="{ item }">
                {{ getModelDisplay(item.targetModel) }}
              </template>
              <template #[`item.changes`]="{ item }">
                <div class="text-wrap">
                  {{ formatChanges(item) }}
                </div>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import UserRole from '@/enums/UserRole'
import debounce from 'lodash/debounce'
import { definePage } from 'vue-router/auto'

definePage({
  meta: {
    title: '異動紀錄 | ystravel',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.IT, UserRole.ADMIN]
  }
})

const { apiAuth } = useApi()
const { lgAndUp } = useDisplay()
const createSnackbar = useSnackbar()

// 表格相關狀態
const tableLoading = ref(false)
const tableItems = ref([])
const tablePage = ref(1)
const tableItemsPerPage = ref(10)
const tableItemsLength = ref(0)
const tableSortBy = ref([{ key: 'createdAt', order: 'desc' }])

// 搜尋條件
const searchCriteria = ref({
  operatorId: '',
  targetId: '',
  action: '',
  targetModel: '',
  startDate: null,
  endDate: null
})

// 操作類型選項
const actionOptions = [
  { title: '創建', value: '創建' },
  { title: '修改', value: '修改' },
  { title: '刪除', value: '刪除' }
]

// 資料類型選項
const modelOptions = [
  { title: '員工資料', value: 'users' },
  { title: '部門資料', value: 'departments' },
  { title: '設備資料', value: 'assets' }
]

// 表格標題
const tableHeaders = [
  { title: '操作時間', align: 'start', sortable: true, key: 'createdAt' },
  { title: '操作人員', align: 'start', sortable: true, key: 'operatorId' },
  { title: '操作對象', align: 'start', sortable: true, key: 'targetId' },
  { title: '操作類型', align: 'start', sortable: true, key: 'action' },
  { title: '資料類型', align: 'start', sortable: true, key: 'targetModel' },
  { title: '異動內容', align: 'start', sortable: false, key: 'changes' }
]

// 根據螢幕寬度過濾表格欄位
const filteredHeaders = computed(() => {
  if (lgAndUp.value) return tableHeaders
  return tableHeaders.filter(header => header.key !== 'changes')
})

// 格式化日期
const formatDate = (date) => {
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// 格式化異動內容
const formatChanges = (log) => {
  if (log.action === '創建') {
    return `新增 ${log.target?.userId || ''} ${log.target?.name || ''}`
  }

  if (log.action === '刪除') {
    return '資料已刪除'
  }

  const changes = []
  for (const [key, value] of Object.entries(log.changes)) {
    changes.push(`${key}: ${value.from} → ${value.to}`)
  }
  return changes.join(', ')
}

// 取得資料類型顯示名稱
const getModelDisplay = (model) => {
  const modelMap = {
    users: '員工資料',
    departments: '部門資料',
    assets: '資產資料'
  }
  return modelMap[model] || model
}

// 處理表格選項變更
const handleTableOptionsChange = ({ page, itemsPerPage, sortBy }) => {
  tablePage.value = page
  tableItemsPerPage.value = itemsPerPage
  tableSortBy.value = sortBy
  loadAuditLogs()
}

// 載入資料
const loadAuditLogs = async () => {
  tableLoading.value = true
  try {
    const params = {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'createdAt',
      sortOrder: tableSortBy.value[0]?.order || 'desc',
      ...searchCriteria.value
    }

    const { data } = await apiAuth.get('/auditlog/all', { params })

    if (data.success) {
      tableItems.value = data.result.data
      tableItemsLength.value = data.result.totalItems
    }
  } catch (error) {
    console.error('載入異動紀錄失敗:', error)
    createSnackbar({
      text: '載入異動紀錄失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    tableLoading.value = false
  }
}

// 重置搜尋條件
const resetSearch = () => {
  searchCriteria.value = {
    operatorId: '',
    targetId: '',
    action: '',
    targetModel: '',
    startDate: null,
    endDate: null
  }
  tablePage.value = 1
  loadAuditLogs()
}

// 執行搜尋
const performSearch = debounce(() => {
  tablePage.value = 1
  loadAuditLogs()
}, 300)

// 初始載入
onMounted(() => {
  loadAuditLogs()
})
</script>

<style lang="scss" scoped>
.text-wrap {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
