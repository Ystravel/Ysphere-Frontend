<template>
  <v-container>
    <v-row class="elevation-4 rounded-xl py-8 px-1 px-sm-10 mt-2 mt-sm-10 mx-0 mx-sm-4 mx-md-10">
      <v-col cols="12">
        <h3>
          個人資料管理
        </h3>
      </v-col>
      <v-col>
        <v-divider class="mb-8" />
      </v-col>
      <v-col cols="12">
        <v-form
          v-if="mdAndUp"
          :disabled="isSubmitting"
          @submit.prevent="openConfirmDialog"
        >
          <v-row
            style="font-size: 14px;"
            class="text-blue-grey-darken-2"
          >
            <v-col
              class="px-4 py-0"
              cols="4"
            >
              姓名 <span style="color: #d9534f;">*</span> :
            </v-col>
            <v-col class="px-4 py-0">
              英文名 <span style="color: #d9534f;">*</span> :
            </v-col>
            <v-col class="px-4 py-0">
              生日 <span style="color: #d9534f;">*</span> :
            </v-col>
          </v-row>
          <v-row class="mt-4">
            <v-col class="pt-1">
              <v-text-field
                v-model="name.value.value"
                :error-messages="name.errorMessage.value"
                density="compact"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col class="pt-1">
              <v-text-field
                v-model="englishName.value.value"
                density="compact"
                variant="outlined"
                hide-details
                clearable
              />
            </v-col>
            <v-col class="pt-1">
              <v-date-input
                v-model="birthDate.value.value"
                :error-messages="birthDate.errorMessage.value"
                density="compact"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>
          <v-row
            class="mt-4 text-blue-grey-darken-2"
            style="font-size: 14px;"
          >
            <v-col
              class="px-4 py-0"
              cols="4"
            >
              手機號碼 <span style="color: #d9534f;">*</span> :
            </v-col>
            <v-col class="px-4 py-0">
              地址 :
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="cellphone.value.value"
                :error-messages="cellphone.errorMessage.value"
                density="compact"
                variant="outlined"
                maxlength="10"
                clearable
              />
            </v-col>

            <v-col cols="8">
              <v-text-field
                v-model="address.value.value"
                :error-messages="address.errorMessage.value"
                density="compact"
                variant="outlined"
                hide-details
                clearable
              />
            </v-col>
          </v-row>
          <v-row class="px-4 py-10">
            <v-btn
              color="teal-darken-1"
              variant="outlined"
              height="32"
              @click="showPasswordDialog = true"
            >
              修改密碼
            </v-btn>
            <v-spacer />
            <v-btn
              color="orange-darken-4"
              variant="outlined"
              height="32"
              class="ms-1"
              :loading="isSubmitting"
              :disabled="!hasChanges"
              @click="openConfirmDialog"
            >
              儲存
            </v-btn>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  <!-- 修改密碼對話框 -->
  <v-dialog
    v-model="showPasswordDialog"
    max-width="360"
  >
    <v-card>
      <v-card-title class="text-h6 ps-6 pt-6">
        修改密碼
      </v-card-title>
      <v-card-text class="pb-0">
        <v-form @submit.prevent="handlePasswordChange">
          <v-text-field
            v-model="passwordForm.currentPassword"
            :error-messages="currentPasswordError"
            label="當前密碼"
            type="password"
            variant="outlined"
            density="compact"
            class="mb-4"
            @update:model-value="currentPasswordError = ''"
          />
          <v-text-field
            v-model="passwordForm.newPassword"
            :error-messages="newPasswordError"
            label="新密碼"
            type="password"
            variant="outlined"
            density="compact"
            class="mb-4"
            @update:model-value="newPasswordError = ''"
          />
          <v-text-field
            v-model="passwordForm.confirmPassword"
            :error-messages="confirmPasswordError"
            label="確認新密碼"
            type="password"
            variant="outlined"
            density="compact"
            class="mb-4"
            @update:model-value="confirmPasswordError = ''"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="me-4 mb-3">
        <v-spacer />
        <v-btn
          color="grey"
          variant="outlined"
          height="32"
          @click="closePasswordDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="red-darken-1"
          variant="outlined"
          height="32"
          :loading="isChangingPassword"
          @click="handlePasswordChange"
        >
          確認修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 確認對話框 -->
  <ConfirmDialog
    v-model="showConfirmDialog"
    title="確認更新"
    message="您確定要更新個人資料嗎？"
    confirm-button-color="teal-darken-1"
    cancel-button-color="red-lighten-1"
    @confirm="submitProfile"
  />
</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { onMounted, computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import validator from 'validator'
import { useDisplay } from 'vuetify'
import ConfirmDialog from '../components/ConfirmDeleteDialog.vue'

const { mdAndUp } = useDisplay()
definePage({
  meta: {
    title: '個人資料管理 | ystravel',
    login: true,
    admin: false
  }
})

const showPasswordDialog = ref(false)
const isChangingPassword = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const currentPasswordError = ref('')
const newPasswordError = ref('')
const confirmPasswordError = ref('')

const user = useUserStore()
const createSnackbar = useSnackbar()
const originalData = ref(null)

const formatToDate = (dateString) => {
  return dateString ? new Date(dateString) : null
}

const showConfirmDialog = ref(false)

const openConfirmDialog = () => {
  showConfirmDialog.value = true
}

const validatePasswordForm = () => {
  let isValid = true

  if (!passwordForm.value.currentPassword) {
    currentPasswordError.value = '請輸入當前密碼'
    isValid = false
  }

  if (!passwordForm.value.newPassword) {
    newPasswordError.value = '請輸入新密碼'
    isValid = false
  } else if (passwordForm.value.newPassword.length < 8) {
    newPasswordError.value = '新密碼長度至少需要8個字元'
    isValid = false
  }

  if (!passwordForm.value.confirmPassword) {
    confirmPasswordError.value = '請確認新密碼'
    isValid = false
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    confirmPasswordError.value = '兩次輸入的密碼不相符'
    isValid = false
  }

  return isValid
}

const handlePasswordChange = async () => {
  if (!validatePasswordForm()) return

  try {
    isChangingPassword.value = true
    const result = await user.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )

    // 使用回傳的訊息
    createSnackbar({
      text: result.message,
      snackbarProps: { color: 'teal-darken-1' }
    })

    closePasswordDialog()
  } catch (error) {
    // 錯誤訊息已經在 store 中處理過，直接使用
    createSnackbar({
      text: error.message,
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    isChangingPassword.value = false
  }
}
const closePasswordDialog = () => {
  showPasswordDialog.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  currentPasswordError.value = ''
  newPasswordError.value = ''
  confirmPasswordError.value = ''
}

const schema = yup.object({
  name: yup
    .string()
    .required('請輸入姓名'),
  englishName: yup
    .string().nullable(),
  birthDate: yup
    .date()
    .required('請輸入生日'),
  cellphone: yup
    .string()
    .required('請輸入手機號碼')
    .min(10, '請輸入10碼手機號碼')
    .test(
      'isMobilePhone', '請輸入正確的手機號碼格式',
      (value) => {
        return validator.isMobilePhone(value)
      }
    ),
  address: yup
    .string()
    .nullable()
})

const { handleSubmit, setValues, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    englishName: '',
    birthDate: '',
    cellphone: '',
    email: '',
    address: ''
  }
})

const name = useField('name')
const englishName = useField('englishName')
const birthDate = useField('birthDate')
const cellphone = useField('cellphone')
const address = useField('address')

const loadProfile = async () => {
  await user.profile()
  originalData.value = {
    name: user.name,
    englishName: user.englishName,
    birthDate: user.birthDate,
    cellphone: user.cellphone,
    address: user.address
  }
  setValues({
    name: user.name,
    englishName: user.englishName,
    birthDate: formatToDate(user.birthDate),
    cellphone: user.cellphone,
    address: user.address
  })
}

const hasChanges = computed(() => {
  if (!originalData.value) return false

  return (
    originalData.value.name !== name.value.value ||
    originalData.value.englishName !== englishName.value.value ||
    formatToDate(originalData.value.birthDate)?.toISOString() !== birthDate.value.value?.toISOString() ||
    originalData.value.cellphone !== cellphone.value.value ||
    originalData.value.address !== address.value.value
  )
})

onMounted(loadProfile)

const saveProfile = async (values) => {
  console.log(values)
  try {
    const updatedProfile = await user.updateProfile({
      ...values
    })
    setValues({
      ...updatedProfile,
      birthDate: formatToDate(updatedProfile.birthDate)
    })
    createSnackbar({
      text: '資料更新成功',
      snackbarProps: { color: 'teal-darken-1' }
    })
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

const submitProfile = handleSubmit(saveProfile)
</script>

<style lang="scss" scoped>
  @import '/src/styles/settings.scss';
  #profile-form-sm {
    :deep(.v-field__input) {
    min-height: 28px !important;
    padding: 0 4px !important;
    font-size: 14px;
    text-align: center;
    }
    .avatar {
    border: 1px solid #039199;
    border-radius: 50%;
    position: relative;
    max-width: 200px;
    max-height: 200px;
    }

    .camera-icon {
      position: absolute;
      cursor: pointer;
      background-color: white;
      border-radius: 50%;
      padding: 5px;
      right: 4px;
      bottom: 4px;
    }

    .userId {
      font-size: 14px;
      font-weight: 400;
    }
  }

</style>
