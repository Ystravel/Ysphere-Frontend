<template>
  <v-container max-width="2500">
    <!-- 搜尋條件區塊 -->
    <v-row class="pt-md-10">
      <v-col
        cols="12"
        lg="3"
      >
        <v-row>
          <v-col
            cols="12"
            class="mt-1 px-lg-10"
          >
            <v-card class="elevation-4 rounded-xl py-8 px-4 px-sm-8">
              <v-card-title class="font-weight-bold">
                搜尋條件
              </v-card-title>
              <v-card-text class="pa-2">
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
                  >
                    <!-- 操作人員自動完成 -->
                    <v-autocomplete
                      v-model="searchCriteria.operatorId"
                      v-model:search-input="operatorSearchInput"
                      :items="operatorSuggestions"
                      :loading="operatorLoading"
                      label="操作人員"
                      return-object
                      :item-props="item => ({
                        title: `${item.name} (${item.userId})`,
                        value: item
                      })"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      @update:search="handleOperatorSearch"
                      @click:clear="clearOperatorSearch"
                    >
                      <template #selection="{ item }">
                        {{ item?.props?.title }}
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
                  >
                    <!-- 被操作對象自動完成 -->
                    <v-autocomplete
                      v-model="searchCriteria.targetId"
                      v-model:search-input="targetSearchInput"
                      :items="targetSuggestions"
                      :loading="targetLoading"
                      label="操作對象"
                      return-object
                      :item-props="item => ({
                        title: `${item.name} (${item.userId})`,
                        value: item
                      })"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      @update:search="handleTargetSearch"
                      @click:clear="clearTargetSearch"
                    >
                      <template #selection="{ item }">
                        {{ item?.props?.title }}
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
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
                    lg="12"
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
                    <v-date-input
                      v-model="searchCriteria.startDate"
                      label="開始日期"
                      prepend-icon
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
                    <v-date-input
                      v-model="searchCriteria.endDate"
                      label="結束日期"
                      prepend-icon
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
                    <v-row class="d-flex justify-space-between">
                      <v-col cols="3">
                        <v-btn
                          color="grey"
                          width="40"
                          block
                          @click="resetSearch"
                        >
                          <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col
                        cols="9"
                        class="ps-0"
                      >
                        <v-btn
                          color="blue-grey-darken-1"
                          prepend-icon="mdi-magnify"
                          :loading="tableLoading"
                          block
                          @click="performSearch"
                        >
                          搜尋
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- 表格區塊 -->
      <v-col
        cols="12"
        lg="9"
        class="px-6 ps-lg-4 pe-lg-12"
      >
        <v-row class="elevation-4 rounded-xl py-8 px-1 px-sm-10 mt-1 bg-white">
          <v-col
            cols="12"
            class="ps-4 pb-6"
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
              <template #[`item.createdAt`]="{ item }">
                {{ formatDateTime(item.createdAt) }}
              </template>
              <template #[`item.operatorId`]="{ item }">
                {{ formatOperator(item) }}
              </template>
              <template #[`item.targetId`]="{ item }">
                {{ formatTarget(item) }}
              </template>
              <template #[`item.changes`]="{ item }">
                {{ formatChanges(item) }}
              </template>
              <template #[`item.targetModel`]="{ item }">
                {{ getModelDisplay(item.targetModel) }}
              </template>
              <template #[`item.actionType`]="{ item }">
                {{ item.action }}
              </template>
              <template #[`item.actions`]="{ item }">
                <v-btn
                  icon
                  color="blue-grey-darken-1"
                  variant="text"
                  size="small"
                  @click="showDetail(item)"
                >
                  <v-icon>mdi-information</v-icon>
                </v-btn>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <!-- 新增詳細資料 Dialog 組件 -->
  <v-dialog
    v-model="detailDialog"
    width="600"
  >
    <v-card class="pa-4">
      <v-card-title class="text-h6 pb-4">
        異動詳細資料
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div class="d-flex flex-column gap-4">
              <div>
                <div class="text-grey text-subtitle-2">
                  操作時間
                </div>
                <div>{{ formatDateTime(selectedItem?.createdAt) }}</div>
              </div>
              <div>
                <div class="text-grey text-subtitle-2">
                  操作人員
                </div>
                <div>{{ formatOperator(selectedItem) }}</div>
              </div>
              <div>
                <div class="text-grey text-subtitle-2">
                  操作對象
                </div>
                <div>{{ formatTarget(selectedItem) }}</div>
              </div>
              <div>
                <div class="text-grey text-subtitle-2">
                  操作類型
                </div>
                <div>{{ selectedItem?.action }}</div>
              </div>
              <div>
                <div class="text-grey text-subtitle-2">
                  資料類型
                </div>
                <div>{{ getModelDisplay(selectedItem?.targetModel) }}</div>
              </div>
              <div>
                <div class="text-grey text-subtitle-2">
                  異動內容
                </div>
                <div>{{ formatChanges(selectedItem) }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          @click="detailDialog = false"
        >
          關閉
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useApi } from '@/composables/axios'
import debounce from 'lodash/debounce'
import { definePage } from 'vue-router/auto'
import { companyNames } from '@/enums/Company'
import { roleNames } from '@/enums/UserRole'
import { useSnackbar } from 'vuetify-use-dialog'

definePage({
  meta: {
    title: '異動紀錄 | ystravel',
    login: true
  }
})

const createSnackbar = useSnackbar()

const { apiAuth } = useApi()
const { smAndUp, mdAndUp, lgAndUp } = useDisplay()

// 自動完成相關
const operatorSuggestions = ref([])
const targetSuggestions = ref([])
const operatorLoading = ref(false)
const targetLoading = ref(false)
const operatorSearchInput = ref('')
const targetSearchInput = ref('')

// 表格相關
const tableLoading = ref(false)
const tableItems = ref([])
const tablePage = ref(1)
const tableItemsPerPage = ref(10)
const tableItemsLength = ref(0)
const tableSortBy = ref([{ key: 'createdAt', order: 'desc' }])

// 搜尋條件
const searchCriteria = ref({
  operatorId: null, // 改為 null
  targetId: null, // 改為 null
  action: '',
  targetModel: '',
  startDate: null,
  endDate: null
})

const detailDialog = ref(false)
const selectedItem = ref(null)

const showDetail = (item) => {
  selectedItem.value = item
  detailDialog.value = true
}

// 選項
const actionOptions = [
  { title: '創建', value: '創建' },
  { title: '修改', value: '修改' },
  { title: '刪除', value: '刪除' }
]

const modelOptions = [
  { title: '員工資料', value: 'users' },
  { title: '部門資料', value: 'departments' },
  { title: '設備資料', value: 'assets' }
]

const getModelDisplay = (model) => {
  const modelMap = {
    users: '員工資料',
    departments: '部門資料',
    assets: '資產資料'
  }
  return modelMap[model] || model
}

// 欄位名稱翻譯
const fieldTranslations = {
  name: '姓名',
  englishName: '英文名',
  email: '電子郵件',
  cellphone: '手機號碼',
  extNumber: '分機號碼',
  printNumber: '列印編號',
  department: '部門',
  companyId: '所屬公司',
  company: '公司',
  companyName: '公司名稱',
  jobTitle: '職稱',
  role: '權限',
  employmentStatus: '任職狀態',
  guideLicense: '領隊證',
  salary: '薪資',
  hireDate: '到職日期',
  resignationDate: '離職日期',
  emergencyName: '緊急聯絡人',
  emergencyCellphone: '緊急聯絡電話',
  emergencyRelationship: '緊急聯絡人關係',
  permanentAddress: '戶籍地址',
  contactAddress: '聯絡地址',
  IDNumber: '身分證號碼',
  userId: '員工編號'
}

// 表格標頭
const tableHeaders = [
  { title: '操作時間', align: 'start', sortable: true, key: 'createdAt', width: '180' },
  { title: '操作人員', align: 'start', sortable: true, key: 'operatorId', width: '150' },
  { title: '資料類型', align: 'start', sortable: true, key: 'targetModel', width: '120' },
  { title: '操作類型', align: 'start', sortable: true, key: 'actionType', width: '100', mdAndUp: true }, // 改為 'actionType'
  { title: '操作對象', align: 'start', sortable: true, key: 'targetId', width: '150', smAndUp: true },
  { title: '異動內容', align: 'start', sortable: false, key: 'changes', lgAndUp: true },
  { title: '操作', align: 'center', sortable: false, key: 'actions', width: '80' } // 改為 'actions'
]

// 新增表格標頭響應式顯示
const filteredHeaders = computed(() => {
  if (!smAndUp.value) {
    // sm 以下只顯示基本欄位
    return tableHeaders.filter(header =>
      ['createdAt', 'operatorId', 'targetModel', 'actions'].includes(header.key)
    )
  }
  if (!mdAndUp.value) {
    // sm-md 顯示基本欄位 + 操作類型
    return tableHeaders.filter(header =>
      ['createdAt', 'operatorId', 'targetModel', 'actionType', 'actions'].includes(header.key)
    )
  }
  if (!lgAndUp.value) {
    // md-lg 顯示除了異動內容外的所有欄位
    return tableHeaders.filter(header => header.key !== 'changes')
  }
  // lg 以上顯示所有欄位
  return tableHeaders
})

// 處理操作人員搜尋
const handleOperatorSearch = debounce(async (text) => {
  if (!text || text.length < 1) {
    operatorSuggestions.value = []
    return
  }

  operatorLoading.value = true
  try {
    const { data } = await apiAuth.get('/user/suggestions', {
      params: { search: text }
    })
    if (data.success) {
      operatorSuggestions.value = data.result // 直接使用回傳的資料
    }
  } catch (error) {
    console.error('搜尋操作人員失敗:', error)
    operatorSuggestions.value = []
  } finally {
    operatorLoading.value = false
  }
}, 300)

// 處理被操作對象搜尋
const handleTargetSearch = debounce(async (text) => {
  if (!text || text.length < 1) {
    targetSuggestions.value = []
    return
  }

  targetLoading.value = true
  try {
    const { data } = await apiAuth.get('/user/suggestions', {
      params: { search: text }
    })
    if (data.success) {
      targetSuggestions.value = data.result // 直接使用回傳的資料
    }
  } catch (error) {
    console.error('搜尋被操作對象失敗:', error)
    targetSuggestions.value = []
  } finally {
    targetLoading.value = false
  }
}, 300)

// 清除搜尋
const clearOperatorSearch = () => {
  operatorSearchInput.value = ''
  operatorSuggestions.value = []
  searchCriteria.value.operatorId = null
}

const clearTargetSearch = () => {
  targetSearchInput.value = ''
  targetSuggestions.value = []
  searchCriteria.value.targetId = null
}

// 格式化日期時間
const formatDateTime = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 格式化操作人員
const formatOperator = (item) => {
  if (!item.operator) return '系統'
  return `${item.operator.name || ''} ${item.operator.userId ? `(${item.operator.userId})` : ''}`
}

// 格式化被操作對象
const formatTarget = (item) => {
  if (!item.target) return '-'
  return `${item.target.name || ''} ${item.target.userId ? `(${item.target.userId})` : ''}`
}

// 格式化變更內容
// formatChanges 函數修改
const formatChanges = (item) => {
  // 處理創建操作
  if (item.action === '創建') {
    if (item.targetModel === 'departments') {
      const { name, company } = item.changes || {}
      const displayName = name?.to || ''
      const displayCompany = company?.to || companyNames[item.changes?.companyId?.to] || ''
      return `新增部門： ${displayName} (${displayCompany})`
    } else if (item.targetModel === 'users') {
      const target = item.target || {}
      return `新增員工： ${target.name || ''} ${target.userId ? `(${target.userId})` : ''}`
    }
    return '新增資料'
  }

  // 處理刪除操作
  if (item.action === '刪除') {
    if (item.targetModel === 'departments') {
      const changes = item.changes || {}
      return `刪除部門： ${changes.name || ''} (${changes.company || companyNames[changes.companyId] || ''})`
    } else if (item.targetModel === 'users') {
      const target = item.target || {}
      return `刪除員工： ${target.name || ''} ${target.userId ? `(${target.userId})` : ''}`
    }
    return '刪除資料'
  }

  // 處理修改操作
  if (item.targetModel === 'departments') {
    const changes = []
    const changesObj = item.changes || {}

    // 處理部門名稱變更
    if (changesObj.name) {
      changes.push(`部門名稱: ${changesObj.name.from || '-'} → ${changesObj.name.to || '-'}`)
    }

    // 處理公司變更
    if (changesObj.company) {
      changes.push(`所屬公司: ${changesObj.company.from || '-'} → ${changesObj.company.to || '-'}`)
    } else if (changesObj.companyId) {
      changes.push(`所屬公司: ${companyNames[changesObj.companyId.from] || '-'} → ${companyNames[changesObj.companyId.to] || '-'}`)
    }

    return changes.join('、') || '-'
  }

  // 處理其他資料的修改
  const changes = []
  for (const [key, value] of Object.entries(item.changes)) {
    // 跳過未定義的值
    if (!value || (!value.from && !value.to && !['department', 'company'].includes(key))) continue

    const fieldName = fieldTranslations[key] || key
    let fromValue = value.from
    let toValue = value.to

    // 特殊處理不同類型的值
    switch (key) {
      case 'role':
        fromValue = roleNames[value.from] || value.from || '-'
        toValue = roleNames[value.to] || value.to || '-'
        break
      case 'companyId':
      case 'company':
        fromValue = companyNames[value.from] || value.from || '-'
        toValue = companyNames[value.to] || value.to || '-'
        break
      case 'department':
        fromValue = value.from || '-'
        toValue = value.to || '-'
        break
      case 'guideLicense':
        fromValue = value.from ? '有' : '無'
        toValue = value.to ? '有' : '無'
        break
      case 'salary':
        fromValue = value.from?.toLocaleString() || '-'
        toValue = value.to?.toLocaleString() || '-'
        break
      default:
        if (key.includes('Date')) {
          fromValue = value.from ? formatDate(value.from) : '-'
          toValue = value.to ? formatDate(value.to) : '-'
        } else {
          fromValue = value.from || '-'
          toValue = value.to || '-'
        }
    }

    changes.push(`${fieldName}: ${fromValue} → ${toValue}`)
  }

  return changes.length > 0 ? changes.join('、') : '-'
}

// 重置搜尋條件
const resetSearch = () => {
  searchCriteria.value = {
    operatorId: null, // 改為 null
    targetId: null, // 改為 null
    action: '',
    targetModel: '',
    startDate: null,
    endDate: null
  }

  // 清除自動完成
  clearOperatorSearch()
  clearTargetSearch()

  // 重置後執行搜尋
  performSearch()
}
// 執行搜尋
const performSearch = async () => {
  tableLoading.value = true
  try {
    const params = {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'createdAt',
      sortOrder: tableSortBy.value[0]?.order || 'desc'
    }

    // 處理日期
    if (searchCriteria.value.startDate) {
      params.startDate = new Date(searchCriteria.value.startDate).toISOString().split('T')[0]
    }
    if (searchCriteria.value.endDate) {
      params.endDate = new Date(searchCriteria.value.endDate).toISOString().split('T')[0]
    }

    // 處理搜尋條件
    if (searchCriteria.value.operatorId?._id) {
      params.operatorId = searchCriteria.value.operatorId._id
    }
    if (searchCriteria.value.targetId?._id) {
      params.targetId = searchCriteria.value.targetId._id
    }

    // 處理其他搜尋條件
    if (searchCriteria.value.action) {
      params.action = searchCriteria.value.action
    }
    if (searchCriteria.value.targetModel) {
      params.targetModel = searchCriteria.value.targetModel
    }
    if (searchCriteria.value.startDate) {
      params.startDate = searchCriteria.value.startDate
    }
    if (searchCriteria.value.endDate) {
      params.endDate = searchCriteria.value.endDate
    }

    const response = await apiAuth.get('/auditlog/all', { params })

    if (response.data.success) {
      const { data, totalItems } = response.data.result
      tableItems.value = data
      tableItemsLength.value = totalItems

      const maxPage = Math.ceil(totalItems / tableItemsPerPage.value)
      if (tablePage.value > maxPage) {
        tablePage.value = Math.max(1, maxPage)
      }
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    console.error('搜尋失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '搜尋時發生錯誤',
      snackbarProps: { color: 'error' }
    })
    tableItems.value = []
    tableItemsLength.value = 0
  } finally {
    tableLoading.value = false
  }
}

// 處理表格選項變更
const handleTableOptionsChange = async ({ page, itemsPerPage, sortBy }) => {
  tablePage.value = page
  tableItemsPerPage.value = itemsPerPage
  tableSortBy.value = sortBy
  await performSearch()
}

// 初始載入
onMounted(async () => {
  await performSearch()
})
</script>

<style lang="scss" scoped>
.v-data-table ::v-deep {
  .text-wrap {
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>
