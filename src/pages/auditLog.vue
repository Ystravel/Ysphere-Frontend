<template>
  <v-container max-width="2500">
    <!-- 搜尋條件區塊 -->
    <v-row class="pt-md-5">
      <v-col
        cols="12"
        lg="4"
        xl="3"
      >
        <v-row>
          <v-col
            cols="12"
            class="mt-1 px-lg-10"
          >
            <v-card
              class="elevation-4 rounded-lg py-4 py-sm-8 px-4 px-sm-4 px-xl-8"
            >
              <v-card-title class="font-weight-bold d-flex align-center">
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
                      creatable
                      create-filter="(item, queryText, itemText) =>
    item.name.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
    item.userId.toLowerCase().indexOf(queryText.toLowerCase()) > -1"
                      @update:search="handleOperatorSearch"
                      @click:clear="clearOperatorSearch"
                      @create="(name) => {
                        const newOperator = { name, userId: name };
                        operatorSuggestions.value.push(newOperator);
                        searchCriteria.value.operatorId = newOperator;
                      }"
                    >
                      <template #selection="{ item }">
                        {{ item?.props?.title }}
                      </template>
                      <template
                        v-if="smAndUp"
                        #append-inner
                      >
                        <v-tooltip
                          location="top"
                          close-delay="200"
                        >
                          <template #activator="{ props }">
                            <v-icon
                              v-bind="props"
                              icon="mdi-information"
                              size="18"
                            />
                          </template>
                          輸入員編、姓名查詢
                        </v-tooltip>
                      </template>
                    </v-autocomplete>
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
                    lg="12"
                  >
                    <!-- 被操作對象自動完成 -->
                    <v-autocomplete
                      v-model="searchCriteria.targetId"
                      v-model:search-input="targetSearchInput"
                      :items="targetSuggestions"
                      :loading="targetLoading"
                      :label="targetType ? '操作對象' : '操作對象( 請先選擇資料類型 )'"
                      :disabled="!targetType"
                      return-object
                      :item-props="item => ({
                        title: getTargetDisplayText(item),
                        value: item
                      })"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      creatable
                      create-filter="(item, queryText, itemText) =>
    item.name.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
    (item.userId && item.userId.toLowerCase().indexOf(queryText.toLowerCase()) > -1) ||
    (item.departmentId && item.departmentId.toLowerCase().indexOf(queryText.toLowerCase()) > -1)"
                      @update:search="handleTargetSearch"
                      @click:clear="clearTargetSearch"
                      @create="(name) => {
                        let newTarget;
                        switch (targetType.value) {
                        case 'users':
                          newTarget = { name, userId: name };
                          break;
                        case 'departments':
                          newTarget = { name, departmentId: name };
                          break;
                        }
                        targetSuggestions.value.push(newTarget);
                        searchCriteria.value.targetId = newTarget;
                      }"
                    >
                      <template #selection="{ item }">
                        {{ getTargetDisplayText(item.props.value) }}
                      </template>
                      <template
                        v-if="smAndUp"
                        #append-inner
                      >
                        <v-tooltip
                          location="top"
                          close-delay="200"
                        >
                          <template #activator="{ props }">
                            <v-icon
                              v-bind="props"
                              icon="mdi-information"
                              size="18"
                            />
                          </template>
                          輸入員編、姓名、部門編號、部門名稱、設備編號、設備名稱查詢
                        </v-tooltip>
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
                    <v-date-input
                      v-model="searchCriteria.startDate"
                      label="開始日期"
                      prepend-icon
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      :cancel-text="'取消'"
                      :ok-text="'確認'"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
                  >
                    <v-date-input
                      v-model="searchCriteria.endDate"
                      label="結束日期"
                      prepend-icon
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      :cancel-text="'取消'"
                      :ok-text="'確認'"
                      :min="searchCriteria.startDate"
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
        lg="8"
        xl="9"
        class="px-6 ps-lg-4 pe-lg-12 mb-6"
      >
        <v-row class="elevation-4 rounded-lg py-4 py-sm-8 px-1 px-sm-4 px-md-10 mt-1 bg-white">
          <v-col
            cols="12"
            class="ps-4 pb-sm-6"
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
              :items-per-page-options="[10, 20, 50,100]"
              :page="tablePage"
              :header-props="headerProps"
              hover
              density="compact"
              class="rounded-ts-lg rounded-te-lg"
              @update:options="handleTableOptionsChange"
            >
              <!-- 添加自定義的 item 插槽來實現交替行顏色 -->
              <template #item="{ item, index }">
                <tr :class="{ 'odd-row': index % 2 === 0, 'even-row': index % 2 !== 0 }">
                  <td>{{ formatDateTime(item.createdAt) }}</td>
                  <td v-if="smAndUp">
                    {{ formatOperator(item) }}
                  </td>
                  <td>{{ getModelDisplay(item.targetModel) }}</td>
                  <td v-if="smAndUp">
                    {{ item.action }}
                  </td>
                  <td v-if="mdAndUp">
                    {{ formatTarget(item) }}
                  </td>
                  <td
                    v-if="lgAndUp"
                    class="py-3"
                    style="max-width: 420px; overflow-wrap: break-word;"
                  >
                    <div
                      v-for="(change, idx) in formatChanges(item)"
                      :key="idx"
                    >
                      {{ change }}
                    </div>
                  </td>
                  <td class="text-center">
                    <v-icon
                      icon="mdi-book-open-variant-outline"
                      color="blue-grey-darken-3"
                      size="small"
                      class="my-4"
                      @click="showDetail(item)"
                    />
                  </td>
                </tr>
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
      <div class="ps-6 pt-4 pb-1 pb-sm-3 card-title">
        異動詳細資料
      </div>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div class="d-flex flex-column gap-4">
              <div>
                <div
                  class="text-grey-darken-1 list-title"
                >
                  操作時間
                </div>
                <div class="list-content">
                  {{ formatDateTime(selectedItem?.createdAt) }}
                </div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1 list-title"
                >
                  操作人員
                </div>
                <div class="list-content">
                  {{ formatOperator(selectedItem) }}
                </div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1 list-title"
                >
                  操作對象
                </div>
                <div class="list-content">
                  {{ formatTarget(selectedItem) }}
                </div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1 list-title"
                >
                  操作類型
                </div>
                <div class="list-content">
                  {{ selectedItem?.action }}
                </div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1 list-title"
                >
                  資料類型
                </div>
                <div class="list-content">
                  {{ getModelDisplay(selectedItem?.targetModel) }}
                </div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1 list-title"
                >
                  異動內容
                </div>
                <div
                  v-if="formatChanges(selectedItem).length > 0"
                  class="list-content"
                >
                  <ul class="change-list">
                    <li
                      v-for="(change, index) in formatChanges(selectedItem)"
                      :key="index"
                      class="py-2"
                    >
                      {{ change }}
                    </li>
                  </ul>
                </div>
                <div v-else>
                  無異動內容
                </div>
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
          :size="buttonSize"
          @click="detailDialog = false"
        >
          關閉
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useApi } from '@/composables/axios'
import { debounce } from 'lodash'
import { definePage } from 'vue-router/auto'
import { companyNames } from '@/enums/Company'
import UserRole from '@/enums/UserRole'
import { useSnackbar } from 'vuetify-use-dialog'

definePage({
  meta: {
    title: '異動紀錄 | ysphere',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  }
})

const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
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
const headerProps = {
  class: 'header-bg'
}

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
  { title: '設備資料', value: 'assets' },
  { title: '招聘資料', value: 'tempUsers' },
  { title: '表單資料', value: 'forms' },
  { title: '表單模板', value: 'formTemplates' }
]

const getModelDisplay = (model) => {
  const modelMap = {
    users: '員工資料',
    departments: '部門資料',
    assets: '資產資料',
    tempUsers: '招聘資料',
    forms: '表單資料',
    formTemplates: '表單模板',
    companies: '公司資料'
  }
  return modelMap[model] || model
}

const getTargetDisplayText = (item) => {
  if (!item) return ''
  if (typeof item === 'object') {
    if (item.name && item.departmentId) {
      return `${item.name} (${item.departmentId})`
    }
    if (item.name && item.userId) {
      return `${item.name} (${item.userId})`
    }
    // 對於 tempUsers，只顯示名稱
    if (item.name && targetType.value === 'tempUsers') {
      return item.name
    }
  }
  return item
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
  companyId: '公司',
  company: '公司',
  companyName: '公司名稱',
  jobTitle: '職稱',
  role: '權限',
  employmentStatus: '任職狀態',
  gender: '性別',
  salary: '薪資',
  birthDate: '生日',
  hireDate: '入職日期',
  resignationDate: '離職日期',
  emergencyName: '緊急聯絡人',
  emergencyCellphone: '緊急聯絡電話',
  emergencyRelationship: '緊急聯絡人關係',
  permanentAddress: '戶籍地址',
  contactAddress: '聯絡地址',
  IDNumber: '身分證號碼',
  userId: '員工編號',
  departmentId: '部門編號',
  note: '備註',
  description: '描述',
  cowellAccount: '科威帳號',
  cowellPassword: '科威密碼',
  personalEmail: '個人Email',
  lastModifiedBy: '最後修改人',
  status: '狀態',
  isTransferred: '是否轉正',
  associatedUserId: '轉正後OBJ',
  effectiveDate: '生效日期',
  seatDescription: '座位描述'
}

// 表格標頭
const tableHeaders = [
  { title: '操作時間', align: 'start', sortable: true, key: 'createdAt' },
  { title: '操作人員', align: 'start', sortable: true, key: 'operatorId' },
  { title: '資料類型', align: 'start', sortable: true, key: 'targetModel' },
  { title: '動作', align: 'start', sortable: true, key: 'actionType' }, // 改為 'actionType'
  { title: '操作對象', align: 'start', sortable: true, key: 'targetId' },
  { title: '異動內容', align: 'start', sortable: false, key: 'changes' },
  { title: '查看', align: 'center', sortable: false, key: 'actions' } // 改為 'actions'
]

// 新增表格標頭響應式顯示
const filteredHeaders = computed(() => {
  if (!smAndUp.value) {
    // sm 以下只顯示基本欄位
    return tableHeaders.filter(header =>
      ['createdAt', 'targetModel', 'actions'].includes(header.key)
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
  operatorLoading.value = true
  try {
    const { data } = await apiAuth.get('/user/suggestions', {
      params: { search: text }
    })
    if (data.success) {
      operatorSuggestions.value = data.result
    } else if (text) {
      // 當搜索結果為空,但用戶有輸入時,保留用戶輸入的值
      const newOperator = { name: text, userId: text }
      operatorSuggestions.value = [newOperator]
      searchCriteria.value.operatorId = newOperator
    } else {
      operatorSuggestions.value = []
    }
  } catch (error) {
    console.error('搜索操作人員失敗:', error)
    operatorSuggestions.value = []
  } finally {
    operatorLoading.value = false
  }
}, 300)

// 處理被操作對象搜尋
const handleTargetSearch = debounce(async (text) => {
  targetLoading.value = true
  try {
    let response
    switch (targetType.value) {
      case 'users':
        response = await apiAuth.get('/user/suggestions', {
          params: { search: text }
        })
        if (response.data.success) {
          targetSuggestions.value = response.data.result.map(user => ({
            _id: user._id,
            name: user.name,
            userId: user.userId
          }))
        } else if (text) {
          const newTarget = { name: text, userId: text }
          targetSuggestions.value = [newTarget]
          searchCriteria.value.targetId = newTarget
        } else {
          targetSuggestions.value = []
        }
        break
      case 'departments':
        response = await apiAuth.get('/department/all', {
          params: {
            search: text,
            searchFields: ['name', 'departmentId']
          }
        })
        if (response.data.success) {
          targetSuggestions.value = response.data.result.data.map(dept => ({
            _id: dept._id,
            name: dept.name,
            departmentId: dept.departmentId
          }))
        } else if (text) {
          const newTarget = { name: text, departmentId: text }
          targetSuggestions.value = [newTarget]
          searchCriteria.value.targetId = newTarget
        } else {
          targetSuggestions.value = []
        }
        break
      case 'tempUsers':
        response = await apiAuth.get('/tempuser/all', {
          params: {
            quickSearch: text,
            itemsPerPage: 10
          }
        })
        if (response.data.success) {
          targetSuggestions.value = response.data.result.data.map(tempUser => ({
            _id: tempUser._id,
            name: tempUser.name
          }))
        } else if (text) {
          const newTarget = { name: text }
          targetSuggestions.value = [newTarget]
          searchCriteria.value.targetId = newTarget
        } else {
          targetSuggestions.value = []
        }
        break
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
  if (searchCriteria.value.operatorId?.name !== operatorSearchInput.value) {
    searchCriteria.value.operatorId = null
  }
}

const clearTargetSearch = () => {
  targetSearchInput.value = ''
  targetSuggestions.value = []
  if (searchCriteria.value.targetId?.name !== targetSearchInput.value) {
    searchCriteria.value.targetId = null
  }
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
  if (!date) return '(無)'
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 格式化操作人員
// formatOperator 函數
const formatOperator = (item) => {
  if (!item) return '-'

  // 優先使用關聯查詢結果
  if (item.operator?.name && item.operator?.userId) {
    return `${item.operator.name} (${item.operator.userId})`
  }

  // 如果沒有關聯查詢結果，則使用 operatorInfo
  if (item.operatorInfo?.name) {
    return `${item.operatorInfo.name}${item.operatorInfo.userId ? ` (${item.operatorInfo.userId})` : ''}`
  }

  return '系統'
}

// 格式化被操作對象
const formatTarget = (item) => {
  if (!item) return '-'

  // 如果有 targetData，優先處理關聯查詢結果
  if (item.targetData) {
    switch (item.targetModel) {
      case 'users': {
        const name = item.targetData.name || '-'
        const userId = item.targetData.userId ? ` (${item.targetData.userId})` : ''
        return `${name}${userId}`
      }
      case 'departments': {
        const name = item.targetData.name || '-'
        const departmentId = item.targetData.departmentId ? ` (${item.targetData.departmentId})` : ''
        const companyName = companyNames[item.targetData.companyId] || '' // 查找公司名稱
        return `${name}${departmentId}${companyName ? ` - ${companyName}` : ''}` // 避免多餘換行
      }
      default:
        return `${item.targetData.name || '-'}`
    }
  }

  // 如果 targetData 不存在，嘗試處理 targetInfo（舊的備援資料）
  if (item.targetInfo) {
    switch (item.targetModel) {
      case 'users': {
        const name = item.targetInfo.name || '-'
        const userId = item.targetInfo.userId ? ` (${item.targetInfo.userId})` : ''
        return `${name}${userId}`
      }
      case 'departments': {
        const name = item.targetInfo.name || '-'
        const departmentId = item.targetInfo.departmentId ? ` (${item.targetInfo.departmentId})` : ''
        const companyName = companyNames[item.targetInfo.companyId] || ''
        return `${name}${departmentId}${companyName ? ` - ${companyName}` : ''}`
      }
      default:
        return `${item.targetInfo.name || '-'}`
    }
  }

  // 如果兩者都沒有，嘗試從 changes 中提取資料（適用於刪除操作）
  if (item.changes) {
    switch (item.targetModel) {
      case 'users': {
        const name = item.action === '刪除'
          ? (item.changes.name?.from || '-')
          : (item.changes.name?.to || '-')
        const userId = item.action === '刪除'
          ? (item.changes.userId?.from || '')
          : (item.changes.userId?.to || '')
        return `${name}${userId ? ` (${userId})` : ''}`
      }
      case 'departments': {
        const name = item.action === '刪除'
          ? (item.changes.name?.from || '-')
          : (item.changes.name?.to || '-')
        const departmentId = item.action === '刪除'
          ? (item.changes.departmentId?.from || '')
          : (item.changes.departmentId?.to || '')
        const companyId = item.action === '刪除'
          ? (item.changes.companyId?.from || '')
          : (item.changes.companyId?.to || '')
        const companyName = companyNames[companyId] || ''
        return `${name}${departmentId ? ` (${departmentId})` : ''}${companyName ? ` - ${companyName}` : ''}`
      }
      default:
        return '-'
    }
  }

  // 如果以上都沒有資料可用，返回預設值
  return '-'
}

// 欄位名稱獲取函數
const getFieldName = (key, targetModel = '') => {
  if (key === 'name') {
    if (targetModel === 'users') return '姓名' // user 模型
    if (targetModel === 'departments') return '部門名稱' // department 模型
  }
  return fieldTranslations[key] || key
}

// 格式化變更內容
// const formatChanges = (item) => {
//   if (!item?.changes) return []

//   const changes = []
//   const addedKeys = new Set() // 用於追蹤已處理的欄位，避免重複添加

//   Object.entries(item.changes).forEach(([key, value]) => {
//     if (!value || typeof value !== 'object' || (!('from' in value) && !('to' in value))) return
//     if (addedKeys.has(key)) return // 跳過已處理的欄位

//     // 檢查 from 和 to 的值，如果是日期則格式化
//     const formatDateIfNecessary = (val) => {
//       if (!val || val === '(無)') return '(無)'
//       if (typeof val === 'string' && val.includes('T')) {
//         return formatDate(val) // 使用修改後的 formatDate 方法
//       }
//       return val
//     }

//     const from = formatDateIfNecessary(value.from)
//     const to = formatDateIfNecessary(value.to)

//     const fieldName = getFieldName(key, item.targetModel)

//     if (item.action === '創建') {
//       if (to !== '(無)') {
//         changes.push(`${fieldName}: ${to}`)
//         addedKeys.add(key)
//       }
//       return
//     }

//     if (from === to) return // 忽略沒有變更的欄位

//     if (fieldName) {
//       changes.push(`${fieldName}: ${from} → ${to}`)
//       addedKeys.add(key)
//     }
//   })

//   if (item.action === '創建' && changes.length === 0) {
//     changes.push(`新增${getModelDisplay(item.targetModel)}`)
//   }

//   return changes
// }

const formatSpecialField = (val, fieldKey) => {
  if (val === null || val === undefined) return '(無)'

  // 定義已知不是日期的欄位
  const nonDateFields = [
    'englishName',
    'IDNumber',
    'name',
    'userId',
    'department',
    'phoneNumber',
    'cellphone',
    'extNumber',
    'printNumber',
    'personalEmail',
    'email',
    'permanentAddress',
    'contactAddress',
    'emergencyName',
    'emergencyPhoneNumber',
    'emergencyCellphone',
    'emergencyRelationship',
    'jobTitle',
    'cowellAccount',
    'cowellPassword',
    'YSRCAccount',
    'YSRCPassword',
    'YS168Account',
    'YS168Password',
    'note',
    'salaryBank',
    'salaryBankBranch',
    'salaryAccountNumber'
  ]

  // 如果是已知的非日期欄位，直接返回值
  if (nonDateFields.includes(fieldKey)) {
    return val.toString()
  }

  // 檢查是否為有效的日期字符串
  const isValidDate = (dateStr) => {
    const date = new Date(dateStr)
    return date instanceof Date && !isNaN(date) && dateStr.includes('-')
  }

  // 如果是日期格式的字符串，進行日期格式化
  if (typeof val === 'string' && isValidDate(val)) {
    return formatDate(val)
  }

  // 其他情況直接返回字符串
  return val.toString()
}

// 在 formatChanges 函數中使用
const formatChanges = (item) => {
  if (!item?.changes) return []

  const changes = []
  const addedKeys = new Set()

  Object.entries(item.changes).forEach(([key, value]) => {
    if (!value || typeof value !== 'object' || (!('from' in value) && !('to' in value))) return
    if (addedKeys.has(key)) return

    // 特殊處理眷屬保險資料
    if (key === '眷屬保險資料') {
      const fromDeps = value.from || []
      const toDeps = value.to || []
      const maxDeps = Math.max(fromDeps.length, toDeps.length)
      const depChanges = []

      if (item.action === '創建') {
        // 處理新增的情況
        toDeps.forEach((dep, index) => {
          depChanges.push(`${key} - 眷屬 ${index + 1}:`)
          depChanges.push(` - 姓名: ${dep.姓名}`)
          depChanges.push(` - 關係: ${dep.關係 || '(無)'}`)
          depChanges.push(` - 生日: ${dep.生日 || '(無)'}`)
          depChanges.push(` - 身分證號: ${dep.身分證號 || '(無)'}`)
          depChanges.push(` - 加保日期: ${dep.加保日期 || '(無)'}`)
          depChanges.push(` - 退保日期: ${dep.退保日期 || '(無)'}`)
        })
      } else {
        // 處理修改和刪除的情況
        for (let i = 0; i < maxDeps; i++) {
          const oldDep = fromDeps[i] || {}
          const newDep = toDeps[i] || {}

          depChanges.push(`${key} - 眷屬 ${i + 1}:`)

          if (!oldDep.姓名 && !newDep.姓名) {
            // 如果舊的和新的眷屬都不存在,跳過
            continue
          } else if (!oldDep.姓名 && newDep.姓名) {
            // 如果只有新的眷屬存在,顯示為新增
            depChanges.push(' (新增)')
          } else if (oldDep.姓名 && !newDep.姓名) {
            // 如果只有舊的眷屬存在,顯示為刪除
            depChanges.push(' (刪除)')
          } else {
            // 如果舊的和新的眷屬都存在,比較變更
            let hasChange = false

            if (oldDep.姓名 !== newDep.姓名) {
              depChanges.push(` - 姓名: ${oldDep.姓名 || '(無)'} → ${newDep.姓名 || '(無)'}`)
              hasChange = true
            }
            if (oldDep.關係 !== newDep.關係) {
              depChanges.push(` - 關係: ${oldDep.關係 || '(無)'} → ${newDep.關係 || '(無)'}`)
              hasChange = true
            }
            if (oldDep.生日 !== newDep.生日) {
              depChanges.push(` - 生日: ${oldDep.生日 || '(無)'} → ${newDep.生日 || '(無)'}`)
              hasChange = true
            }
            if (oldDep.身分證號 !== newDep.身分證號) {
              depChanges.push(` - 身分證號: ${oldDep.身分證號 || '(無)'} → ${newDep.身分證號 || '(無)'}`)
              hasChange = true
            }
            if (oldDep.加保日期 !== newDep.加保日期) {
              depChanges.push(` - 加保日期: ${oldDep.加保日期 || '(無)'} → ${newDep.加保日期 || '(無)'}`)
              hasChange = true
            }
            if (oldDep.退保日期 !== newDep.退保日期) {
              depChanges.push(` - 退保日期: ${oldDep.退保日期 || '(無)'} → ${newDep.退保日期 || '(無)'}`)
              hasChange = true
            }

            if (!hasChange) {
              depChanges.push(' (沒有變更)')
            }
          }
        }
      }

      if (depChanges.length > 0) {
        changes.push(depChanges.join('\n'))
      }
      addedKeys.add(key)
      return
    }

    const from = formatSpecialField(value.from, key)
    const to = formatSpecialField(value.to, key)
    const fieldName = getFieldName(key, item.targetModel)

    if (item.action === '創建') {
      if (to !== '(無)') {
        changes.push(`${fieldName}: ${to}`)
        addedKeys.add(key)
      }
      return
    }

    if (from === to) return

    if (fieldName) {
      changes.push(`${fieldName}: ${from} → ${to}`)
      addedKeys.add(key)
    }
  })

  // 創建動作且沒有變更時的處理
  if (item.action === '創建' && changes.length === 0) {
    changes.push(`新增${getModelDisplay(item.targetModel)}`)
  }

  return changes
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
// 在搜索條件相關變數下添加
const targetType = computed(() => {
  return searchCriteria.value.targetModel
})
// 執行搜尋
const performSearch = async () => {
  // 日期驗證
  if (searchCriteria.value.startDate && searchCriteria.value.endDate) {
    const start = new Date(searchCriteria.value.startDate)
    const end = new Date(searchCriteria.value.endDate)
    if (start > end) {
      createSnackbar({
        text: '結束日期不能早於開始日期',
        snackbarProps: { color: 'warning' }
      })
      return // 如果日期無效，直接返回不執行搜尋
    }
  }

  tableLoading.value = true
  try {
    const params = {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'createdAt',
      sortOrder: tableSortBy.value[0]?.order || 'desc'
    }

    // 處理日期 - 只保留這一段日期處理
    if (searchCriteria.value.startDate) {
      const startDate = new Date(searchCriteria.value.startDate)
      startDate.setHours(0, 0, 0, 0)
      params.startDate = startDate.toISOString()
    }
    if (searchCriteria.value.endDate) {
      const endDate = new Date(searchCriteria.value.endDate)
      endDate.setHours(23, 59, 59, 999)
      params.endDate = endDate.toISOString()
    }

    // 處理操作人員和被操作對象
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

    const response = await apiAuth.get('/auditlog/all', { params })

    if (response.data.success) {
      const { data, totalItems } = response.data.result
      tableItems.value = data
      tableItemsLength.value = totalItems

      // 處理頁數超出範圍的情況
      const maxPage = Math.ceil(totalItems / tableItemsPerPage.value)
      if (maxPage > 0 && tablePage.value > maxPage) {
        tablePage.value = maxPage
        await performSearch() // 重新取得正確頁面的資料
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
  // 更新頁面狀態
  tablePage.value = page
  tableItemsPerPage.value = itemsPerPage
  if (sortBy?.length > 0) {
    tableSortBy.value = sortBy
  }

  // 重新載入資料
  await performSearch()
}

// 監聽日期變化
watch(
  [
    () => searchCriteria.value.startDate,
    () => searchCriteria.value.endDate
  ],
  ([newStartDate, newEndDate]) => {
    if (newStartDate && newEndDate) {
      const start = new Date(newStartDate)
      const end = new Date(newEndDate)
      if (start > end) {
        createSnackbar({
          text: '結束日期不能早於開始日期',
          snackbarProps: { color: 'warning' }
        })
        // 可以選擇自動清空結束日期
        searchCriteria.value.endDate = null
      }
    }
  }
)

// 監聽資料類型變更
watch(() => searchCriteria.value.targetModel, (newValue) => {
  // 當資料類型改變時,清空操作對象
  searchCriteria.value.targetId = null
  targetSearchInput.value = ''
  targetSuggestions.value = []
})

// 初始載入
onMounted(async () => {
  await performSearch()
})
</script>

<style lang="scss" scoped>
@import '/src/styles/settings.scss';
// 添加表格相關樣式
:deep(.header-bg) {
  background-color: #5e5858;
  color: white;
}

.odd-row {
  background-color: #fcfcfc;
}

.even-row {
  background-color: rgb(245, 255, 251);
}

// 保留原有的樣式
.v-data-table {
  :deep(.text-wrap) {
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.target-cell {
  white-space: pre-line;
  line-height: 1.5;
  padding: 4px 0;
}

.change-list {
  padding-left: 16px;
  list-style-type: disc;

  li {
    line-height: 1.2;
    white-space: pre-wrap; /* 保留換行 */
    word-break: break-word; /* 防止文字過長溢出 */
  }
}

/* 在 data table 中的樣式 */
:deep(.v-data-table) {
  td {
    white-space: pre-line;  // 添加這行
  }
}

</style>
