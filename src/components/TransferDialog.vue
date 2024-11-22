<template>
  <v-dialog
    v-model="dialog"
    persistent
    :width="dialogWidth"
  >
    <v-form
      ref="transferForm"
      @submit.prevent="submitTransfer"
    >
      <v-card class="rounded-lg px-4 py-6">
        <div class="card-title ps-4 py-3 d-flex align-center text-blue-grey-darken-1">
          <v-icon
            icon="mdi-account-convert"
            size="18"
            class="me-3"
          />轉為正式員工
        </div>

        <!-- 基本資料區塊 -->
        <v-row class="py-4">
          <v-col
            cols="4"
            md="5"
            class="d-flex align-center ps-6"
          >
            <v-divider />
          </v-col>
          <v-col
            cols="4"
            md="2"
            class="info-title px-0 text-blue-grey-darken-2"
          >
            基本資料
          </v-col>
          <v-col
            cols="4"
            md="5"
            class="d-flex align-center pe-6"
          >
            <v-divider />
          </v-col>
        </v-row>

        <v-card-text
          v-if="isInitializingStatus"
          class="d-flex justify-center align-center"
          style="height: 600px;"
        >
          <v-progress-circular
            indeterminate
            color="blue-grey-darken-2"
            :size="circularSize"
          />
        </v-card-text>

        <v-card-text
          v-if="!isInitializingStatus"
          class="mt-3 pa-3"
        >
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="name.value.value"
                :error-messages="name.errorMessage.value"
                label="*姓名"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="englishName.value.value"
                :error-messages="englishName.errorMessage.value"
                label="*英文名"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="IDNumber.value.value"
                :error-messages="IDNumber.errorMessage.value"
                label="*身分證號碼"
                maxlength="10"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-date-input
                v-model="birthDate.value.value"
                :error-messages="birthDate.errorMessage.value"
                label="*生日"
                prepend-icon
                variant="outlined"
                density="compact"
                clearable
                :cancel-text="'取消'"
                :ok-text="'確認'"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-select
                v-model="gender.value.value"
                :items="genderOptions"
                :error-messages="gender.errorMessage.value"
                label="*性別"
                variant="outlined"
                density="compact"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="cellphone.value.value"
                :error-messages="cellphone.errorMessage.value"
                label="*手機號碼"
                maxlength="10"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              class="pb-0"
            >
              <v-text-field
                v-model="personalEmail.value.value"
                :error-messages="personalEmail.errorMessage.value"
                label="個人Email"
                type="email"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              class="pb-0"
            >
              <v-text-field
                v-model="permanentAddress.value.value"
                :error-messages="permanentAddress.errorMessage.value"
                label="*戶籍地址"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              class="pb-0"
            >
              <v-text-field
                v-model="contactAddress.value.value"
                :error-messages="contactAddress.errorMessage.value"
                label="*聯絡地址"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              >
                <template #append-inner>
                  <v-tooltip
                    location="top"
                    close-delay="200"
                  >
                    <template #activator="{ cprops }">
                      <v-icon
                        v-bind="cprops"
                        icon="mdi-content-copy"
                        @click="copyPermanentAddress"
                      />
                    </template>
                    複製戶籍地址
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col
              v-if="mdAndUp && !lgAndUp"
              cols="6"
            />
            <v-col
              cols="12"
              sm="6"
              md="4"
              class="pb-0"
            >
              <v-text-field
                v-model="emergencyName.value.value"
                :error-messages="emergencyName.errorMessage.value"
                label="*緊急聯絡人姓名"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              class="pb-0"
            >
              <v-text-field
                v-model="emergencyCellphone.value.value"
                :error-messages="emergencyCellphone.errorMessage.value"
                label="*緊急聯絡人電話"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              class="pb-0"
            >
              <v-text-field
                v-model="emergencyRelationship.value.value"
                :error-messages="emergencyRelationship.errorMessage.value"
                label="緊急聯絡人關係"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-text>

        <!-- 任職資訊區塊 -->
        <v-row
          v-if="!isInitializingStatus"
          class="py-4"
        >
          <v-col
            cols="3"
            md="4"
            class="d-flex align-center ps-6"
          >
            <v-divider />
          </v-col>
          <v-col
            cols="6"
            md="4"
            class="info-title text-blue-grey-darken-2"
          >
            任職資訊
          </v-col>
          <v-col
            cols="3"
            md="4"
            class="d-flex align-center pe-6"
          >
            <v-divider />
          </v-col>
        </v-row>

        <v-card-text
          v-if="!isInitializingStatus"
          class="mt-3 pa-3"
        >
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-select
                v-model="selectedCompany"
                :error-messages="company.errorMessage.value"
                :items="companyOptions"
                label="*所屬公司"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="handleCompanyChange"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
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

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="jobTitle.value.value"
                :error-messages="jobTitle.errorMessage.value"
                label="*職稱"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="salary.value.value"
                :error-messages="salary.errorMessage.value"
                label="基本薪資"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
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

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-date-input
                v-model="hireDate.value.value"
                :error-messages="hireDate.errorMessage.value"
                label="*入職日期"
                prepend-icon
                variant="outlined"
                density="compact"
                clearable
                :cancel-text="'取消'"
                :ok-text="'確認'"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="extNumber.value.value"
                :error-messages="extNumber.errorMessage.value"
                label="*分機號碼"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="printNumber.value.value"
                :error-messages="printNumber.errorMessage.value"
                label="*列印編號"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="cowellAccount.value.value"
                :error-messages="cowellAccount.errorMessage.value"
                label="*科威帳號"
                :type="showCowellAccount ? 'text' : 'password'"
                :append-inner-icon="showCowellAccount ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                density="compact"
                clearable
                @click:append-inner="showCowellAccount = !showCowellAccount"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="cowellPassword.value.value"
                :error-messages="cowellPassword.errorMessage.value"
                label="*科威密碼"
                :type="showCowellPassword ? 'text' : 'password'"
                :append-inner-icon="showCowellPassword ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                density="compact"
                clearable
                @click:append-inner="showCowellPassword = !showCowellPassword"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-select
                v-model="guideLicense.value.value"
                :items="guideLicenseOptions"
                :error-messages="guideLicense.errorMessage.value"
                label="領隊證"
                variant="outlined"
                density="compact"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              class="pb-0"
            >
              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                label="*公司Email"
                type="email"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              class="pb-0"
            >
              <v-text-field
                v-model="note.value.value"
                :error-messages="note.errorMessage.value"
                label="備註"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions
          class="px-3 mt-4"
        >
          <v-spacer />
          <v-btn
            color="red-lighten-1"
            variant="outlined"
            :size="buttonSize"
            :loading="isSubmitting"
            @click="closeDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="teal-darken-1"
            variant="outlined"
            type="submit"
            class="ms-1"
            :size="buttonSize"
            :loading="isSubmitting"
          >
            確認轉換
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useDisplay } from 'vuetify'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { roleNames } from '../enums/UserRole'

const props = defineProps({
  tempUser: {
    type: Object,
    required: true,
    default: null
  }
})
const emit = defineEmits(['transferred'])

const dialog = ref(false)
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const { smAndUp, mdAndUp, lgAndUp, xlAndUp } = useDisplay()

const isInitializingStatus = ref(false)
const companies = ref([])
const buttonSize = computed(() => smAndUp.value ? 'default' : 'small')
const circularSize = computed(() => {
  return smAndUp.value ? 64 : 48
})

const roles = ref(
  Object.entries(roleNames).map(([value, title]) => ({
    value: Number(value),
    title
  }))
)

const copyPermanentAddress = () => {
  if (permanentAddress.value.value) {
    contactAddress.value.value = permanentAddress.value.value
  }
}

const dialogWidth = computed(() => {
  if (xlAndUp.value) return '1200'
  if (lgAndUp.value) return '900'
  if (mdAndUp.value) return '800'
  if (smAndUp.value) return '600'
  return '100%'
})

const userSchema = yup.object({
  email: yup.string().required('請輸入email').email('請輸入正確的 email 格式'),
  personalEmail: yup.string().email('請輸入正確的 email 格式'),
  name: yup.string().required('請輸入姓名'),
  englishName: yup.string().required('請輸入英文名'),
  gender: yup.string().required('請選擇性別'),
  IDNumber: yup.string().matches(/^[A-Za-z][12]\d{8}$/, '身分證號碼格式錯誤').required('請輸入身分證號碼'),
  permanentAddress: yup.string().required('請輸入戶籍地址'),
  contactAddress: yup.string().required('請輸入聯絡地址'),
  birthDate: yup.date().nullable().required('請選擇生日'),
  company: yup.string().nullable().required('請選擇公司'),
  department: yup.string().required('請選擇部門'),
  cellphone: yup.string().min(10, '手機號碼需為10位數字').max(10, '手機號碼勿超過10位數字').required('請輸入手機號碼'),
  salary: yup.string(),
  role: yup.string().required('請選擇權限'),
  extNumber: yup.string().required('請輸入分機號碼'),
  printNumber: yup.string().required('請輸入列印編號'),
  guideLicense: yup.boolean(),
  jobTitle: yup.string().required('請輸入職稱'),
  hireDate: yup.date().nullable().required('請選擇入職日期'),
  emergencyName: yup.string().required('請輸入緊急聯絡人姓名'),
  emergencyCellphone: yup.string().required('請輸入緊急聯絡人連絡電話'),
  emergencyRelationship: yup.string(),
  cowellAccount: yup.string().required('請輸入Cowell帳號'),
  cowellPassword: yup.string().required('請輸入Cowell密碼'),
  note: yup.string()
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: userSchema,
  initialValues: {
    email: '',
    personalEmail: '',
    name: '',
    englishName: '',
    gender: '',
    IDNumber: '',
    permanentAddress: '',
    contactAddress: '',
    birthDate: null,
    company: '',
    department: '',
    cellphone: '',
    salary: '',
    extNumber: '',
    printNumber: '',
    guideLicense: false,
    jobTitle: '',
    role: 0,
    employmentStatus: '在職',
    hireDate: new Date(),
    resignationDate: null,
    emergencyName: '',
    emergencyCellphone: '',
    emergencyRelationship: '',
    note: '',
    userId: '',
    cowellAccount: '',
    cowellPassword: ''
  },
  validateOnMount: false,
  validateOnChange: true,
  validateOnBlur: true,
  validateOnInput: false

})

// 表單欄位
const name = useField('name')
const englishName = useField('englishName')
const email = useField('email')
const personalEmail = useField('personalEmail')
const IDNumber = useField('IDNumber')
const gender = useField('gender')
const cellphone = useField('cellphone')
const birthDate = useField('birthDate')
const permanentAddress = useField('permanentAddress')
const contactAddress = useField('contactAddress')
const emergencyName = useField('emergencyName')
const emergencyCellphone = useField('emergencyCellphone')
const emergencyRelationship = useField('emergencyRelationship')
const company = useField('company')
const department = useField('department')
const jobTitle = useField('jobTitle')
const salary = useField('salary')
const role = useField('role')
const extNumber = useField('extNumber')
const hireDate = useField('hireDate')
const printNumber = useField('printNumber')
const guideLicense = useField('guideLicense')
const cowellAccount = useField('cowellAccount')
const cowellPassword = useField('cowellPassword')
const note = useField('note')

const selectedCompany = ref(null)
const filteredDepartments = ref([])
const companyOptions = computed(() => {
  return [...companies.value]
    .sort((a, b) => {
      // 確保 companyId 存在
      const idA = a.companyId || ''
      const idB = b.companyId || ''
      return idA.localeCompare(idB)
    })
    .map(company => ({
      title: company.name,
      value: company._id
    }))
})
const showCowellAccount = ref(false)
const showCowellPassword = ref(false)

const genderOptions = [
  { title: '男性', value: '男性' },
  { title: '女性', value: '女性' }
]

const guideLicenseOptions = [
  { title: '有', value: true },
  { title: '無', value: false }
]

const openTransferDialog = async (tempUser) => {
  isInitializingStatus.value = true
  dialog.value = true
  try {
    // 提前獲取公司列表
    const { data: companiesData } = await apiAuth.get('/company/all')
    if (companiesData.success) {
      companies.value = companiesData.result
    }

    const { data } = await apiAuth.get(`/tempUser/${tempUser._id}/formatted-for-transfer`)
    if (data.success) {
      // 設置公司和取得部門資料
      if (data.result.company) {
        selectedCompany.value = data.result.company
        await handleCompanyChange(data.result.company)
        // 確保部門被正確設置
        department.value.value = data.result.department
      }

      // 重置表單並填充數據
      resetForm({
        values: {
          ...data.result,
          // 確保這些欄位被正確設置
          personalEmail: data.result.personalEmail || '',
          company: data.result.company || '',
          department: data.result.department || '',
          hireDate: data.result.hireDate || null,
          birthDate: data.result.birthDate ? new Date(data.result.birthDate) : null
        }
      })
    }
  } catch (error) {
    console.error('獲取格式化數據失敗:', error)
    createSnackbar({
      text: '獲取員工數據失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    // 使用 setTimeout 確保在資料加載完後再隱藏 loading
    setTimeout(() => {
      isInitializingStatus.value = false
    }, 300)
  }
}

const handleCompanyChange = async (selectedCompanyId) => {
  try {
    if (!selectedCompanyId) {
      filteredDepartments.value = []
      return
    }

    const { data } = await apiAuth.get('/department/all', {
      params: {
        companyId: selectedCompanyId,
        itemsPerPage: 100
      }
    })

    if (data.success) {
      filteredDepartments.value = data.result.data || []
      // 設置公司值
      company.value.value = selectedCompanyId
    }
  } catch (error) {
    console.error('載入部門失敗:', error)
    createSnackbar({
      text: '載入部門資料失敗',
      snackbarProps: { color: 'error' }
    })
    filteredDepartments.value = []
  }
}

const submitTransfer = handleSubmit(async (values) => {
  try {
    // 1. 先創建正式員工
    const { data } = await apiAuth.post('/user', values)
    if (data.success) {
      // 2. 更新臨時員工狀態
      await apiAuth.patch(
        `/tempUser/${props.tempUser._id}/update-after-transfer/${data.result._id}`
      )

      // 3. 發送事件並關閉對話框
      emit('transferred', data.result)
      dialog.value = false

      createSnackbar({
        text: '轉換成功',
        snackbarProps: { color: 'success' }
      })
    }
  } catch (error) {
    console.error('轉換失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '轉換失敗',
      snackbarProps: { color: 'error' }
    })
  }
})

const closeDialog = () => {
  dialog.value = false
  resetForm()
  isInitializingStatus.value = false
}

defineExpose({
  openTransferDialog
})

// 監聽 selectedCompany
watch(selectedCompany, async (newVal) => {
  if (newVal) {
    company.value.value = newVal
    await handleCompanyChange(newVal)
  } else {
    company.value.value = null
    department.value.value = null
    filteredDepartments.value = []
  }
})

// 監聽 company 欄位
watch(() => company.value.value, (newVal) => {
  if (newVal) {
    selectedCompany.value = newVal
  }
})
</script>

<style lang="scss" scoped>
@import '/src/styles/settings.scss';

.info-title {
  text-align: center;
  letter-spacing: 2px;
  font-size: 14px;
  font-weight: 900;
}

@include md {
  .info-title {
  text-align: center;
  letter-spacing: 4px;
  font-size: 15px;
}
}

</style>
