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
              <v-col>
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
                  @click="openDepartmentDialog"
                >
                  新增部門
                </v-btn>
              </v-col>
              <v-col
                cols="6"
                sm="4"
                md="3"
                lg="2"
              >
                <v-select
                  v-model="companyFilter"
                  :items="[{ name: '全部', id: '' }, ...companies]"
                  label="選擇公司"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="loadDepartments(true)"
                />
              </v-col>
              <v-col
                cols="6"
                sm="4"
                md="3"
                class="d-flex justify-end align-center"
              >
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
              v-model:items-per-page="tableItemsPerPage"
              v-model:sort-by="tableSortBy"
              :headers="filteredHeaders"
              :items="departments"
              :items-length="tableItemsLength"
              :loading="tableLoading"
              :page="tablePage"
              :items-per-page-options="[10, 20, 50]"
              :search="tableSearch"
              class="rounded-ts-lg rounded-te-lg py-3"
              hover
              @update:options="handleTableUpdate"
            >
              <template #item="{ item }">
                <tr>
                  <td>{{ item.departmentId || '尚未設定' }}</td>
                  <td v-if="smAndUp">
                    {{ item.companyId?.name }}
                  </td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.memberCount || 0 }} 人</td>
                  <td class="text-center">
                    <v-btn
                      icon
                      color="light-blue-darken-4"
                      variant="plain"
                      class="me-2"
                      @click="openEditDepartment(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="red-lighten-1"
                      variant="plain"
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
      width="600"
    >
      <v-card class="rounded-lg pa-4">
        <v-card-title class="text-h6 ps-4 py-3">
          公司管理
        </v-card-title>
        <v-card-text>
          <div class="mb-4">
            <v-chip
              v-for="company in companies"
              :key="company.id"
              class="me-2 mb-2 pa-2"
              color="blue-grey-lighten-4"
            >
              {{ company.companyId }} {{ company.name }}
              <v-btn
                icon
                size="x-small"
                class="ms-2"
                @click="openEditCompany(company)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                size="x-small"
                class="ms-1"
                @click="confirmDeleteCompany(company)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-chip>
          </div>
          <v-form @submit.prevent="submitCompany">
            <v-text-field
              v-model="companyForm.name"
              :error-messages="companyErrors"
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
                @click="closeCompanyDialog"
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
      width="400"
    >
      <v-card class="rounded-lg pa-4">
        <v-card-title class="text-h6 ps-4 py-3">
          {{ departmentDialog.id ? '編輯部門' : '新增部門' }}
        </v-card-title>
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
              v-model="departmentForm.companyId"
              :items="companies"
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
                @click="closeDepartmentDialog"
              >
                取消
              </v-btn>
              <v-btn
                color="teal-darken-1"
                variant="outlined"
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
      :message="`確定要刪除公司「${deleteCompanyDialog.name}」嗎？此操作無法復原。`"
      :expected-name="deleteCompanyDialog.name"
      input-label="公司名稱"
      @confirm="deleteCompany"
    />

    <ConfirmDeleteDialogWithTextField
      v-model="deleteDepartmentDialog.open"
      title="確認刪除部門"
      :message="`確定要刪除部門「${deleteDepartmentDialog.name}」嗎？此操作無法復原。`"
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

const { smAndUp } = useDisplay()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

// 表格相關
const tableLoading = ref(false)
const tableItemsPerPage = ref(10)
const tableSortBy = ref([{ key: 'departmentId', order: 'asc' }])
const tablePage = ref(1)
const tableItemsLength = ref(0)
const tableSearch = ref('')
const companyFilter = ref('')

const tableHeaders = [
  { title: '編號', key: 'departmentId', align: 'start', width: '15%', sortable: true },
  { title: '公司', key: 'companyId', align: 'start', width: '25%', sortable: true },
  { title: '部門', key: 'name', align: 'start', width: '30%', sortable: true },
  { title: '人數', key: 'memberCount', align: 'start', sortable: true },
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
const deleteDepartmentDialog = ref({ open: false, id: '', name: '' })
const departmentForm = ref({
  companyId: '',
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

// 載入部門列表
const loadDepartments = async (reset = false) => {
  if (reset) {
    tablePage.value = 1
  }

  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/department/all', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'departmentId',
        sortOrder: tableSortBy.value[0]?.order || 'asc',
        search: tableSearch.value,
        companyId: companyFilter.value
      }
    })
    if (data.success) {
      departments.value = data.result.data
      tableItemsLength.value = data.result.totalItems
    }
  } catch (error) {
    createSnackbar({
      text: '載入部門列表失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
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
      closeCompanyDialog()
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
      companyId: editCompanyDialog.value.companyId,
      name: editCompanyDialog.value.name
    })
    if (data.success) {
      const index = companies.value.findIndex(c => c._id === editCompanyDialog.value._id)
      if (index !== -1) {
        companies.value[index] = data.result
      }
      closeEditCompanyDialog()
      createSnackbar({
        text: '修改公司成功',
        snackbarProps: { color: 'teal-lighten-1' }
      })
    }
  } catch (error) {
    editCompanyErrors.value = [error?.response?.data?.message || '修改失敗']
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
    companyId: '',
    name: '',
    departmentId: '',
    hasChanges: true // 新增時預設為 true
  }
}

const closeDepartmentDialog = () => {
  departmentDialog.value = { open: false, id: null }
  departmentForm.value = {
    companyId: '',
    name: '',
    departmentId: '',
    originalData: null,
    hasChanges: false
  }
  departmentNameError.value = []
  departmentCompanyError.value = []
}

const openEditDepartment = (department) => {
  departmentDialog.value = { open: true, id: department._id } // 改用 _id
  departmentForm.value = {
    companyId: department.companyId._id, // 如果是 ref 的話需要拿到 _id
    name: department.name,
    departmentId: department.departmentId,
    originalData: {
      companyId: department.companyId._id,
      name: department.name,
      departmentId: department.departmentId
    },
    hasChanges: false
  }
}

const submitDepartment = async () => {
  departmentNameError.value = []
  departmentCompanyError.value = []

  if (!departmentForm.value.companyId) {
    departmentCompanyError.value = ['請選擇公司']
    return
  }
  if (!departmentForm.value.name) {
    departmentNameError.value = ['請輸入部門名稱']
    return
  }

  isSubmitting.value = true
  try {
    if (departmentDialog.value.id) {
      // 編輯部門時移除 departmentId 欄位，因為不允許修改
      const { data } = await apiAuth.patch(`/department/${departmentDialog.value.id}`, {
        companyId: departmentForm.value.companyId,
        name: departmentForm.value.name,
        departmentId: departmentForm.value.departmentId
      })
      if (data.success) {
        await loadDepartments() // 重新載入部門資料
        closeDepartmentDialog()
        createSnackbar({
          text: '修改部門成功',
          snackbarProps: { color: 'teal-lighten-1' }
        })
      }
    } else {
      const { data } = await apiAuth.post('/department', {
        companyId: departmentForm.value.companyId,
        name: departmentForm.value.name
      })
      if (data.success) {
        createSnackbar({
          text: '新增部門成功',
          snackbarProps: { color: 'teal-lighten-1' }
        })
      }
    }
    await loadDepartments()
    closeDepartmentDialog()
  } catch (error) {
    const errorMessage = error?.response?.data?.message || '操作失敗'
    if (error?.response?.data?.field === 'name') {
      departmentNameError.value = [errorMessage]
    } else if (error?.response?.data?.field === 'companyId') {
      departmentCompanyError.value = [errorMessage]
    } else {
      createSnackbar({
        text: errorMessage,
        snackbarProps: { color: 'red-lighten-1' }
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const confirmDeleteDepartment = (department) => {
  deleteDepartmentDialog.value = {
    open: true,
    id: department._id, // 使用 _id
    name: department.name
  }
}

const deleteDepartment = async () => {
  try {
    await apiAuth.delete(`/department/${deleteDepartmentDialog.value.id}`)
    await loadDepartments()
    deleteDepartmentDialog.value.open = false
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
    departmentForm.value.companyId !== departmentForm.value.originalData.companyId ||
    departmentForm.value.name !== departmentForm.value.originalData.name ||
    departmentForm.value.departmentId !== departmentForm.value.originalData.departmentId
  )
})

// 監聽和更新
const handleTableUpdate = (options) => {
  tablePage.value = options.page
  tableItemsPerPage.value = options.itemsPerPage
  tableSortBy.value = options.sortBy
  loadDepartments()
}

const debouncedSearch = debounce(() => {
  loadDepartments(true)
}, 300)

watch(tableSearch, () => {
  debouncedSearch()
})

watch([tableItemsPerPage, tableSortBy, companyFilter], () => {
  loadDepartments(true)
})

onMounted(async () => {
  await loadCompanies()
  await loadDepartments()
})

onUnmounted(() => {
  debouncedSearch.cancel()
})
</script>

<style lang="scss" scoped>
.header-bg {
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
