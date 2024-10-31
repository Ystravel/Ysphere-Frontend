<template>
  <v-container max-width="1400">
    <h2 class="my-6">
      使用者管理
    </h2>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <v-btn
              prepend-icon="mdi-account-plus"
              variant="outlined"
              color="orange-darken-2"
              @click="openDialog(null)"
            >
              新增使用者
            </v-btn>
            <v-btn
              prepend-icon="mdi-account-multiple-outline"
              class="ms-4"
              variant="outlined"
              color="blue-grey-darken-1"
              @click="openDepartmentDialog"
            >
              部門管理
            </v-btn>
          </v-col>
          <v-col
            cols="3"
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
              max-width="240"
              @keydown.enter="tableLoadItems(true)"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-data-table-server
          v-model:items-per-page="tableItemsPerPage"
          v-model:sort-by="tableSortBy"
          v-model:page="tablePage"
          color="red"
          density="compact"
          :items-per-page-options="[10, 20 ,50]"
          :items="tableItems"
          :headers="tableHeaders"
          :loading="tableLoading"
          :items-length="tableItemsLength"
          :search="tableSearch"
          hover
          @update:items-per-page="tableLoadItems(false)"
          @update:sort-by="tableLoadItems(false)"
          @update:page="tableLoadItems(false)"
        >
          <!-- Email -->
          <template #[`item.email`]="{ item }">
            {{ item.email }}
          </template>

          <!-- 姓名 -->
          <template #[`item.name`]="{ item }">
            {{ item.name }}
          </template>

          <!-- 部門 -->
          <!-- <template #[`item.department.name`]="{ item }">
            {{ item.department.name }}
          </template> -->
          <!-- 身分組 -->
          <template #[`item.role`]="{ item }">
            {{ getRoleTitle(item.role) }}
          </template>

          <!-- 操作按鈕 -->
          <template #[`item.action`]="{ item }">
            <v-btn
              class="edit-btn"
              icon="mdi-pencil"
              variant="plain"
              @click="openDialog(item)"
            />
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-container>

  <!-- 新增或編輯dialog -->
  <v-dialog
    v-model="dialog.open"
    persistent
    width="800"
  >
    <v-form
      :disabled="isSubmitting"
      @submit.prevent="submit"
    >
      <v-card class="rounded-lg pa-4 pt-6">
        <v-card-title style="font-size: 18px;">
          {{ dialog.id ? '使用者資料編輯' : '新增使用者' }}
        </v-card-title>
        <v-card-text class="mt-3 pa-3">
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                class="mt-2"
                label="Email"
                type="email"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="name.value.value"
                :error-messages="name.errorMessage.value"
                class="mt-2"
                label="姓名"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="englishName.value.value"
                :error-messages="englishName.errorMessage.value"
                class="mt-2"
                label="英文名"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="IDNumber.value.value"
                :error-messages="IDNumber.errorMessage.value"
                class="mt-2"
                label="身分證號碼"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="gender.value.value"
                :items="genderOptions"
                :error-messages="gender.errorMessage.value"
                :item-title="genderOptions.title"
                :item-value="genderOptions.value"
                label="性別"
                variant="outlined"
                density="compact"
                class="mt-2"
              />
            </v-col>
            <v-col cols="4">
              <v-date-input
                v-model="birthDate.value.value"
                :error-messages="birthDate.errorMessage.value"
                label="生日"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="address.value.value"
                :error-messages="address.errorMessage.value"
                class="mt-2"
                label="地址"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="6">
              <!-- <v-select
                v-model="company.value.value"
                :error-messages="company.errorMessage.value"
                :items="companies"
                item-title="name"
                item-value="_id"
                label="所屬公司"
                variant="outlined"
                density="compact"
                clearable
              /> -->
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="cellphone.value.value"
                :error-messages="cellphone.errorMessage.value"
                class="mt-2"
                label="手機號碼"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="extension.value.value"
                :error-messages="extension.errorMessage.value"
                class="mt-2"
                label="分機號碼"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="printNumber.value.value"
                :error-messages="printNumber.errorMessage.value"
                class="mt-2"
                label="列印編號"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <!-- <v-select
                v-model="department.value.value"
                :error-messages="department.errorMessage.value"
                :items="departments"
                item-title="name"
                item-value="_id"
                label="選擇部門"
                variant="outlined"
                density="compact"
                clearable
              /> -->
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="role.value.value"
                :error-messages="role.errorMessage.value"
                :items="roles"
                item-title="title"
                item-value="value"
                label="權限"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-select
                v-model="employmentStatus.value.value"
                :error-messages="employmentStatus.errorMessage.value"
                :items="employmentStatuses"
                item-title="title"
                item-value="value"
                label="任職狀態"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="hireDate.value.value"
                :error-messages="hireDate.errorMessage.value"
                class="mt-2"
                label="入職日期"
                type="date"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="resignationDate.value.value"
                :error-messages="resignationDate.errorMessage.value"
                class="mt-2"
                label="離職日期"
                type="date"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="note.value.value"
                :error-messages="note.errorMessage.value"
                class="mt-2"
                label="備註"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="emergencyName.value.value"
                :error-messages="emergencyName.errorMessage.value"
                class="mt-2"
                label="緊急聯絡人姓名"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="emergencyCellphone.value.value"
                :error-messages="emergencyCellphone.errorMessage.value"
                class="mt-2"
                label="緊急聯絡人電話"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="emergencyRelationship.value.value"
                :error-messages="emergencyRelationship.errorMessage.value"
                class="mt-2"
                label="緊急聯絡人關係"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>

          <v-row v-if="!dialog.id">
            <v-col cols="6">
              <v-text-field
                v-model="password.value.value"
                :error-messages="password.errorMessage.value"
                class="mt-2"
                label="密碼"
                variant="outlined"
                density="compact"
                clearable
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="passwordConfirm.value.value"
                :error-messages="passwordConfirm.errorMessage.value"
                class="mt-2"
                label="確認密碼"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :append-inner-icon="showPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                density="compact"
                clearable
                @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red-lighten-1"
            variant="outlined"
            size="small"
            :loading="isSubmitting"
            @click="closeDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="teal-darken-1"
            variant="outlined"
            size="small"
            type="submit"
            :loading="isSubmitting"
          >
            送出
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- 部門管理對話框 -->
  <v-dialog
    v-model="departmentDialog.open"
    persistent
    width="400"
  >
    <v-card class="rounded-lg">
      <v-card-title class="ms-2 mt-4">
        部門管理
      </v-card-title>

      <v-card-text>
        <v-list>
          <div>
            <v-chip
              v-for="(department, index) in departments"
              :key="index"
              class="mb-2 me-4"
              color="amber-darken-4"
              label
            >
              {{ department.name }}
              <v-btn
                icon
                size="18"
                elevation="2"
                class="ms-2"
                @click="openEditDialog(department)"
              >
                <v-icon
                  size="14"
                  color="blue-lighten-1"
                >
                  mdi-pen
                </v-icon>
              </v-btn>
              <v-btn
                icon
                size="18"
                elevation="2"
                class="ms-2"
                @click="confirmDelete(department)"
              >
                <v-icon
                  size="14"
                  color="red-lighten-1"
                >
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-chip>
          </div>
        </v-list>

        <v-text-field
          v-model="newDepartmentName"
          class="mt-4"
          label="新增部門名稱"
          variant="outlined"
          density="compact"
          clearable
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red-darken-1"
            variant="outlined"
            size="small"
            @click="closeDepartmentDialog"
          >
            關閉
          </v-btn>
          <v-btn
            color="teal-lighten-1"
            variant="outlined"
            size="small"
            @click="addDepartment"
          >
            新增
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="editDialog.open"
    persistent
    width="400"
  >
    <v-card class="rounded-lg">
      <v-card-title class="ms-2 mt-4">
        編輯部門
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="editDepartmentName"
          class="mt-4"
          label="部門名稱"
          variant="outlined"
          density="compact"
          clearable
          :error-messages="editDepartmentError"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red-darken-1"
            variant="outlined"
            size="small"
            @click="closeEditDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="teal-lighten-1"
            variant="outlined"
            size="small"
            @click="submitEditDepartment"
          >
            更新
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>

  <ConfirmDeleteDialog
    v-model="isDeleteDialogOpen"
    :message="`確定要刪除 ${selectedDepartment?.name} 嗎？`"
    @confirm="deleteDepartmentConfirmed"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as yup from 'yup'
import { definePage } from 'vue-router/auto'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
// import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'

definePage({
  meta: {
    title: '使用者 | ystravel',
    login: true,
    admin: true
  }
})

const { api, apiAuth } = useApi()
const createSnackbar = useSnackbar()

const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const isEditing = ref(false)

const roles = ref([
  { title: '一般員工', value: 0 },
  { title: '一般管理者', value: 1 },
  { title: '最高管理者', value: 2 },
  { title: '人資', value: 3 },
  { title: '經理', value: 4 },
  { title: '會計', value: 5 },
  { title: 'IT人員', value: 6 }
])

const getRoleTitle = (roleValue) => {
  const role = roles.value.find((r) => r.value === roleValue)
  return role ? role.title : '未知'
}

const employmentStatuses = ref([
  { title: '在職', value: '在職' },
  { title: '離職', value: '離職' },
  { title: '退休', value: '退休' },
  { title: '留職停薪', value: '留職停薪' }
])

const genderOptions = ref([
  { title: '男性', value: '男性' },
  { title: '女性', value: '女性' }
])
const dialog = ref({
  open: false,
  id: ''
})

const departmentDialog = ref({ open: false })
const departments = ref([])
const newDepartmentName = ref('')

// 確認刪除對話框的狀態
const isDeleteDialogOpen = ref(false)
const selectedDepartment = ref(null) // 被選中的部門

// 編輯對話框
const editDialog = ref({
  open: false,
  id: ''
})
const editDepartmentName = ref('')
const editDepartmentError = ref('')

const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatToDate = (dateString) => {
  return dateString ? new Date(dateString) : null
}

const openDialog = (item) => {
  if (item) {
    isEditing.value = true
    dialog.value.id = item._id
    email.value.value = item.email
    name.value.value = item.name
    englishName.value.value = item.englishName
    gender.value.value = item.gender
    IDNumber.value.value = item.IDNumber
    address.value.value = item.address
    birthDate.value.value = formatToDate(item.birthDate)
    // company.value.value = item.company._id
    // department.value.value = item.department._id
    cellphone.value.value = item.cellphone
    extension.value.value = item.extension
    printNumber.value.value = item.printNumber
    role.value.value = item.role
    employmentStatus.value.value = item.employmentStatus
    hireDate.value.value = formatDate(item.hireDate)
    resignationDate.value.value = formatDate(item.resignationDate)
    emergencyName.value.value = item.emergencyName
    emergencyCellphone.value.value = item.emergencyCellphone
    emergencyRelationship.value.value = item.emergencyRelationship
    note.value.value = item.note
  } else {
    isEditing.value = false
    dialog.value.id = ''
    resetForm()
  }
  dialog.value.open = true
}

const closeDialog = () => {
  dialog.value.open = false
  resetForm()
}

// 初始化時載入部門列表
onMounted(async () => {
  await loadDepartments()
})

// 加載部門列表的函數
const loadDepartments = async () => {
  try {
    const { data } = await apiAuth.get('/department/all')
    departments.value = data.result
  } catch (error) {
    console.error('加載部門失敗', error)
    createSnackbar({
      text: '加載部門失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 打開部門管理對話框
const openDepartmentDialog = () => {
  departmentDialog.value.open = true
}

// 關閉對話框
const closeDepartmentDialog = () => {
  departmentDialog.value.open = false
  newDepartmentName.value = ''
}

// 新增部門
const addDepartment = async () => {
  if (!newDepartmentName.value) return
  try {
    await apiAuth.post('/department', { name: newDepartmentName.value })
    createSnackbar({
      text: '部門新增成功',
      snackbarProps: { color: 'teal-darken-1' }
    })
    await loadDepartments() // 重新載入部門列表
    newDepartmentName.value = ''
  } catch (error) {
    console.error('新增部門失敗', error)
    createSnackbar({
      text: '新增部門失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 打開確認刪除對話框
const confirmDelete = (department) => {
  selectedDepartment.value = department
  isDeleteDialogOpen.value = true
}

// 確認刪除的回調
const deleteDepartmentConfirmed = async () => {
  if (selectedDepartment.value) {
    try {
      await apiAuth.delete(`/department/${selectedDepartment.value._id}`)
      createSnackbar({
        text: '部門刪除成功',
        snackbarProps: {
          color: 'teal-darken-1'
        }
      })
      await loadDepartments() // 刪除成功後重新加載部門列表
    } catch (error) {
      console.log(error)
      createSnackbar({
        text: error?.response?.data?.message || '刪除失敗',
        snackbarProps: {
          color: 'red-lighten-1'
        }
      })
    }
  }
}

// 打開編輯對話框
const openEditDialog = (department) => {
  editDepartmentName.value = department.name
  editDialog.value.id = department._id
  editDialog.value.open = true
}

// 關閉編輯對話框
const closeEditDialog = () => {
  editDialog.value.open = false
  editDepartmentName.value = ''
  editDepartmentError.value = ''
}

// 提交編輯部門
const submitEditDepartment = async () => {
  if (!editDepartmentName.value) {
    editDepartmentError.value = '部門名稱不能為空'
    return
  }

  try {
    await apiAuth.patch(`/department/${editDialog.value.id}`, {
      name: editDepartmentName.value
    })
    createSnackbar({
      text: '部門更新成功',
      snackbarProps: {
        color: 'teal-darken-1'
      }
    })

    // 更新成功後重新加載部門列表
    await loadDepartments()
    tableLoadItems()
    closeEditDialog()
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '更新失敗',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
  }
}

const userSchema = yup.object({
  email: yup
    .string()
    .required('請輸入email')
    .email('請輸入正確的 email 格式'),
  name: yup
    .string()
    .required('請輸入姓名'),
  englishName: yup
    .string()
    .required('請輸入英文名'),
  gender: yup
    .string()
    .required('請選擇姓別'),
  IDNumber: yup
    .string()
    .required('請輸入身分證號碼'),
  address: yup
    .string(),
  birthDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
    // originalValue 是從表單獲取的值，當 originalValue 為空字串""時，轉換為 null，若不是空字串則保持為原本的 value。
    .required('請選擇生日'),
  // company: yup
  // .string(),
  // .required('請選擇所屬公司'),
  // department: yup
  // .string(),
  // .required('請選擇部門'),
  cellphone: yup
    .string()
    .required('請輸入手機號碼'),
  extension: yup
    .string()
    .required('請輸入分機號碼'),
  printNumber: yup
    .string()
    .required('請輸入列印編號'),
  role: yup
    .number()
    .required('請選擇使用者身分別'),
  employmentStatus: yup
    .string()
    .required('請選擇任職狀態'),
  hireDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .required('請選擇入職日期'),
  resignationDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value),
  emergencyName: yup
    .string()
    .required('請輸入緊急聯絡人姓名'),
  emergencyCellphone: yup
    .string()
    .required('請輸入緊急聯絡人連絡電話'),
  emergencyRelationship: yup
    .string(),
  note: yup
    .string(),
  password: yup
    .string()
    .when('$isEditing', {
      is: false,
      then: () => yup.string().required('請輸入密碼').min(8, '密碼至少需輸入8個字'),
      otherwise: () => yup.string().notRequired()
    }),
  passwordConfirm: yup
    .string()
    .when('password', {
      is: (password) => password && password.length > 0, // 當密碼有輸入時才要求確認密碼
      then: () => yup.string().required('請再次輸入密碼').oneOf([yup.ref('password')], '密碼不一致'),
      otherwise: () => yup.string().notRequired() // 如果沒有輸入密碼，允許不輸入確認密碼
    })
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: userSchema,
  initialValues: {
    email: '',
    name: '',
    englishName: '',
    gender: '',
    IDNumber: '',
    address: '',
    birthDate: null,
    company: '',
    department: '',
    cellphone: '',
    extension: '',
    printNumber: '',
    role: 0,
    employmentStatus: '',
    hireDate: '',
    resignationDate: '',
    emergencyName: '',
    emergencyCellphone: '',
    emergencyRelationship: '',
    note: '',
    password: '',
    passwordConfirm: ''
  }
})

const email = useField('email')
const name = useField('name')
const englishName = useField('englishName')
const gender = useField('gender')
const IDNumber = useField('IDNumber')
const address = useField('address')
const birthDate = useField('birthDate')
const company = useField('company')
const department = useField('department')
const cellphone = useField('cellphone')
const extension = useField('extension')
const printNumber = useField('printNumber')
const role = useField('role')
const employmentStatus = useField('employmentStatus')
const hireDate = useField('hireDate')
const resignationDate = useField('resignationDate')
const emergencyName = useField('emergencyName')
const emergencyCellphone = useField('emergencyCellphone')
const emergencyRelationship = useField('emergencyRelationship')
const note = useField('note')
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')

const submit = handleSubmit(async (values) => {
  try {
    if (isEditing.value) {
      await apiAuth.patch(`/user/${dialog.value.id}`, {
        email: values.email,
        name: values.name,
        englishName: values.englishName,
        gender: values.gender,
        IDNumber: values.IDNumber,
        address: values.address,
        birthDate: values.birthDate,
        company: values.company,
        department: values.department, // 發送部門ID
        cellphone: values.cellphone,
        extension: values.extension,
        printNumber: values.printNumber,
        role: values.role,
        employmentStatus: values.employmentStatus,
        hireDate: values.hireDate,
        resignationDate: values.resignationDate,
        emergencyName: values.emergencyName,
        emergencyCellphone: values.emergencyCellphone,
        emergencyRelationship: values.emergencyRelationship,
        note: values.note
      })
      createSnackbar({
        text: '使用者更新成功',
        snackbarProps: {
          color: 'teal-darken-1'
        }
      })
    } else {
      // 新增模式，發送 POST 請求
      await apiAuth.post('/user', {
        email: values.email,
        name: values.name,
        englishName: values.englishName,
        gender: values.gender,
        IDNumber: values.IDNumber,
        address: values.address,
        birthDate: values.birthDate,
        company: values.company,
        department: values.department, // 發送部門ID
        cellphone: values.cellphone,
        extension: values.extension,
        printNumber: values.printNumber,
        role: values.role,
        employmentStatus: values.employmentStatus,
        hireDate: values.hireDate,
        resignationDate: values.resignationDate,
        emergencyName: values.emergencyName,
        emergencyCellphone: values.emergencyCellphone,
        emergencyRelationship: values.emergencyRelationship,
        note: values.note,
        password: values.password
      })

      createSnackbar({
        text: '使用者新增成功',
        snackbarProps: {
          color: 'teal-darken-1'
        }
      })
    }
    closeDialog() // 關閉 dialog
    tableLoadItems(true)
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
  }
})

// 數據表格相關變量
const tableItemsPerPage = ref(10)
const tableSortBy = ref([
  { key: 'userId', order: 'asc' }
])
const tablePage = ref(1)
const tableItems = ref([])
const tableHeaders = [
  { title: '電子郵件', align: 'left', sortable: true, key: 'email' },
  { title: '姓名', align: 'left', sortable: true, key: 'name' },
  { title: '部門', align: 'left', sortable: true, key: 'department.name' },
  { title: '手機號碼', align: 'left', sortable: true, key: 'cellphone' },
  { title: '身分組', align: 'left', sortable: true, key: 'role' },
  { title: '操作', align: 'center', sortable: false, key: 'action' }
]
const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableSearch = ref('')

// 加載表格數據
const tableLoadItems = async (reset) => {
  if (reset) tablePage.value = 1
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/user/all', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'userId',
        sortOrder: tableSortBy.value[0]?.order || 'asc',
        search: tableSearch.value
      }
    })
    tableItems.value.splice(0, tableItems.value.length, ...data.result.data)
    tableItemsLength.value = data.result.totalItems // 使用 totalItems 作為總數
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
  }
  tableLoading.value = false
}

// 初始加載表格數據
tableLoadItems()
</script>

<style lang="scss" scoped>
</style>
