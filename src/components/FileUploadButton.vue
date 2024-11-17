<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png"
      style="display: none"
      @change="handleFileChange"
    >
    <!-- 大螢幕版本 -->
    <v-btn
      v-if="isLgmUp"
      v-tooltip:top="'檔案不超過2MB。格式僅限JPG、PNG、WEBP。'"
      prepend-icon="mdi-camera-outline"
      color="blue-grey-darken-2"
      variant="outlined"
      :loading="isUploading"
      @click="$refs.fileInput.click()"
    >
      <v-progress-circular
        v-if="isUploading"
        indeterminate
        size="20"
        width="2"
        color="teal-lighten-1"
        class="me-2"
      />
      更換大頭貼
    </v-btn>

    <!-- 小螢幕版本 -->
    <v-btn
      v-else
      color="blue-grey-darken-2"
      size="24"
      elevation="0"
      rounded="xl"
      :loading="isUploading"
      @click="$refs.fileInput.click()"
    >
      <v-icon
        icon="mdi-camera-outline"
        size="14"
      />
    </v-btn>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'
import { useDisplay } from 'vuetify'

const fileInput = ref(null)
const user = useUserStore()
const createSnackbar = useSnackbar()
const isUploading = ref(false)
const { width } = useDisplay()
const isLgmUp = computed(() => width.value >= 1500)

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    createSnackbar({
      text: '只能上傳 JPG、PNG、WEBP 格式的圖片',
      snackbarProps: { color: 'error' }
    })
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    createSnackbar({
      text: '圖片大小不能超過 2MB',
      snackbarProps: { color: 'error' }
    })
    return
  }

  const formData = new FormData()
  formData.append('image', file)

  try {
    isUploading.value = true
    await user.updateAvatar(formData)
    createSnackbar({
      text: '大頭貼更新成功',
      snackbarProps: { color: 'success' }
    })
  } catch (error) {
    createSnackbar({
      text: error.message || '上傳失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    isUploading.value = false
    event.target.value = ''
  }
}
</script>
