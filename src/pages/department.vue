<template>
  <v-container max-width="1400">
    <v-row
      class="elevation-4 rounded-xl py-8 px-1 px-sm-10 mt-2 mt-sm-10 mx-0 mx-sm-4 mx-md-10 mb-4 bg-white"
    >
      <v-col
        cols="12"
        class="ps-3 pb-6 d-flex align-center"
      >
        <h3 class="d-inline">
          公司部門管理
        </h3> <v-icon
          v-if="smAndUp"
          v-tooltip="'人數為「在職」人數'"
          icon="mdi-information"
          size="small"
          color="grey-darken-2"
          class="ms-4"
        />
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
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
                v-if="!smAndUp"
                cols="6"
              />
              <v-col
                cols="6"
                sm="3"
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
                cols="6"
                sm="3"
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
              :page="tablePage"
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
              @update:options="handleTableUpdate"
            >
              <template #item="{ item, index }">
                <tr :class="{ 'odd-row': index % 2 === 0, 'even-row': index % 2 !== 0 }">
                  <td>{{ item.departmentId || '尚未設定' }}</td>
                  <td>{{ companyNames[item.companyId] || '未知公司' }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.memberCount || 0 }} 人</td>
                  <td class="text-center">
                    <v-row class="d-flex justify-center my-1">
                      <v-col
                        cols="6"
                        sm="4"
                        md="3"
                        lg="2"
                        class="pa-0 mx-1"
                      >
                        <v-btn
                          icon
                          color="light-blue-darken-4"
                          variant="plain"
                          width="28"
                          height="32"
                          :size="buttonSize"
                          :ripple="false"
                          @click="openEditDepartment(item)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col
                        cols="6"
                        sm="4"
                        md="3"
                        lg="2"
                        class="pa-0 mx-1"
                      >
                        <v-btn
                          icon
                          color="red-lighten-1"
                          variant="plain"
                          width="28"
                          height="32"
                          :size="buttonSize"
                          :ripple="false"
                          @click="confirmDeleteDepartment(item)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
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
            <template v-if="dialog.id">
              <v-text-field
                v-model="departmentId.value.value"
                :error-messages="departmentId.errorMessage.value"
                label="部門編號"
                variant="outlined"
                density="compact"
                class="mb-4"
              />
            </template>
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
              :disabled="dialog.id && !hasChanges"
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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { debounce } from 'lodash'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { definePage } from 'vue-router/auto'
import UserRole from '../enums/UserRole'
import { useDisplay } from 'vuetify'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'

definePage({
  meta: {
    title: '員工管理 | ystravel',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  }
})
const { smAndUp } = useDisplay()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})

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
const originalData = ref(null)

// 表格樣式設定
const headerProps = {
  class: 'header-bg'
}

// 表格相關
const tableLoading = ref(false)
const tableItemsPerPage = ref(10)
const tableSortBy = ref([{ key: 'departmentId', order: 'asc' }])
const tablePage = ref(1)
const tableItemsLength = ref(0)
const tableSearch = ref('')
const tableHeaders = [
  { title: '編號', key: 'departmentId', align: 'start', width: '15%', sortable: true },
  { title: '公司', key: 'companyId', align: 'start', width: '25%', sortable: true },
  { title: '部門', key: 'name', align: 'start', width: '30%', sortable: true },
  { title: '人數', key: 'memberCount', align: 'start', sortable: true },
  { title: '操作', key: 'actions', align: 'center', sortable: false }
]

const handleTableUpdate = (options) => {
  console.log('表格更新選項:', options)

  const needsUpdate =
    options.page !== tablePage.value ||
    options.itemsPerPage !== tableItemsPerPage.value ||
    JSON.stringify(options.sortBy) !== JSON.stringify(tableSortBy.value)

  if (needsUpdate) {
    tablePage.value = options.page
    tableItemsPerPage.value = options.itemsPerPage
    tableSortBy.value = options.sortBy
    loadDepartments(false)
  }
}

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
    .required('請選擇所屬公司'),
  departmentId: yup
    .string()
    .nullable()
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema
})

const departmentName = useField('name')
const departmentCompanyId = useField('companyId')
const departmentId = useField('departmentId', undefined, {
  validateOnValueUpdate: false
})
const companyNames = Object.fromEntries(companyOptions.map(company => [company.id, company.name]))

// 載入部門列表
const loadDepartments = async (reset = false) => {
  if (reset) {
    tablePage.value = 1
  }

  tableLoading.value = true
  try {
    console.log('載入部門列表，參數:', {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'companyId',
      sortOrder: tableSortBy.value[0]?.order || 'asc',
      search: tableSearch.value,
      companyId: companyFilter.value
    })

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

    if (data.success && data.result) {
      departments.value = data.result.data
      tableItemsLength.value = data.result.totalItems

      // 檢查頁碼是否超出範圍
      const maxPage = Math.ceil(data.result.totalItems / tableItemsPerPage.value)
      if (tablePage.value > maxPage && maxPage > 0) {
        tablePage.value = maxPage
        if (!reset) {
          await loadDepartments(false)
        }
      }
    } else {
      throw new Error(data.message || '載入失敗')
    }
  } catch (error) {
    console.error('載入部門列表錯誤:', error)
    createSnackbar({
      text: error?.response?.data?.message || '載入部門列表失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
    departments.value = []
    tableItemsLength.value = 0
  } finally {
    tableLoading.value = false
  }
}

// 開啟新增部門對話框
const openDepartmentDialog = () => {
  dialog.value = { open: true, id: null }
  resetForm()
}

// 開啟編輯部門對話框
const openEditDepartment = (department) => {
  dialog.value = { open: true, id: department._id }

  // 保存原始數據
  originalData.value = {
    name: department.name,
    companyId: department.companyId,
    departmentId: department.departmentId
  }

  departmentName.value.value = department.name
  departmentCompanyId.value.value = department.companyId
  departmentId.value.value = department.departmentId
  selectedDepartment.value = department
}

// 關閉對話框
const closeDialog = () => {
  dialog.value.open = false
  resetForm()
  selectedDepartment.value = null
  originalData.value = null
}

// 確認刪除部門
const confirmDeleteDepartment = (department) => {
  selectedDepartment.value = department
  deleteDialog.value = true
}

const hasChanges = computed(() => {
  // 如果是新增模式，直接返回 true (允許提交)
  if (!dialog.value.id) return true

  // 如果沒有原始數據，返回 false
  if (!originalData.value) return false

  // 取得當前值
  const currentValues = {
    name: departmentName.value.value,
    companyId: departmentCompanyId.value.value,
    departmentId: departmentId.value.value || ''
  }

  // 比較每個欄位
  return Object.keys(originalData.value).some(key => {
    const originalValue = originalData.value[key] ?? ''
    const currentValue = currentValues[key] ?? ''
    return originalValue !== currentValue
  })
})

// 提交部門表單
const submitDepartment = handleSubmit(async (values) => {
  tableLoading.value = true
  try {
    if (dialog.value.id) {
      await apiAuth.patch(`/department/${dialog.value.id}`, {
        name: values.name,
        companyId: values.companyId,
        departmentId: values.departmentId
      })
    } else {
      await apiAuth.post('/department', {
        name: values.name,
        companyId: values.companyId
      })
    }
    await loadDepartments()
    closeDialog()
    createSnackbar({
      text: `部門${dialog.value.id ? '修改' : '新增'}成功`,
      snackbarProps: { color: 'teal-lighten-1' }
    })
  } catch (error) {
    const errorMessage = error?.response?.data?.message || '操作失敗'
    createSnackbar({
      text: errorMessage,
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
      snackbarProps: { color: 'teal-lighten-1' }
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

// 確保監聽搜尋變化時重設頁碼
watch(tableSearch, () => {
  tablePage.value = 1 // 重設頁碼
  debouncedSearch()
})

// 4. 添加额外的监听器
watch([tableItemsPerPage, tableSortBy], () => {
  loadDepartments(true)
})

// 5. 确保搜索和筛选时重置页码
watch([tableSearch, companyFilter], () => {
  tablePage.value = 1
  loadDepartments(true)
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
  background-color: #fffffd;
}

.even-row {
  background-color: rgb(247, 253, 255);
}
</style>
