<template>
  <div
    id="background"
    class="fill-height d-flex justify-center align-center"
  >
    <v-container
      class="first-time-login-wrapper pa-0"
      style="max-width: 360px;"
    >
      <v-form
        :disabled="isSubmitting"
        @submit.prevent="submit"
      >
        <v-row class="px-4 ma-0">
          <v-col
            cols="12"
            class="text-center mt-4 font-weight-bold"
          >
            修改密碼 (首次登入)
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="form.newPassword"
              :error-messages="passwordError"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              label="新密碼"
              density="compact"
              variant="underlined"
              autocomplete="new-password"
              @click:append-inner="showPassword = !showPassword"
              @update:model-value="passwordError = ''"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="form.confirmPassword"
              :error-messages="confirmError"
              :type="showConfirmPassword ? 'text' : 'password'"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
              label="確認新密碼"
              density="compact"
              variant="underlined"
              autocomplete="new-password"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
              @update:model-value="confirmError = ''"
            />
          </v-col>

          <v-col
            cols="12"
            class="pb-8"
          >
            <div class="text-body-2 text-medium-emphasis mb-6">
              請修改您的初始密碼,新密碼必須至少8個字元
            </div>
            <v-btn
              block
              elevation="2"
              color="blue-grey-darken-2"
              type="submit"
              :loading="isSubmitting"
              :disabled="!form.newPassword || !form.confirmPassword"
            >
              修改密碼
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/axios'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'

definePage({
  name: 'first-time-login',
  path: '/first-time-login',
  meta: {
    title: '首次登入 | ysphere',
    layout: 'login'
  }
})

const router = useRouter()
const { apiAuth } = useApi()
const user = useUserStore()
const createSnackbar = useSnackbar()

const form = ref({
  newPassword: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordError = ref('')
const confirmError = ref('')
const isSubmitting = ref(false)

const validateForm = () => {
  let isValid = true

  passwordError.value = ''
  confirmError.value = ''

  if (!form.value.newPassword) {
    passwordError.value = '請輸入新密碼'
    isValid = false
  } else if (form.value.newPassword.length < 8) {
    passwordError.value = '密碼長度至少需要8個字元'
    isValid = false
  }

  if (!form.value.confirmPassword) {
    confirmError.value = '請確認新密碼'
    isValid = false
  } else if (form.value.newPassword !== form.value.confirmPassword) {
    confirmError.value = '兩次輸入的密碼不相符'
    isValid = false
  }

  return isValid
}

const submit = async () => {
  if (!validateForm()) return

  try {
    isSubmitting.value = true
    const { data } = await apiAuth.patch('/user/change-password', {
      currentPassword: user.password, // 使用用戶原始密碼
      newPassword: form.value.newPassword
    })

    createSnackbar({
      text: data.message,
      snackbarProps: { color: 'teal-lighten-1' }
    })

    // 修改成功後,重新登入
    await user.logout()
    router.push('/login')
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '修改密碼失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
#background {
  width: 100%;
  min-height: 100vh;
  background-image: url(/src/assets/image/bg_login_1.webp);
  background-size: cover;
  background-position: center;
}

.first-time-login-wrapper {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 18px;
  font-weight: 500;
  box-shadow: 0 0 20px 4px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

// 確保表單填滿容器高度
.v-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
