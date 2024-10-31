<template>
  <div>
    <!-- 顯示授權結果的處理邏輯 -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const success = params.get('success') === 'true'
  const message = params.get('message')

  if (success) {
    const token = params.get('token')
    const email = params.get('email')
    const name = params.get('name')
    const role = parseInt(params.get('role'), 10)

    user.$patch({ token, email, name, role })

    createSnackbar({
      text: '登入成功',
      snackbarProps: {
        color: 'teal-darken-1'
      }
    })

    router.push('/')
  } else {
    createSnackbar({
      text: message || '登入失敗',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
  }

  window.close()
})
</script>
