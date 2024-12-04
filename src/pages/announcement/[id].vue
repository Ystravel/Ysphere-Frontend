`<template>
  <v-container>
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

        <!-- 載入中狀態 -->
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
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const route = useRoute()
const router = useRouter()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const announcement = ref(null)
const loading = ref(true)

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
      text: error?.response?.data?.message || error.message || '無法載入公告內容',
      snackbarProps: { color: 'error' }
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnnouncement()
})
</script>

<style>
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
</style>`
