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
            <v-card class="elevation-4 rounded-xl py-8 px-4 px-sm-4 px-xl-8">
              <v-card-title class="font-weight-bold d-flex align-center">
                搜尋條件
                <v-icon
                  v-if="smAndUp"
                  v-tooltip:top="'操作人員:員編或姓名；操作對象:員編、姓名、部門編號、設備編號'"
                  icon="mdi-information"
                  color="grey-darken-2"
                  size="x-small"
                  class="ms-2"
                />
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
                      @update:search="handleTargetSearch"
                      @click:clear="clearTargetSearch"
                    >
                      <template #selection="{ item }">
                        {{ getTargetDisplayText(item.props.value) }}
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
        lg="9"
        class="px-6 ps-lg-4 pe-lg-12 mb-6"
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
                  <td v-if="mdAndUp">
                    {{ item.action }}
                  </td>
                  <td v-if="smAndUp">
                    {{ formatTarget(item) }}
                  </td>
                  <td v-if="lgAndUp">
                    <div
                      v-for="(change, idx) in formatChanges(item)"
                      :key="idx"
                    >
                      {{ change }}
                    </div>
                  </td>
                  <td class="text-center">
                    <v-btn
                      icon
                      color="blue-grey-darken-3"
                      variant="text"
                      size="small"
                      class="my-2"
                      @click="showDetail(item)"
                    >
                      <v-icon>mdi-book-open-variant-outline</v-icon>
                    </v-btn>
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
      <v-card-title class="text-h6 ps-6 pt-4 pb-3">
        異動詳細資料
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div class="d-flex flex-column gap-4">
              <div>
                <div
                  class="text-grey-darken-1"
                  style="font-size: 15px; font-weight: 600;"
                >
                  操作時間
                </div>
                <div>{{ formatDateTime(selectedItem?.createdAt) }}</div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1"
                  style="font-size: 15px; font-weight: 600;"
                >
                  操作人員
                </div>
                <div>{{ formatOperator(selectedItem) }}</div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1"
                  style="font-size: 15px; font-weight: 600;"
                >
                  操作對象
                </div>
                <div>{{ formatTarget(selectedItem) }}</div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1"
                  style="font-size: 15px; font-weight: 600;"
                >
                  操作類型
                </div>
                <div>{{ selectedItem?.action }}</div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1"
                  style="font-size: 15px; font-weight: 600;"
                >
                  資料類型
                </div>
                <div>{{ getModelDisplay(selectedItem?.targetModel) }}</div>
              </div>
              <v-divider class="my-2" />
              <div>
                <div
                  class="text-grey-darken-1"
                  style="font-size: 15px; font-weight: 600;"
                >
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
import { ref, computed, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useApi } from '@/composables/axios'
import { debounce } from 'lodash'
import { definePage } from 'vue-router/auto'
import { companyNames } from '@/enums/Company'
import UserRole, { roleNames } from '@/enums/UserRole'
import { useSnackbar } from 'vuetify-use-dialog'

definePage({
  meta: {
    title: '異動紀錄 | ystravel',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
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

const getTargetDisplayText = (item) => {
  if (!item) return ''

  switch (targetType.value) {
    case 'users':
      return `${item.name} (${item.userId})`
    case 'departments':
      return `${item.name} (${item.departmentId}) - ${companyNames[item.companyId]}`
    case 'assets':
      return `${item.name} (${item.assetId})`
    default:
      return item.name || ''
  }
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
  guideLicense: '領隊證',
  salary: '薪資',
  birthDate: '生日',
  resignationDate: '離職日期',
  emergencyName: '緊急聯絡人',
  emergencyCellphone: '緊急聯絡電話',
  emergencyRelationship: '緊急聯絡人關係',
  permanentAddress: '戶籍地址',
  contactAddress: '聯絡地址',
  IDNumber: '身分證號碼',
  userId: '員工編號',
  departmentId: '部門編號'
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

  // 如果沒有選擇資料類型,提示用戶
  if (!targetType.value) {
    createSnackbar({
      text: '請先選擇資料類型',
      snackbarProps: { color: 'warning' }
    })
    targetSuggestions.value = []
    return
  }

  targetLoading.value = true
  try {
    let response
    switch (targetType.value) {
      case 'users':
        response = await apiAuth.get('/user/suggestions', {
          params: { search: text }
        })
        if (response.data.success) {
          targetSuggestions.value = response.data.result
        }
        break
      case 'departments':
        response = await apiAuth.get('/department/all', {
          params: {
            search: text,
            searchFields: ['name', 'departmentId'] // 添加 departmentId 搜尋
          }
        })
        if (response.data.success) {
          targetSuggestions.value = response.data.result.data.map(dept => ({
            _id: dept._id,
            name: dept.name,
            departmentId: dept.departmentId,
            companyId: dept.companyId
          }))
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
  if (!item.targetModel) return '-'

  let displayText = '-'

  switch (item.targetModel) {
    case 'users':
      displayText = `${item.target.name || ''} ${item.target.userId ? `(${item.target.userId})` : ''}`
      break
    case 'departments': {
      // 優先使用從資料庫查到的資料
      if (item.target.name) {
        const firstLine = `${item.target.name} ${item.target.departmentId ? `(${item.target.departmentId})` : ''}`
        const secondLine = companyNames[item.target.companyId] || ''
        displayText = `${firstLine}\n${secondLine}` // 使用明確的換行符
      } else {
        // 如果沒有,使用 changes 中的資料
        const changes = item.changes || {}
        const deptName = changes.name?.from || changes.name?.to || ''
        const companyName = changes.company?.from || changes.company?.to ||
                          companyNames[changes.companyId?.from] || companyNames[changes.companyId?.to] || ''
        displayText = `${deptName}\n${companyName}` // 使用明確的換行符
      }
      break
    }
    case 'assets':
      displayText = `${item.target.name || ''} ${item.target.assetId ? `(${item.target.assetId})` : ''}`
      break
    default:
      displayText = '-'
  }

  return displayText
}

// 格式化變更內容
const formatChanges = (item) => {
  // 如果沒有 item 或 changes，返回空數組
  if (item.action === '創建') {
    if (item.targetModel === 'departments') {
      const { name, company, departmentId } = item.changes || {}
      const parts = []
      if (name?.to) parts.push(`部門名稱: ${name.to}`)
      if (departmentId?.to) parts.push(`部門編號: ${departmentId.to}`)
      if (company?.to) parts.push(`公司: ${company.to}`)
      return parts.length > 0 ? [parts.join(', ')] : ['新增部門']
    } else if (item.targetModel === 'users') {
      const target = item.target || {}
      return [`新增員工: ${target.name || ''} ${target.userId ? `(${target.userId})` : ''}`]
    }
    return ['新增資料']
  }

  // 處理刪除操作
  if (item.action === '刪除') {
    if (item.targetModel === 'departments') {
      const name = item.changes?.name || ''
      const departmentId = item.changes?.departmentId || ''
      const company = item.changes?.company || companyNames[item.changes?.companyId] || ''
      const parts = []
      if (name) parts.push(name)
      if (departmentId) parts.push(`(${departmentId})`)
      if (company) parts.push(company)
      return [`刪除部門: ${parts.join(' ')}`]
    } else if (item.targetModel === 'users') {
      const changes = item.changes || {}
      const name = changes.name || ''
      const userId = changes.userId || ''
      return [`刪除員工: ${name} ${userId ? `(${userId})` : ''}`]
    }
    return ['刪除資料']
  }

  // 處理修改操作
  if (item.targetModel === 'departments') {
    const changes = []
    const changesObj = item.changes || {}

    if (changesObj.name && changesObj.name.from !== changesObj.name.to) {
      changes.push(`部門名稱: ${changesObj.name.from || '-'} → ${changesObj.name.to || '-'}`)
    }

    if (changesObj.departmentId && changesObj.departmentId.from !== changesObj.departmentId.to) {
      changes.push(`部門編號: ${changesObj.departmentId.from || '-'} → ${changesObj.departmentId.to || '-'}`)
    }

    if (changesObj.company && changesObj.company.from !== changesObj.company.to) {
      changes.push(`公司: ${changesObj.company.from || '-'} → ${changesObj.company.to || '-'}`)
    } else if (changesObj.companyId && changesObj.companyId.from !== changesObj.companyId.to) {
      changes.push(`公司: ${companyNames[changesObj.companyId.from] || '-'} → ${companyNames[changesObj.companyId.to] || '-'}`)
    }

    return changes
  }

  // 處理其他資料的修改
  const changes = []
  // 先檢查是否有簡單描述字串
  if (typeof item.changes.description === 'string') {
    changes.push(item.changes.description)
    return changes
  }

  // 處理 from/to 格式的變更
  for (const [key, value] of Object.entries(item.changes)) {
    if (!value || (!value.from && !value.to && !['department', 'company'].includes(key))) continue

    // 如果值是字串，直接使用該值
    if (typeof value === 'string') {
      const fieldName = fieldTranslations[key] || key
      changes.push(`${fieldName}: ${value}`)
      continue
    }

    const fieldName = fieldTranslations[key] || key
    let fromValue = value.from
    let toValue = value.to

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
</style>
