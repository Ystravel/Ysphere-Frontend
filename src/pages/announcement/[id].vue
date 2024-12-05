<template>
  <v-container
    max-width="1000px"
    class="pa-0 pa-sm-4 ms-0 ms-sm-auto me-sm-auto"
  >
    <v-row>
      <v-col cols="12">
        <!-- 返回按鈕 -->
        <v-btn
          color="grey"
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-4"
          @click="router.back()"
        >
          返回列表
        </v-btn>

        <!-- 公告內容卡片 -->
        <v-card
          v-if="announcement"
          class="pa-6"
        >
          <!-- 操作按鈕 -->
          <div
            v-if="canManageAnnouncement"
            class="d-flex justify-end mb-4"
          >
            <v-btn
              color="primary"
              variant="outlined"
              class="me-2"
              prepend-icon="mdi-pencil"
              @click="openDialog"
            >
              編輯公告
            </v-btn>
            <v-btn
              color="error"
              variant="outlined"
              prepend-icon="mdi-delete"
              @click="confirmDelete"
            >
              刪除公告
            </v-btn>
          </div>

          <!-- 標題區域 -->
          <div class="d-flex align-center mb-6">
            <v-chip
              :color="getTypeColor(announcement.type)"
              :text-color="getTypeTextColor(announcement.type)"
              class="me-4"
            >
              {{ announcement.type }}
            </v-chip>
            <h2 class="text-h4 font-weight-bold">
              {{ announcement.title }}
            </h2>
          </div>

          <!-- 發布資訊 -->
          <v-card
            class="mb-6 pa-4 bg-grey-lighten-4"
            flat
          >
            <div class="d-flex flex-wrap gap-4">
              <div class="d-flex align-center">
                <v-icon class="me-2">
                  mdi-account
                </v-icon>
                <span>{{ announcement.author?.name }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon class="me-2">
                  mdi-office-building
                </v-icon>
                <span>{{ announcement.department?.name }} ({{ announcement.department?.departmentId }})</span>
              </div>
              <div class="d-flex align-center">
                <v-icon class="me-2">
                  mdi-clock-outline
                </v-icon>
                <span>{{ formatDate(announcement.createdAt) }}</span>
              </div>
              <div
                v-if="announcement.expiryDate"
                class="d-flex align-center"
              >
                <v-icon class="me-2">
                  mdi-calendar-clock
                </v-icon>
                <span>自動下架時間：{{ formatDate(announcement.expiryDate) }}</span>
              </div>
            </div>
          </v-card>

          <!-- 公告內容 -->
          <div
            class="announcement-content mb-6"
            v-html="announcement.content"
          />

          <!-- 附件列表 -->
          <v-card
            v-if="announcement.attachments?.length"
            class="pa-4 bg-grey-lighten-4"
            flat
          >
            <div class="text-subtitle-1 font-weight-bold mb-3">
              附件列表
            </div>
            <v-list>
              <v-list-item
                v-for="attachment in announcement.attachments"
                :key="attachment._id"
                :href="getAttachmentUrl(attachment.path)"
                target="_blank"
                :prepend-icon="getFileIcon(attachment.fileType)"
              >
                <v-list-item-title>{{ attachment.filename }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatFileSize(attachment.size) }} - {{ formatDate(attachment.uploadDate) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-card>

        <!-- 載入狀態 -->
        <div
          v-else-if="loading"
          class="d-flex justify-center py-12"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </div>

        <!-- 錯誤狀態 -->
        <v-alert
          v-else
          type="error"
          class="mt-4"
        >
          無法載入公告內容
        </v-alert>
      </v-col>
    </v-row>

    <!-- 確認刪除對話框 -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          確認刪除
        </v-card-title>
        <v-card-text>確定要刪除此公告嗎？此操作無法復原。</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="showDeleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="deleteAnnouncement"
          >
            確認刪除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 編輯公告對話框 -->
    <v-dialog
      v-model="dialog.show"
      persistent
      max-width="900px"
      height="100%"
    >
      <v-card class="pa-4 h-100">
        <v-card-title class="text-h5 pb-4">
          編輯公告
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="formValid"
            @submit.prevent="submitAnnouncement"
          >
            <v-row>
              <v-col
                cols="12"
                sm="8"
              >
                <v-text-field
                  v-model="formData.title"
                  label="公告標題"
                  :rules="titleRules"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                sm="4"
              >
                <v-select
                  v-model="formData.type"
                  :items="announcementTypes"
                  label="公告類型"
                  required
                />
              </v-col>
              <v-col cols="12">
                <QuillEditor
                  v-model:content="formData.content"
                  style="min-height: 640px;"
                  content-type="html"
                  toolbar="full"
                  theme="snow"
                />
              </v-col>
              <v-col
                cols="12"
                class="px-9"
              >
                <v-file-input
                  v-model="formData.attachments"
                  label="附件上傳"
                  multiple
                  show-size
                  counter
                  variant="underlined"
                  :rules="attachmentRules"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                />
              </v-col>
              <v-col cols="12">
                <v-checkbox
                  v-model="showExpiryDatePicker"
                  label="設定自動下架時間"
                />
                <v-date-input
                  v-if="showExpiryDatePicker"
                  v-model="formData.expiryDate"
                  label="自動下架時間"
                  :min="tomorrow"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  :ok-text="'確認'"
                  :cancel-text="'取消'"
                  @click:clear="formData.expiryDate = null"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="closeDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            :loading="submitting"
            :disabled="!formValid || submitting"
            @click="submitAnnouncement"
          >
            更新
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { definePage } from 'vue-router/auto'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import UserRole from '@/enums/UserRole'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

definePage({
  meta: {
    title: '公告詳情',
    login: true
  }
})

const route = useRoute()
const router = useRouter()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const announcement = ref(null)
const loading = ref(true)
const user = useUserStore()
const { userId, role } = storeToRefs(user)
const showDeleteDialog = ref(false)
const dialog = ref({
  show: false
})
const form = ref(null)
const formValid = ref(false)
const submitting = ref(false)
const formData = ref({
  title: '',
  content: '',
  type: '一般',
  attachments: [],
  expiryDate: null
})
const showExpiryDatePicker = ref(false)

// 公告類型
const announcementTypes = ['置頂', '重要', '活動', '系統', '一般']

// 明天的日期（用於日期選擇器的最小值）
const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

// 類型顏色映射
const typeColors = {
  置頂: 'red',
  重要: 'orange',
  活動: 'green',
  系統: 'blue',
  一般: 'grey'
}

const getTypeColor = (type) => typeColors[type] || 'grey'
const getTypeTextColor = (type) => type === '一般' ? 'black' : 'white'

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化檔案大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 獲取檔案圖示
const getFileIcon = (fileType) => {
  const icons = {
    image: 'mdi-file-image',
    application: 'mdi-file-document',
    text: 'mdi-file-document-outline',
    video: 'mdi-file-video',
    audio: 'mdi-file-music'
  }
  return icons[fileType] || 'mdi-file'
}

// 獲取附件URL
const getAttachmentUrl = (path) => {
  return `${process.env.UPLOAD_URL}/${path}`
}

// 獲取公告詳情
const fetchAnnouncement = async () => {
  loading.value = true
  try {
    const { data } = await apiAuth.get(`/announcement/${route.params.id}`)
    if (data.success) {
      announcement.value = data.result
    } else {
      throw new Error(data.message || '無法載入公告內容')
    }
  } catch (error) {
    console.error('Error fetching announcement:', error)
    createSnackbar({
      text: error?.response?.data?.message || '無法載入公告內容',
      snackbarProps: { color: 'error' }
    })
  } finally {
    loading.value = false
  }
}

// 判斷是否可以管理公告
const canManageAnnouncement = computed(() => {
  if (!role.value) return false
  // 如果是超級管理員或管理員，可以管理所有公告
  if ([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(Number(role.value))) {
    // 如果是管理員，可以管理所有公告
    if ([UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(Number(role.value))) return true
    // 如果是經理，只能管理自己發布的公告
    if (UserRole.MANAGER === Number(role.value)) {
      return announcement.value?.author?._id === userId.value
    }
  }
  // 其他人只能管理自己發布的公告
  return announcement.value?.author?._id === userId.value
})

// 驗規
const titleRules = [
  v => !!v || '請輸入標題',
  v => (v && v.length <= 100) || '標題不能超過100個字'
]

const attachmentRules = [
  files => !files || !files.length || files.length <= 10 || '最多只能上傳10個檔案',
  files => !files || !files.some(file => file.size > 10 * 1024 * 1024) || '檔案大小不能超過10MB'
]

// 修改 openDialog 函數
const openDialog = () => {
  formData.value = {
    title: announcement.value.title,
    content: announcement.value.content,
    type: announcement.value.type,
    attachments: [],
    expiryDate: announcement.value.expiryDate
  }
  showExpiryDatePicker.value = !!announcement.value.expiryDate
  dialog.value.show = true
}

const closeDialog = () => {
  dialog.value.show = false
  if (form.value) {
    form.value.reset()
  }
}

const submitAnnouncement = async () => {
  if (!formValid.value) return
  submitting.value = true
  try {
    const { data } = await apiAuth.patch(`/announcement/${route.params.id}`, formData.value)
    if (data.success) {
      createSnackbar({
        text: '公告編輯成功',
        snackbarProps: { color: 'success' }
      })
      dialog.value.show = false
      fetchAnnouncement() // 重新載入公告內容
    }
  } catch (error) {
    console.error('編輯公告失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '編輯失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    submitting.value = false
  }
}

// 確認刪除
const confirmDelete = () => {
  showDeleteDialog.value = true
}

// 刪除公告
const deleteAnnouncement = async () => {
  try {
    const { data } = await apiAuth.delete(`/announcement/${route.params.id}`)
    if (data.success) {
      createSnackbar({
        text: '公告刪除成功',
        snackbarProps: { color: 'success' }
      })
      router.push('/announcement')
    }
  } catch (error) {
    console.error('刪除公告失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    showDeleteDialog.value = false
  }
}

onMounted(() => {
  fetchAnnouncement()
})
</script>

<style lang="scss" scoped>
.announcement-content {
  font-size: 16px;
  line-height: 1.6;
}

.announcement-content img {
  max-width: 100%;
  height: auto;
  margin: 16px 0;
}

.announcement-content p {
  margin-bottom: 16px;
}

.announcement-content ul,
.announcement-content ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

.announcement-content blockquote {
  border-left: 4px solid #e0e0e0;
  margin: 16px 0;
  padding: 8px 16px;
  background-color: #f5f5f5;
}
</style>

<route lang="yaml">
name: announcement-id
path: '/announcement/:id'
layout: false
</route>
