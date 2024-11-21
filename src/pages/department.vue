<template>
  <v-container max-width="1400">
    <v-row class="elevation-4 rounded-xl py-4 py-sm-8 px-1 px-sm-10 mt-2 mt-sm-6 mx-0 mx-sm-4 mx-md-10 mb-4 bg-white">
      <v-col
        cols="12"
        class="ps-3 pb-6 d-flex align-center"
      >
        <h3>公司部門管理</h3>
        <v-icon
          v-if="smAndUp"
          v-tooltip="'人數為「在職」人數'"
          icon="mdi-information"
          size="small"
          color="blue-grey-darken-2"
          class="ms-4"
        />
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col>
            <v-row>
              <v-col
                v-if="!mdAndUp"
                cols="6"
              >
                <v-btn
                  prepend-icon="mdi-domain"
                  variant="outlined"
                  color="blue-grey-darken-2"
                  class="me-2"
                  block
                  @click="openCompanyDialog"
                >
                  公司管理
                </v-btn>
              </v-col>
              <v-col
                v-if="!mdAndUp"
                cols="6"
              >
                <v-btn
                  prepend-icon="mdi-account-multiple-plus"
                  variant="outlined"
                  color="blue-grey-darken-2"
                  block
                  @click="openDepartmentDialog"
                >
                  新增部門
                </v-btn>
              </v-col>
              <v-col
                v-if="mdAndUp"
              >
                <v-btn
                  prepend-icon="mdi-domain"
                  variant="outlined"
                  color="blue-grey-darken-2"
                  class="me-2"
                  @click="openCompanyDialog"
                >
                  公司管理
                </v-btn>
                <v-btn
                  prepend-icon="mdi-account-multiple-plus"
                  variant="outlined"
                  color="blue-grey-darken-2"
                  class="ms-3"
                  @click="openDepartmentDialog"
                >
                  新增部門
                </v-btn>
              </v-col>
              <v-col
                cols="6"
                md="3"
                lg="2"
              >
                <v-select
                  v-model="companyFilter"
                  :items="[{ name: '全部', _id: '' }, ...sortedCompanies]"
                  label="選擇公司"
                  item-title="name"
                  item-value="_id"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="loadDepartments(true)"
                />
              </v-col>
              <v-col
                cols="6"
                md="3"
                lg="2"
                class="d-flex justify-end align-center"
              >
                <v-icon
                  v-if="smAndUp"
                  v-tooltip:top="'可搜尋部門編號、部門名稱'"
                  icon="mdi-information"
                  size="small"
                  color="blue-grey-darken-2"
                  class="me-4"
                />
                <v-text-field
                  v-model="tableSearch"
                  label="搜尋"
                  append-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-data-table-server
              :key="tableKey"
              v-model:items-per-page="tableItemsPerPage"
              v-model:sort-by="tableSortBy"
              :items="departments"
              :items-length="tableItemsLength"
              :loading="tableLoading"
              :page="tablePage"
              :headers="filteredHeaders"
              :header-props="headerProps"
              density="compact"
              :items-per-page-options="[10, 20, 50]"
              hover
              @update:options="handleTableUpdate"
            >
              <template #item="{ item, index }">
                <tr :class="{ 'odd-row': index % 2 === 0, 'even-row': index % 2 !== 0 }">
                  <td>{{ item.departmentId || '尚未設定' }}</td>
                  <td v-if="smAndUp">
                    {{ item.c_id?.name || '未設定' }}
                  </td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.employeeCount }} 人</td>
                  <td class="d-flex justify-center h-25">
                    <v-btn
                      icon
                      color="light-blue-darken-4"
                      variant="plain"
                      :size="buttonSize"
                      :ripple="false"
                      @click="openEditDepartment(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="red-lighten-1"
                      variant="plain"
                      :size="buttonSize"
                      :ripple="false"
                      @click="confirmDeleteDepartment(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 公司管理 Dialog -->
    <v-dialog
      v-model="companyDialog.open"
      persistent
      width="395"
    >
      <v-card class="rounded-lg pa-4">
        <div class="card-title ps-6 py-3">
          公司管理
        </div>
        <v-card-text class="px-4 pb-2">
          <div class="mb-8">
            <v-chip
              v-for="company in sortedCompanies"
              :key="company._id"
              class="ms-2 me-4 mb-2 pa-4 pe-1"
              color="blue-grey-darken-2"
              label
            >
              <span class="text-pink-lighten-2">{{ company.companyId }}&nbsp;</span>  {{ company.name }}
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    class="ms-2"
                    :ripple="false"
                    color="white"
                    v-bind="props"
                  >
                    <v-icon color="cyan-darken-3">
                      mdi-dots-vertical
                    </v-icon>
                  </v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item
                    density="compact"
                    class="ps-2 pe-3 py-0"
                    @click="openEditCompany(company)"
                  >
                    <v-icon
                      icon="mdi-pencil"
                      size="16"
                      color="light-blue-darken-4"
                    />
                    <span
                      style="font-size: 14px;"
                      class="ps-2 text-blue-grey-darken-2"
                    >編輯</span>
                  </v-list-item>
                  <v-list-item
                    density="compact"
                    class="ps-2 pe-3 py-0"
                    color="red-lighten-1"
                    @click="confirmDeleteCompany(company)"
                  >
                    <v-icon
                      icon="mdi-delete"
                      size="16"
                      color="red-lighten-1"
                    />
                    <span
                      style="font-size: 14px;"
                      class="ps-2 text-blue-grey-darken-2"
                    >刪除</span>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-chip>
          </div>
          <v-form @submit.prevent="submitCompany">
            <v-text-field
              v-model="companyForm.name"
              :error-messages="companyErrors"
              label="新增公司"
              required
              variant="outlined"
              density="compact"
              class="px-2"
            />
            <v-card-actions class="pa-0 mt-2">
              <v-spacer />
              <v-btn
                color="red-lighten-1"
                variant="outlined"
                :size="buttonSize"
                @click="closeCompanyDialog"
              >
                取消
              </v-btn>
              <v-btn
                color="teal-darken-1"
                variant="outlined"
                type="submit"
                :size="buttonSize"
                :loading="isSubmitting"
                class="ms-2"
              >
                新增
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 編輯公司 Dialog -->
    <v-dialog
      v-model="editCompanyDialog.open"
      persistent
      width="400"
    >
      <v-card class="rounded-lg pa-4">
        <v-card-title class="text-h6 ps-4 py-3">
          編輯公司
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitEditCompany">
            <v-text-field
              v-model="editCompanyDialog.companyId"
              label="公司編號"
              variant="outlined"
              density="compact"
              class="mb-4"
            />
            <v-text-field
              v-model="editCompanyDialog.name"
              :error-messages="editCompanyErrors"
              label="公司名稱"
              required
              variant="outlined"
              density="compact"
            />
            <v-card-actions class="pa-0 mt-4">
              <v-spacer />
              <v-btn
                color="red-lighten-1"
                variant="outlined"
                @click="closeEditCompanyDialog"
              >
                取消
              </v-btn>
              <v-btn
                color="teal-darken-1"
                variant="outlined"
                type="submit"
                :loading="isSubmitting"
                class="ms-2"
              >
                修改
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 部門管理 Dialog -->
    <v-dialog
      v-model="departmentDialog.open"
      persistent
      width="360"
    >
      <v-card class="rounded-lg px-4 pt-4 pb-1">
        <div class="card-title ps-6 py-3">
          {{ departmentDialog.id ? '編輯部門' : '新增部門' }}
        </div>
        <v-card-text>
          <v-form @submit.prevent="submitDepartment">
            <template v-if="departmentDialog.id">
              <v-text-field
                v-model="departmentForm.departmentId"
                label="部門編號"
                variant="outlined"
                density="compact"
                class="mb-4"
              />
            </template>
            <v-select
              v-model="departmentForm.c_id"
              :items="sortedCompanies"
              label="選擇公司"
              item-title="name"
              item-value="_id"
              required
              variant="outlined"
              density="compact"
              class="mb-4"
              :error-messages="departmentCompanyError"
            />
            <v-text-field
              v-model="departmentForm.name"
              label="部門名稱"
              required
              variant="outlined"
              density="compact"
              :error-messages="departmentNameError"
            />
            <v-card-actions class="pa-0 mt-4">
              <v-spacer />
              <v-btn
                color="red-lighten-1"
                variant="outlined"
                :size="buttonSize"
                @click="closeDepartmentDialog"
              >
                取消
              </v-btn>
              <v-btn
                color="teal-darken-1"
                variant="outlined"
                :size="buttonSize"
                type="submit"
                :loading="isSubmitting"
                :disabled="departmentDialog.id ? !hasFormChanges : false"
                class="ms-2"
              >
                {{ departmentDialog.id ? '修改' : '新增' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 刪除確認 Dialog -->
    <ConfirmDeleteDialogWithTextField
      v-model="deleteCompanyDialog.open"
      title="確認刪除公司"
      :message="`確定要刪除公司「<span class='text-pink-lighten-1' style='font-weight: 800;'>${deleteCompanyDialog.name}</span>」嗎？此操作無法復原。`"
      :expected-name="deleteCompanyDialog.name"
      input-label="公司名稱"
      @confirm="deleteCompany"
    />

    <!-- 部門刪除確認 Dialog -->
    <ConfirmDeleteDialogWithTextField
      v-model="deleteDepartmentDialog.open"
      title="確認刪除部門"
      :message="`確定要刪除「<span class='text-teal-darken-2' style='font-weight: 800;'>${deleteDepartmentDialog.companyName}</span>」的「<span class='text-pink-lighten-1' style='font-weight: 800;'>${deleteDepartmentDialog.name}</span>」嗎？此操作無法復原。`"
      :expected-name="deleteDepartmentDialog.name"
      input-label="部門名稱"
      @confirm="deleteDepartment"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDisplay } from 'vuetify'
import { debounce } from 'lodash'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { definePage } from 'vue-router/auto'
import UserRole from '@/enums/UserRole'
import ConfirmDeleteDialogWithTextField from '@/components/ConfirmDeleteDialogWithTextField.vue'

definePage({
  meta: {
    title: '公司部門管理 | ysphere',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  }
})

const { smAndUp, mdAndUp } = useDisplay()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})

// 表格相關
const tableKey = ref(0)
const tableLoading = ref(false)
const tableItemsPerPage = ref(10)
const tableSortBy = ref([{ key: 'departmentId', order: 'asc' }])
const tablePage = ref(1)
const tableItemsLength = ref(0) // 確保有初始值
const tableSearch = ref('')
const companyFilter = ref('')
const headerProps = {
  class: 'header-bg'
}

const tableHeaders = [
  { title: '部編', key: 'departmentId', align: 'start', minWidth: '68px', sortable: true },
  { title: '公司', key: 'c_id.name', align: 'start', minWidth: '68px', sortable: true },
  { title: '部門', key: 'name', align: 'start', minWidth: '68px', sortable: true },
  { title: '人數', key: 'memberCount', align: 'start', sortable: false },
  { title: '操作', key: 'actions', align: 'center', sortable: false }
]

const filteredHeaders = computed(() => {
  return smAndUp.value
    ? tableHeaders
    : tableHeaders.filter(header =>
      ['departmentId', 'name', 'memberCount', 'actions'].includes(header.key)
    )
})

// 公司相關
const companies = ref([])
const companyDialog = ref({ open: false })
const editCompanyDialog = ref({ open: false, _id: '', companyId: '', name: '' })
const deleteCompanyDialog = ref({ open: false, _id: '', name: '' })
const companyForm = ref({ name: '' })
const companyErrors = ref([])
const editCompanyErrors = ref([])

// 部門相關
const departments = ref([])
const departmentDialog = ref({ open: false, id: null })
const deleteDepartmentDialog = ref({ open: false, id: '', name: '', companyName: '' })
const departmentForm = ref({
  c_id: '',
  name: '',
  departmentId: '',
  hasChanges: true // 新增時預設為 true
})
const departmentNameError = ref([])
const departmentCompanyError = ref([])

const isSubmitting = ref(false)

// 載入公司列表
const loadCompanies = async () => {
  try {
    const { data } = await apiAuth.get('/company/all')
    if (data.success) {
      companies.value = data.result
    }
  } catch (error) {
    createSnackbar({
      text: '載入公司列表失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

const sortedCompanies = computed(() => {
  return [...companies.value].sort((a, b) => {
    // 確保 companyId 存在
    const idA = a.companyId || ''
    const idB = b.companyId || ''
    return idA.localeCompare(idB)
  })
})

// 載入部門列表
const loadDepartments = async (reset = false) => {
  if (reset) {
    tablePage.value = 1
  }

  tableLoading.value = true
  try {
    const params = {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'departmentId',
      sortOrder: tableSortBy.value[0]?.order || 'asc',
      companyId: companyFilter.value || null,
      search: tableSearch.value || null
    }

    const { data } = await apiAuth.get('/department/all', { params })

    if (data.success) {
      departments.value = data.result.data
      tableItemsLength.value = data.result.pagination.totalItems
      console.log('Total items:', tableItemsLength.value) // 用於調試
    }
  } catch (error) {
    createSnackbar({
      text: '載入部門列表失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
    departments.value = []
    tableItemsLength.value = 0
  } finally {
    tableLoading.value = false
  }
}

// 公司相關操作
const openCompanyDialog = async () => {
  companyDialog.value.open = true
  await loadCompanies()
}

const closeCompanyDialog = () => {
  companyDialog.value.open = false
  companyForm.value = { name: '' }
  companyErrors.value = []
}

const openEditCompany = (company) => {
  editCompanyDialog.value = {
    open: true,
    _id: company._id, // 改用 _id
    companyId: company.companyId,
    name: company.name
  }
}

const closeEditCompanyDialog = () => {
  editCompanyDialog.value = {
    open: false,
    id: '',
    companyId: '',
    name: ''
  }
  editCompanyErrors.value = []
}

const submitCompany = async () => {
  if (!companyForm.value.name) {
    companyErrors.value = ['請輸入公司名稱']
    return
  }
  isSubmitting.value = true
  try {
    const { data } = await apiAuth.post('/company', {
      name: companyForm.value.name
    })
    if (data.success) {
      companies.value.push(data.result)
      companyForm.value = { name: '' }
      companyErrors.value = []
      createSnackbar({
        text: '新增公司成功',
        snackbarProps: { color: 'teal-lighten-1' }
      })
    }
  } catch (error) {
    companyErrors.value = [error?.response?.data?.message || '新增失敗']
  } finally {
    isSubmitting.value = false
  }
}

const submitEditCompany = async () => {
  if (!editCompanyDialog.value.name) {
    editCompanyErrors.value = ['請輸入公司名稱']
    return
  }
  isSubmitting.value = true
  try {
    const { data } = await apiAuth.patch(`/company/${editCompanyDialog.value._id}`, {
      name: editCompanyDialog.value.name,
      companyId: editCompanyDialog.value.companyId
    })
    if (data.success) {
      const index = companies.value.findIndex(c => c._id === editCompanyDialog.value._id)
      if (index !== -1) {
        companies.value[index] = data.result
      }
      editCompanyDialog.value = {
        open: true, // 保持 dialog 打開
        _id: '',
        companyId: '',
        name: ''
      }
      editCompanyErrors.value = []
      closeEditCompanyDialog()
      createSnackbar({
        text: '修改公司成功',
        snackbarProps: { color: 'teal-lighten-1' }
      })
    }
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '修改失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    isSubmitting.value = false
  }
}

const confirmDeleteCompany = (company) => {
  deleteCompanyDialog.value = {
    open: true,
    _id: company._id, // 改用 _id
    name: company.name
  }
}

const deleteCompany = async () => {
  try {
    await apiAuth.delete(`/company/${deleteCompanyDialog.value._id}`)
    companies.value = companies.value.filter(c => c._id !== deleteCompanyDialog.value._id)
    deleteCompanyDialog.value.open = false
    createSnackbar({
      text: '刪除公司成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 部門相關操作
const openDepartmentDialog = () => {
  departmentDialog.value.open = true
  departmentForm.value = {
    c_id: '',
    name: '',
    departmentId: '',
    hasChanges: true // 新增時預設為 true
  }
}

const closeDepartmentDialog = () => {
  departmentDialog.value = { open: false, id: null }
  departmentForm.value = {
    c_id: '', // 改為 c_id
    name: '',
    departmentId: '',
    originalData: null,
    hasChanges: false
  }
  departmentNameError.value = []
  departmentCompanyError.value = []
}

const openEditDepartment = (department) => {
  console.log('編輯部門資料:', department) // 調試用
  departmentDialog.value = { open: true, id: department._id }

  const companyId = department.c_id?._id || department.c_id

  departmentForm.value = {
    c_id: companyId,
    name: department.name,
    departmentId: department.departmentId,
    originalData: {
      c_id: companyId,
      name: department.name,
      departmentId: department.departmentId
    },
    hasChanges: false
  }

  console.log('設置後的表單值:', departmentForm.value) // 調試用
}

const submitDepartment = async () => {
  departmentNameError.value = []
  departmentCompanyError.value = []

  // 前端驗證
  if (!departmentForm.value.c_id) {
    departmentCompanyError.value = ['請選擇公司']
    return
  }
  if (!departmentForm.value.name) {
    departmentNameError.value = ['請輸入部門名稱']
    return
  }

  isSubmitting.value = true
  const currentPageNumber = tablePage.value // 保存當前頁碼
  try {
    if (departmentDialog.value.id) {
      const { data } = await apiAuth.patch(`/department/${departmentDialog.value.id}`, {
        c_id: departmentForm.value.c_id,
        name: departmentForm.value.name,
        departmentId: departmentForm.value.departmentId
      })
      if (data.success) {
        closeDepartmentDialog()
        createSnackbar({
          text: '修改部門成功',
          snackbarProps: { color: 'teal-lighten-1' }
        })
        // 恢復先前的頁碼
        tablePage.value = currentPageNumber
        await loadDepartments(false) // 只需要加載一次
      }
    } else {
      const { data } = await apiAuth.post('/department', {
        c_id: departmentForm.value.c_id,
        name: departmentForm.value.name
      })
      if (data.success) {
        await loadDepartments(true) // 新增時重置到第一頁
        closeDepartmentDialog()
        createSnackbar({
          text: '新增部門成功',
          snackbarProps: { color: 'teal-lighten-1' }
        })
      }
    }
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '操作失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    isSubmitting.value = false
  }
}

const confirmDeleteDepartment = (department) => {
  deleteDepartmentDialog.value = {
    open: true,
    id: department._id,
    name: department.name,
    companyName: department.c_id?.name || '未知公司' // 添加公司名稱
  }
}

const deleteDepartment = async () => {
  try {
    const currentPageNumber = tablePage.value // 保存當前頁碼

    await apiAuth.delete(`/department/${deleteDepartmentDialog.value.id}`)
    deleteDepartmentDialog.value.open = false

    // 計算刪除後的數據總數
    tableItemsLength.value--

    // 處理頁面跳轉邏輯
    const totalPages = Math.ceil(tableItemsLength.value / tableItemsPerPage.value)
    if (currentPageNumber > totalPages) {
      tablePage.value = Math.max(1, totalPages)
    } else {
      tablePage.value = currentPageNumber
    }

    await loadDepartments(false)
    createSnackbar({
      text: '刪除部門成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

const hasFormChanges = computed(() => {
  if (!departmentForm.value.originalData) return true // 新增時永遠 true

  return (
    departmentForm.value.c_id !== departmentForm.value.originalData.c_id ||
    departmentForm.value.name !== departmentForm.value.originalData.name ||
    departmentForm.value.departmentId !== departmentForm.value.originalData.departmentId
  )
})

const handleTableUpdate = async (options) => {
  const { page, itemsPerPage, sortBy } = options

  // 更新表格狀態
  tablePage.value = page
  tableItemsPerPage.value = itemsPerPage
  tableSortBy.value = sortBy

  await loadDepartments(false) // 不重置頁碼

  // 保存當前頁碼到 localStorage
  localStorage.setItem('departmentTablePage', page.toString())
}

// 搜尋防抖
const debouncedSearch = debounce(() => {
  loadDepartments(true)
}, 300)

watch(companyFilter, () => {
  loadDepartments(true)
})

// 監聽搜尋和過濾條件變化
watch(tableSearch, () => {
  tablePage.value = 1 // 重置到第一頁
  debouncedSearch()
})

watch([tableItemsPerPage, tableSortBy], () => {
  loadDepartments(true) // 重置到第一頁
})

watch(companyFilter, () => {
  tablePage.value = 1 // 重置到第一頁
  loadDepartments(true)
})

onMounted(async () => {
  // 恢復保存的頁碼
  const storedPage = localStorage.getItem('departmentTablePage')
  if (storedPage && parseInt(storedPage) > 0) {
    tablePage.value = parseInt(storedPage)
    tableKey.value++
  }

  await loadCompanies()
  await loadDepartments(false) // 不重置頁碼
})

onUnmounted(() => {
  // 保存當前頁碼
  localStorage.setItem('departmentTablePage', tablePage.value.toString())
  debouncedSearch.cancel()
})
</script>

<style lang="scss" scoped>

:deep(.header-bg)  {
  background-color: #455A64;
  color: white;
}

.odd-row {
  background-color: #fffffd;
}

.even-row {
  background-color: rgb(247, 253, 255);
}
</style>
