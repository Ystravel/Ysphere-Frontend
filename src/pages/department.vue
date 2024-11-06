<template>
  <v-container max-width="1400">
    <v-row
      class="elevation-4 rounded-xl py-8 px-1 px-sm-10 mt-2 mt-sm-10 mx-0 mx-sm-4 mx-md-10"
    >
      <v-col
        cols="12"
        class="ps-3 pb-6"
      >
        <h3>部門管理</h3>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn
                  prepend-icon="mdi-account-multiple-plus"
                  variant="outlined"
                  color="cyan-darken-3"
                  @click="openDepartmentDialog"
                >
                  新增部門
                </v-btn>
              </v-col>
              <v-col
                cols="3"
                lg="2"
              >
                <v-select
                  v-model="companyFilter"
                  :items="[{ name: '全部', id: '' }, ...companyOptions]"
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
                cols="3"
                lg="2"
                class="d-flex justify-end"
              >
                <v-text-field
                  v-model="tableSearch"
                  label="搜尋"
                  append-inner-icon="mdi-magnify"
                  base-color="#666"
                  color="blue-grey-darken-3"
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
              v-model:page="tablePage"
              :headers="tableHeaders"
              :items="departments"
              :header-props="headerProps"
              :items-length="tableItemsLength"
              :items-per-page-options="[10, 20, 50]"
              :loading="tableLoading"
              :search="tableSearch"
              class="rounded-ts-lg rounded-te-lg py-3"
              hover
              density="compact"
              @update:options="loadDepartments(true)"
            >
              <template #item="{ item, index }">
                <tr :class="{ 'odd-row': index % 2 === 0, 'even-row': index % 2 !== 0 }">
                  <td>{{ companyNames[item.companyId] || '未知公司' }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.memberCount || 0 }} 人</td>
                  <td class="text-center">
                    <v-btn
                      icon
                      color="light-blue-darken-4"
                      variant="plain"
                      width="28"
                      height="40"
                      :ripple="false"
                      @click="openEditDepartment(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="red-lighten-1"
                      variant="plain"
                      width="28"
                      height="40"
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

    <!-- 新增/編輯部門對話框 -->
    <v-dialog
      v-model="dialog.open"
      persistent
      width="360"
    >
      <v-form @submit.prevent="submitDepartment">
        <v-card class="rounded-lg pa-4 pt-6">
          <v-card-title style="font-size: 18px;">
            {{ dialog.id ? '編輯部門' : '新增部門' }}
          </v-card-title>
          <v-card-text class="px-3">
            <v-select
              v-model="departmentCompanyId.value.value"
              :error-messages="departmentCompanyId.errorMessage.value"
              :items="companyOptions"
              item-title="name"
              item-value="id"
              label="選擇公司"
              required
              variant="outlined"
              density="compact"
              class="mb-4"
            />
            <v-text-field
              v-model="departmentName.value.value"
              :error-messages="departmentName.errorMessage.value"
              label="部門名稱"
              required
              variant="outlined"
              density="compact"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="red-lighten-1"
              variant="outlined"
              height="32"
              :loading="isSubmitting"
              @click="closeDialog"
            >
              取消
            </v-btn>
            <v-btn
              color="teal-darken-1"
              variant="outlined"
              type="submit"
              height="32"
              class="ms-1"
              :loading="isSubmitting"
            >
              送出
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <ConfirmDeleteDialog
      v-model="deleteDialog"
      :message="`確定要刪除「${companyNames[selectedDepartment?.companyId]}」的「${selectedDepartment?.name}」嗎？`"
      @confirm="deleteDepartment"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import debounce from 'lodash/debounce'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { definePage } from 'vue-router/auto'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'

definePage({
  meta: {
    title: '公司部門管理 | ystravel',
    login: true,
    admin: true
  }
})

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

// 公司選項
const companyOptions = [
  { id: 1, name: '永信台北' },
  { id: 2, name: '永信桃園' },
  { id: 3, name: '永信台中' },
  { id: 4, name: '永信高雄' },
  { id: 5, name: '好漾台北' },
  { id: 6, name: '好漾台中' },
  { id: 7, name: '銳皇國際' },
  { id: 8, name: '集睿創映' }
]

const companyFilter = ref('')

// 表格樣式設定
const headerProps = {
  class: 'header-bg'
}

// 表格相關
const tableLoading = ref(false)
const tableItemsPerPage = ref(10)
const tableSortBy = ref([{ key: 'companyId', order: 'asc' }])
const tablePage = ref(1)
const tableItemsLength = ref(0)
const tableSearch = ref('')
const tableHeaders = [
  { title: '公司', key: 'companyId', align: 'start', sortable: true },
  { title: '部門', key: 'name', align: 'start', sortable: true },
  { title: '人數(在職)', key: 'memberCount', align: 'start', sortable: true },
  { title: '操作', key: 'actions', align: 'center', sortable: false }
]

// 部門相關
const departments = ref([])
const dialog = ref({ open: false, id: null })
const deleteDialog = ref(false)
const selectedDepartment = ref(null)

// 表單驗證
const schema = yup.object({
  name: yup
    .string()
    .required('請輸入部門名稱'),
  companyId: yup
    .number()
    .required('請選擇所屬公司')
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema
})

const departmentName = useField('name')
const departmentCompanyId = useField('companyId')
const companyNames = Object.fromEntries(companyOptions.map(company => [company.id, company.name]))

// 載入部門列表
const loadDepartments = async (reset = false) => {
  if (reset) tablePage.value = 1
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/department/all', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'companyId',
        sortOrder: tableSortBy.value[0]?.order || 'asc',
        search: tableSearch.value,
        companyId: companyFilter.value
      }
    })

    departments.value = data.result.data.map((dept) => ({
      ...dept,
      companyName: companyNames[dept.companyId] || '未知公司'
    }))
    tableItemsLength.value = data.result.totalItems
  } catch (error) {
    console.error('loadDepartments error:', error)
    createSnackbar({
      text: error?.response?.data?.message || '載入部門列表失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
  tableLoading.value = false
}

// 開啟新增部門對話框
const openDepartmentDialog = () => {
  dialog.value = { open: true, id: null }
  resetForm()
}

// 開啟編輯部門對話框
const openEditDepartment = (department) => {
  dialog.value = { open: true, id: department._id }
  departmentName.value.value = department.name
  departmentCompanyId.value.value = department.companyId
  selectedDepartment.value = department
}

// 關閉對話框
const closeDialog = () => {
  dialog.value.open = false
  resetForm()
  selectedDepartment.value = null
}

// 確認刪除部門
const confirmDeleteDepartment = (department) => {
  selectedDepartment.value = department
  deleteDialog.value = true
}

// 提交部門表單
const submitDepartment = handleSubmit(async (values) => {
  tableLoading.value = true
  try {
    if (dialog.value.id) {
      await apiAuth.patch(`/department/${dialog.value.id}`, values)
    } else {
      await apiAuth.post('/department', values)
    }
    await loadDepartments()
    closeDialog()
    createSnackbar({
      text: `部門${dialog.value.id ? '修改' : '新增'}成功`,
      snackbarProps: { color: 'teal-darken-1' }
    })
  } catch (error) {
    const errorMessage = error?.response?.data?.message || '操作失敗'
    createSnackbar({
      text: errorMessage.includes('相同名稱') ? errorMessage : '操作失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
  tableLoading.value = false
})

// 刪除部門
const deleteDepartment = async () => {
  tableLoading.value = true
  try {
    await apiAuth.delete(`/department/${selectedDepartment.value._id}`)
    await loadDepartments()
    createSnackbar({
      text: '部門刪除成功',
      snackbarProps: { color: 'teal-darken-1' }
    })
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
  deleteDialog.value = false
  selectedDepartment.value = null
  tableLoading.value = false
}

// 搜尋防抖
const debouncedSearch = debounce(() => {
  loadDepartments(true)
}, 300)

watch(tableSearch, () => {
  debouncedSearch()
})

onMounted(() => {
  loadDepartments()
})

onUnmounted(() => {
  debouncedSearch.cancel()
})
</script>

<style lang="scss" scoped>
@import '/src/styles/settings.scss';

:deep(.header-bg)  {
  background-color: #455A64;
  color: white;
}

.odd-row {
  background-color: #f5f5f5;
}

.even-row {
  background-color: rgb(252, 255, 247);
}
</style>
