<template>
  <div
    id="background"
    class="d-flex justify-center align-center"
  >
    <v-container
      class="forgot-password-wrapper pa-0"
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
            忘記密碼
          </v-col>

          <v-col cols="12">
            <div class="text-body-2 text-medium-emphasis my-4">
              請輸入您的 Email ，將寄送密碼重置連結給您。
            </div>
            <v-text-field
              v-model="email.value.value"
              :error-messages="email.errorMessage.value"
              label="Email"
              density="compact"
              variant="underlined"
              clearable
            />
          </v-col>

          <v-col
            cols="12"
          >
            <v-btn
              block
              elevation="2"
              color="blue-grey-darken-2"
              type="submit"
              :loading="isSubmitting"
            >
              發送重置郵件
            </v-btn>
          </v-col>

          <v-col
            cols="12"
            class="text-center pb-2"
          >
            <router-link
              class="text-grey-darken-1"
              style="font-size: 15px; font-weight: 500;"
              to="/login"
            >
              返回登入
            </router-link>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

// 添加調試代碼
onMounted(() => {
  console.log('Forgot password component mounted')
})

definePage({
  meta: {
    title: '忘記密碼 | ysphere',
    layout: 'login'
  }
})

const { api } = useApi()
const router = useRouter()
const createSnackbar = useSnackbar()

const schema = yup.object({
  email: yup
    .string()
    .required('請輸入email')
    .email('請輸入正確email格式')
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema
})

const email = useField('email')

const submit = handleSubmit(async (values) => {
  try {
    const { data } = await api.post('/user/forgot-password', {
      email: values.email
    })

    createSnackbar({
      text: data.message,
      snackbarProps: { color: 'success' }
    })

    // 導回登入頁
    router.push('/login')
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '發送重置郵件失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
})
</script>

<style lang="scss" scoped>
#background {
  width: 100%;
  min-height: 100vh;
  background-image: url(/src/assets/image/bg_login_1.webp);
  background-size: cover;
  background-position: center;
}

.forgot-password-wrapper {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 18px;
  font-weight: 500;
  box-shadow: 0 0 20px 4px rgba(0,0,0,0.2);
  min-height: 340px;
  display: flex;
  flex-direction: column;
}

// 確保表單填滿容器高度
.v-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.v-row {
  flex: 1;
}
</style>
