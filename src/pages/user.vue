<template>
  <v-container
    max-width="2500"
  >
    <v-row
      class="elevation-4 rounded-xl py-8 px-1 px-sm-10 mt-2 mt-sm-10 mx-0 mx-sm-4 mx-md-10"
    >
      <v-col
        cols="12"
        class="ps-3 pb-6"
      >
        <h3>
          員工管理
        </h3>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn
                  prepend-icon="mdi-account-plus"
                  variant="outlined"
                  color="teal-darken-2"
                  @click="openDialog(null)"
                >
                  新增使用者
                </v-btn>
              </v-col>
              <v-col
                v-if="mdAndUp"
                cols="3"
                lg="2"
              >
                <v-select
                  v-model="roleFilter"
                  :items="[{ title: '全部', value: '' }, ...roles]"
                  label="身份別"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="tableLoadItems(true)"
                />
              </v-col>
              <v-col
                v-if="mdAndUp"
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
          <v-col
            v-if="!mdAndUp"
            cols="12"
          >
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="roleFilter"
                  :items="[{ title: '全部', value: '' }, ...roles]"
                  label="身份別"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="tableLoadItems(true)"
                />
              </v-col>
              <v-col
                cols="6"
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
              :key="tableKey"
              v-model:items-per-page="tableItemsPerPage"
              v-model:sort-by="tableSortBy"
              :page="tablePage"
              density="compact"
              class="rounded-ts-lg rounded-te-lg py-3"
              :items-per-page-options="[10, 20 ,50]"
              :items="tableItems"
              :headers="filteredHeaders"
              :header-props="headerProps"
              :loading="tableLoading"
              :items-length="tableItemsLength"
              :search="tableSearch"
              hover
              @update:items-per-page="tableLoadItems(false)"
              @update:sort-by="tableLoadItems(false)"
              @update:page="onUpdatePage"
            >
              <template #item="{ item, index }">
                <tr :class="{ 'odd-row': index % 2 === 0, 'even-row': index % 2 !== 0 }">
                  <td>{{ item.userId }}</td>
                  <td v-if="lgAndUp">
                    {{ item.email }}
                  </td>
                  <td>{{ item.name }}</td>
                  <td v-if="mdAndUp">
                    {{ getCompanyName(item.department.companyId) }}
                  </td>
                  <td v-if="mdAndUp">
                    {{ item.department.name }}
                  </td>
                  <td v-if="lgAndUp">
                    {{ item.cellphone }}
                  </td>
                  <td v-if="smAndUp">
                    {{ getRoleTitle(item.role) }}
                  </td>
                  <td v-if="smAndUp">
                    {{ item.employmentStatus }}
                  </td>
                  <td>
                    <v-btn
                      icon
                      color="light-blue-darken-4"
                      variant="plain"
                      width="28"
                      height="40"
                      :ripple="false"
                      @click="openDialog(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
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
          {{ dialog.id ? '員工資料編輯' : '新增員工' }}
        </v-card-title>
        <v-card-text class="mt-3 pa-3">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                class="mt-2"
                label="*Email"
                type="email"
                variant="outlined"
                density="compact"
                clearable
                autocomplete="username"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="IDNumber.value.value"
                :error-messages="IDNumber.errorMessage.value"
                class="mt-2"
                label="*身分證號碼"
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
                v-model="name.value.value"
                :error-messages="name.errorMessage.value"
                class="mt-2"
                label="*姓名"
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
                label="*英文名"
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
                label="*性別"
                variant="outlined"
                density="compact"
                class="mt-2"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
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
            <v-col cols="4">
              <v-text-field
                v-model="jobTitle.value.value"
                :error-messages="jobTitle.errorMessage.value"
                class="mt-2"
                label="*職稱"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-date-input
                v-model="birthDate.value.value"
                :error-messages="birthDate.errorMessage.value"
                label="*生日"
                prepend-icon
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-date-input
                v-model="hireDate.value.value"
                :error-messages="hireDate.errorMessage.value"
                label="*入職日期"
                prepend-icon
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-date-input
                v-model="resignationDate.value.value"
                label="離職日期"
                prepend-icon
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="cellphone.value.value"
                :error-messages="cellphone.errorMessage.value"
                class="mt-2"
                label="*手機號碼"
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
                label="*分機號碼"
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
                label="*列印編號"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-select
                v-model="selectedCompany"
                :error-messages="company.errorMessage.value"
                :items="companyList"
                label="*所屬公司"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="compact"
                clearable
              >
                />
              </v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="department.value.value"
                :items="filteredDepartments"
                :error-messages="department.errorMessage.value"
                item-title="name"
                item-value="_id"
                label="*選擇部門"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="role.value.value"
                :error-messages="role.errorMessage.value"
                :items="roles"
                item-title="title"
                item-value="value"
                label="*權限"
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
                label="*任職狀態"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="6"
              class="pt-1"
            >
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
                label="*緊急聯絡人姓名"
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
                label="*緊急聯絡人電話"
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
                label="*密碼"
                variant="outlined"
                density="compact"
                clearable
                autocomplete="new-password"
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
                label="*確認密碼"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :append-inner-icon="showPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                density="compact"
                clearable
                autocomplete="new-password"
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
            :disabled="isEditing && !hasChanges"
          >
            送出
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import debounce from 'lodash/debounce'
import * as yup from 'yup'
import { definePage } from 'vue-router/auto'
import { useForm, useField } from 'vee-validate'
import { useDisplay } from 'vuetify'
import { companyNames } from '@/enums/Company'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
// import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'

definePage({
  meta: {
    title: '員工管理 | ystravel',
    login: true,
    admin: true
  }
})

// sm 600px, md 960px, lg 1280px
const { smAndUp, mdAndUp, lgAndUp, name: currentBreakpoint } = useDisplay()

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const isEditing = ref(false)
const roleFilter = ref('')
const originalData = ref(null)
const currentPage = ref(1)
const headerProps = {
  class: 'header-bg' // 設置自定義的 CSS 類名
}

// 公司的選項列表
const companyList = Object.entries(companyNames).map(([id, name]) => ({
  id: Number(id),
  name
}))

// 用於存儲所選公司和篩選後的部門列表
const selectedCompany = ref(1)
const filteredDepartments = ref([])

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

const departments = ref([])

const getCompanyName = (companyId) => {
  return companyNames[companyId] || '未知公司' // 若找不到則顯示"未知公司"
}

// 載入選定公司下的部門
const fetchDepartments = async () => {
  if (!selectedCompany.value) {
    filteredDepartments.value = []
    return
  }

  try {
    const response = await apiAuth.get('/department/all', {
      params: { companyId: selectedCompany.value }
    })

    // 檢查後端返回的數據並加載部門列表
    if (response.data && response.data.result && response.data.result.data) {
      filteredDepartments.value = response.data.result.data.filter(
        dept => dept.companyId === selectedCompany.value
      )
    } else {
      console.warn('No departments found for selected company.')
      filteredDepartments.value = []
    }
  } catch (error) {
    console.error('部門加載失敗:', error)
    filteredDepartments.value = []
  }
}

const formatToDate = (dateString) => {
  return dateString ? new Date(dateString) : null
}

const openDialog = (item) => {
  currentPage.value = tablePage.value
  if (item) {
    isEditing.value = true
    dialog.value.id = item._id
    // 保存當前頁碼到 localStorage
    localStorage.setItem('userTablePage', tablePage.value.toString())
    // 儲存原始數據，對可選欄位使用空字串
    originalData.value = {
      email: item.email,
      name: item.name,
      englishName: item.englishName,
      gender: item.gender,
      IDNumber: item.IDNumber,
      address: item.address ?? '', // 使用空值合併運算符
      birthDate: formatToDate(item.birthDate),
      company: item.department?.companyId || 1,
      department: item.department?._id,
      cellphone: item.cellphone,
      extension: item.extension,
      printNumber: item.printNumber,
      jobTitle: item.jobTitle,
      role: item.role,
      employmentStatus: item.employmentStatus,
      hireDate: formatToDate(item.hireDate),
      resignationDate: formatToDate(item.resignationDate),
      emergencyName: item.emergencyName,
      emergencyCellphone: item.emergencyCellphone,
      emergencyRelationship: item.emergencyRelationship ?? '', // 使用空值合併運算符
      note: item.note ?? '' // 使用空值合併運算符
    }

    // 設置表單值
    email.value.value = item.email
    name.value.value = item.name
    englishName.value.value = item.englishName
    gender.value.value = item.gender
    IDNumber.value.value = item.IDNumber
    address.value.value = item.address ?? ''
    birthDate.value.value = formatToDate(item.birthDate)
    hireDate.value.value = formatToDate(item.hireDate)
    resignationDate.value.value = formatToDate(item.resignationDate)
    selectedCompany.value = item.department?.companyId || 1
    fetchDepartments().then(() => {
      department.value.value = item.department?._id
    })
    cellphone.value.value = item.cellphone
    extension.value.value = item.extension
    printNumber.value.value = item.printNumber
    jobTitle.value.value = item.jobTitle
    role.value.value = item.role
    employmentStatus.value.value = item.employmentStatus
    emergencyName.value.value = item.emergencyName
    emergencyCellphone.value.value = item.emergencyCellphone
    emergencyRelationship.value.value = item.emergencyRelationship ?? ''
    note.value.value = item.note ?? ''
  } else {
    isEditing.value = false
    dialog.value.id = ''
    originalData.value = null
    selectedCompany.value = 1
    fetchDepartments()
    resetForm()
    hireDate.value.value = new Date()
  }
  dialog.value.open = true
}

// 添加一個計算屬性來判斷是否有更改
const hasChanges = computed(() => {
  if (!isEditing.value) return true // 新增模式永遠可以提交
  if (!originalData.value) return false

  // 取得當前表單值，對可選欄位使用空字串
  const currentValues = {
    email: email.value.value,
    name: name.value.value,
    englishName: englishName.value.value,
    gender: gender.value.value,
    IDNumber: IDNumber.value.value,
    address: address.value.value ?? '', // 使用空值合併運算符
    birthDate: birthDate.value.value,
    company: selectedCompany.value,
    department: department.value.value,
    cellphone: cellphone.value.value,
    extension: extension.value.value,
    printNumber: printNumber.value.value,
    jobTitle: jobTitle.value.value,
    role: role.value.value,
    employmentStatus: employmentStatus.value.value,
    hireDate: hireDate.value.value,
    resignationDate: resignationDate.value.value,
    emergencyName: emergencyName.value.value,
    emergencyCellphone: emergencyCellphone.value.value,
    emergencyRelationship: emergencyRelationship.value.value ?? '', // 使用空值合併運算符
    note: note.value.value ?? '' // 使用空值合併運算符
  }

  // 比較每個欄位
  return Object.keys(originalData.value).some(key => {
    // 對於可選欄位，將 null 或 undefined 轉換為空字串
    if (['address', 'note', 'emergencyRelationship'].includes(key)) {
      const originalValue = originalData.value[key] ?? ''
      const currentValue = currentValues[key] ?? ''
      return originalValue !== currentValue
    }

    // 對於日期類型的比較
    if (key === 'birthDate' || key === 'hireDate' || key === 'resignationDate') {
      const originalDate = originalData.value[key] ? new Date(originalData.value[key]).toISOString() : null
      const currentDate = currentValues[key] ? new Date(currentValues[key]).toISOString() : null
      return originalDate !== currentDate
    }

    // 其他必填欄位的比較
    return originalData.value[key] !== currentValues[key]
  })
})

// 在關閉對話框時清除原始數據
const closeDialog = () => {
  dialog.value.open = false
  selectedCompany.value = null
  filteredDepartments.value = []
  originalData.value = null
  resetForm()
}

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
    // originalValue 是從表單獲取的值，當 originalValue 為空字串""時，轉換為 null，若不是空字串則保持為原本的 value。
    .required('請選擇生日'),
  company: yup
    .number()
    .nullable()
    .required('請選擇公司'),
  department: yup
    .string()
    .required('請選擇部門'),
  cellphone: yup
    .string()
    .min(10, '手機號碼需為10位數字')
    .max(10, '手機號碼勿超過10位數字')
    .required('請輸入手機號碼'),
  extension: yup
    .string()
    .required('請輸入分機號碼'),
  printNumber: yup
    .string()
    .required('請輸入列印編號'),
  jobTitle: yup
    .string()
    .required('請輸入職稱'),
  role: yup
    .number()
    .required('請選擇使用者身分別'),
  employmentStatus: yup
    .string()
    .required('請選擇任職狀態'),
  hireDate: yup
    .date()
    .nullable()
    .required('請選擇入職日期'),
  resignationDate: yup
    .date()
    .nullable(),
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
    .test('password', '請輸入密碼', function (value) {
      // 只在新增模式時驗證
      if (!isEditing.value) {
        return !!value
      }
      return true
    })
    .test('password-length', '密碼至少需輸入8個字', function (value) {
      // 只在新增模式時驗證
      if (!isEditing.value && value) {
        return value.length >= 8
      }
      return true
    }),
  passwordConfirm: yup
    .string()
    .test('passwordConfirm', '請再次輸入密碼', function (value) {
      // 只在新增模式時驗證
      if (!isEditing.value) {
        return !!value
      }
      return true
    })
    .test('passwords-match', '密碼不一致', function (value) {
      // 只在新增模式時驗證
      if (!isEditing.value) {
        return value === this.parent.password
      }
      return true
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
    company: 1,
    department: '',
    cellphone: '',
    extension: '',
    printNumber: '',
    jobTitle: '',
    role: 0,
    employmentStatus: '在職',
    hireDate: new Date(),
    resignationDate: null,
    emergencyName: '',
    emergencyCellphone: '',
    emergencyRelationship: '',
    note: '',
    password: '',
    passwordConfirm: ''
  },
  // 加入這個設定
  validateOnMount: false,
  validateOnChange: true, // 添加這行
  validateOnBlur: true, // 添加這行
  validateOnInput: false,
  context: computed(() => ({
    isEditing: isEditing.value
  }))
})

const email = useField('email')
const name = useField('name')
const englishName = useField('englishName')
const gender = useField('gender')
const IDNumber = useField('IDNumber')
const address = useField('address', undefined, {
  validateOnValueUpdate: false,
  transform: (value) => value ?? '' // 將 null 或 undefined 轉換為空字串
})
const birthDate = useField('birthDate')
const company = useField('company')
// 修改 department 欄位的 useField 設置
const department = useField('department', undefined, {
  validateOnValueUpdate: false // 添加這個選項，只在提交時驗證
})
const cellphone = useField('cellphone')
const extension = useField('extension')
const printNumber = useField('printNumber')
const jobTitle = useField('jobTitle')
const role = useField('role')
const employmentStatus = useField('employmentStatus')
const hireDate = useField('hireDate')
const resignationDate = useField('resignationDate')
const emergencyName = useField('emergencyName')
const emergencyCellphone = useField('emergencyCellphone')

const emergencyRelationship = useField('emergencyRelationship', undefined, {
  validateOnValueUpdate: false,
  transform: (value) => value ?? ''
})
const note = useField('note', undefined, {
  validateOnValueUpdate: false,
  transform: (value) => value ?? ''
})
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')

const submit = handleSubmit(async (values) => {
  try {
    if (isEditing.value) {
      // 保存當前頁碼
      const currentPageNumber = tablePage.value

      // 更新用戶數據
      const { data: updateResponse } = await apiAuth.patch(`/user/${dialog.value.id}`, {
        email: values.email,
        name: values.name,
        englishName: values.englishName,
        gender: values.gender,
        IDNumber: values.IDNumber,
        address: values.address,
        birthDate: values.birthDate,
        company: values.company,
        department: values.department,
        cellphone: values.cellphone,
        extension: values.extension,
        printNumber: values.printNumber,
        jobTitle: values.jobTitle,
        role: values.role,
        employmentStatus: values.employmentStatus,
        hireDate: values.hireDate,
        resignationDate: values.resignationDate,
        emergencyName: values.emergencyName,
        emergencyCellphone: values.emergencyCellphone,
        emergencyRelationship: values.emergencyRelationship,
        note: values.note
      })

      // 獲取更新後的部門信息
      const { data: departmentResponse } = await apiAuth.get(`/department/${values.department}`)

      // 在表格中更新該筆資料
      const index = tableItems.value.findIndex(item => item._id === dialog.value.id)
      if (index !== -1) {
        tableItems.value[index] = {
          ...updateResponse.result,
          department: departmentResponse.result
        }
      }

      // 儲存當前頁碼並重新加載該頁數據
      localStorage.setItem('userTablePage', currentPageNumber.toString())
      await tableLoadItems(false, currentPageNumber)

      createSnackbar({
        text: '使用者更新成功',
        snackbarProps: {
          color: 'teal-darken-1'
        }
      })
    } else {
      // 新增用戶
      await apiAuth.post('/user', {
        email: values.email,
        name: values.name,
        englishName: values.englishName,
        gender: values.gender,
        IDNumber: values.IDNumber,
        address: values.address,
        birthDate: values.birthDate,
        company: values.company,
        department: values.department,
        cellphone: values.cellphone,
        extension: values.extension,
        printNumber: values.printNumber,
        jobTitle: values.jobTitle,
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

      // 新增後回到第一頁
      localStorage.setItem('userTablePage', '1')
      await tableLoadItems(true)

      createSnackbar({
        text: '使用者新增成功',
        snackbarProps: {
          color: 'teal-darken-1'
        }
      })
    }

    closeDialog()
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

const onUpdatePage = (page) => {
  if (page < 1) page = 1
  const maxPage = Math.ceil(tableItemsLength.value / tableItemsPerPage.value)
  if (page > maxPage) page = maxPage

  if (tablePage.value !== page) {
    tablePage.value = page
    tableLoadItems(false)
  }
}
// 數據表格相關變量
const tableItemsPerPage = ref(10)
const tableSortBy = ref([
  { key: 'userId', order: 'asc' }
])
const tablePage = ref(1)
const tableItems = ref([])
const tableKey = ref(0)
const tableHeaders = [
  { title: '員編', align: 'left', sortable: true, key: 'userId' },
  { title: 'Email', align: 'left', sortable: true, key: 'email' },
  { title: '姓名', align: 'left', sortable: true, key: 'name' },
  { title: '所屬公司', align: 'left', sortable: true, key: 'department.companyId' },
  { title: '部門', align: 'left', sortable: true, key: 'department.name' },
  { title: '手機', align: 'left', sortable: true, key: 'cellphone' },
  { title: '身分別', align: 'left', sortable: true, key: 'role' },
  { title: '狀態', align: 'left', sortable: true, key: 'employmentStatus' },
  { title: '操作', align: 'left', sortable: false, key: 'action' }
]
// 根據斷點條件動態生成標題
const filteredHeaders = computed(() => {
  // 在 'lg' 和 'xl' 顯示全部欄位
  if (['lg', 'xl', 'xxl'].includes(currentBreakpoint.value)) {
    return tableHeaders
  }
  if (['md'].includes(currentBreakpoint.value)) {
    // 在 'md' 斷點隱藏 "公司" 欄位
    return tableHeaders.filter(header => header.key !== 'cellphone' && header.key !== 'email')
  }
  if (['sm'].includes(currentBreakpoint.value)) {
    // 在 'sm' 斷點隱藏 "公司" 和 "部門" 欄位
    return tableHeaders.filter(header => header.key !== 'department.companyId' && header.key !== 'department.name' && header.key !== 'cellphone' && header.key !== 'email')
  }
  // 其他斷點隱藏 "手機號碼" 欄位
  return tableHeaders.filter(header => header.key !== 'department.companyId' && header.key !== 'department.name' && header.key !== 'cellphone' && header.key !== 'email' && header.key !== 'role' && header.key !== 'employmentStatus')
})

const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableSearch = ref('')

// 加載表格數據
const tableLoadItems = async (reset, page) => {
  console.log('Loading items:', { reset, page, currentPage: tablePage.value })
  tableLoading.value = true
  if (reset) {
    tablePage.value = 1
  } else if (page) {
    tablePage.value = page
  }
  // 確保頁碼至少為 1
  tablePage.value = Math.max(1, tablePage.value)
  try {
    const { data } = await apiAuth.get('/user/all', {
      params: {
        page: tablePage.value, // 將 tablePage.value 傳遞給後端
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'userId',
        sortOrder: tableSortBy.value[0]?.order || 'asc',
        search: tableSearch.value,
        role: roleFilter.value
      }
    })
    // 更新表格數據
    const { data: users, totalItems } = data.result
    tableItems.value = users
    tableItemsLength.value = totalItems

    // 計算最大頁數
    const maxPage = Math.ceil(totalItems / tableItemsPerPage.value)

    // 檢查當前頁碼是否有效
    if (tablePage.value > maxPage) {
      console.log('Current page exceeds max page, adjusting...')
      tablePage.value = Math.max(1, maxPage)
      // 如果頁碼無效，重新加載正確的頁
      if (maxPage > 0) {
        return tableLoadItems(false, tablePage.value)
      }
    }

    // 更新 localStorage 中的頁碼
    if (!reset) {
      localStorage.setItem('userTablePage', tablePage.value.toString())
    }
  } catch (error) {
    console.error('Error loading items:', error)
    createSnackbar({
      text: error?.response?.data?.message || '載入資料時發生錯誤',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
    // 發生錯誤時重置到第一頁
    tableItems.value = []
    tableItemsLength.value = 0
    tablePage.value = 1
  } finally {
    tableLoading.value = false
  }
}

// 初始加載表格數據
tableLoadItems()

// 建立一個 debounced 的搜尋函數
const debouncedSearch = debounce((value) => {
  tableLoadItems(true)
}, 300) // 300ms 的延遲

// 監聽搜尋值的變化
watch(tableSearch, (newVal) => {
  debouncedSearch(newVal)
})

// 監聽 selectedCompany 的變化並更新部門列表
watch(selectedCompany, async (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    // 更新 company 欄位並載入部門列表
    company.value.value = newVal // 將選擇的公司同步到 company 欄位
    department.value.value = null // 重置部門欄位的值
    await fetchDepartments() // 根據新選擇的公司重新加載部門
  } else {
    // 若公司欄位被清空，清空部門列表並重置 department 欄位值
    company.value.value = null
    department.value.value = null
    filteredDepartments.value = [] // 清空部門列表
  }
})

watch(company.value, (newVal) => {
  if (newVal && newVal.value !== null && newVal.value !== undefined) {
    selectedCompany.value = newVal.value
  }
})
// 初始化時載入部門列表
// 根據預設的 selectedCompany 值加載部門
onMounted(async () => {
  const storedPage = localStorage.getItem('userTablePage')
  if (storedPage) {
    tablePage.value = parseInt(storedPage)
    tableKey.value++
    await tableLoadItems(false, tablePage.value) // 加載存儲的頁面數據
  } else {
    await tableLoadItems() // 加載第一頁數據
  }

  await loadDepartments()
  await fetchDepartments()
})

// 在組件卸載時取消 debounce
onUnmounted(() => {
  debouncedSearch.cancel()
})
</script>

<style lang="scss" scoped>
:deep(.header-bg)  {
  background-color: #455A64;
  color: white;
}

.odd-row {
  background-color: #f9f9f9;
}

.even-row {
  background-color: rgb(255, 250, 240);
}
</style>
