<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-container max-width="2000">
    <template v-if="user.token">
      <v-row class="elevation-4 rounded-lg py-4 py-sm-8 px-1 px-sm-10 mt-2 mt-sm-6 mx-0 mx-sm-4 mx-md-10 mb-4 bg-white">
        <!-- 頁面標題區 -->
        <v-col
          cols="12"
          class="ps-3 d-flex justify-space-between align-center"
        >
          <div class="d-flex align-center">
            <h3>所有公告</h3>
            <v-btn
              size="x-small"
              color="grey-darken-1"
              class="ms-4"
              elevation="1"
              @click="showGuide = true"
            >
              使用說明
            </v-btn>
          </div>
          <v-btn
            v-if="canManageAnnouncements"
            prepend-icon="mdi-plus"
            color="blue-grey-darken-2"
            variant="outlined"
            @click="openDialog(null)"
          >
            新增公告
          </v-btn>
        </v-col>

        <!-- 分類標籤和搜尋區 -->
        <v-col cols="12">
          <v-row
            align="center"
            class="py-4"
          >
            <v-col
              cols="12"
              md="8"
            >
              <v-tabs
                v-model="currentTab"
                color="blue-grey-darken-2"
                align-tabs="start"
              >
                <v-tab value="all">
                  全部
                </v-tab>
                <v-tab
                  v-for="type in announcementTypes"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </v-tab>
              </v-tabs>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="searchText"
                label="搜尋公告"
                append-inner-icon="mdi-magnify"
                density="comfortable"
                variant="outlined"
                hide-details
              />
            </v-col>
          </v-row>
        </v-col>

        <!-- 公告列表區域 -->
        <v-col cols="12">
          <v-window v-model="currentTab">
            <!-- 全部公告 -->
            <v-window-item value="all">
              <announcement-list
                :announcements="filteredAnnouncements"
                :loading="loading"
                @view="viewAnnouncement"
                @edit="openDialog"
                @delete="confirmDelete"
              />
            </v-window-item>

            <!-- 分類公告 -->
            <v-window-item
              v-for="type in announcementTypes"
              :key="type"
              :value="type"
            >
              <announcement-list
                :announcements="getAnnouncementsByType(type)"
                :loading="loading"
                @view="viewAnnouncement"
                @edit="openDialog"
                @delete="confirmDelete"
              />
            </v-window-item>
          </v-window>

          <!-- 分頁控制 -->
          <div class="d-flex justify-center mt-6">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="7"
            />
          </div>
        </v-col>
      </v-row>

      <!-- 新增/編輯公告對話框 -->
      <v-dialog
        v-model="dialog.show"
        persistent
        max-width="900px"
      >
        <v-card class="pa-4">
          <v-card-title class="text-h5 pb-4">
            {{ dialog.id ? '編輯公告' : '新增公告' }}
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
                  <!-- 使用 Quill 編輯器 -->
                  <div class="text-subtitle-1 mb-2">
                    公告內容
                  </div>
                  <quill-editor
                    v-model:content="formData.content"
                    content-type="html"
                    :toolbar="editorToolbar"
                    :editor-config="editorConfig"
                    theme="snow"
                  />
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="formData.attachments"
                    label="附件上傳"
                    multiple
                    show-size
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    :rules="attachmentRules"
                  />
                </v-col>
                <v-col
                  cols="12"
                >
                  <!-- 修改 checkbox 綁定值為一個控制顯示的布林值 -->
                  <v-checkbox
                    v-model="showDeleteDatePicker"
                    label="設定自動下架時間"
                  />

                  <!-- 當 checkbox 被勾選時才顯示日期選擇器 -->
                  <v-date-picker
                    v-if="showDeleteDatePicker"
                    v-model="formData.deleteDate"
                    class="mt-2"
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
              @click="submitAnnouncement"
            >
              確認
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 使用說明對話框 -->
      <v-dialog
        v-model="showGuide"
        max-width="600px"
      >
        <v-card class="pa-4">
          <v-card-title class="text-h5">
            公告系統使用說明
          </v-card-title>
          <v-card-text class="pt-4">
            <v-list>
              <v-list-item
                v-for="(item, i) in guideItems"
                :key="i"
                :prepend-icon="item.icon"
              >
                <v-list-item-title v-html="item.title" />
                <v-list-item-subtitle
                  class="mt-1"
                  v-html="item.content"
                />
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              variant="text"
              @click="showGuide = false"
            >
              關閉
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 確認刪除對話框 -->
      <ConfirmDeleteDialog
        v-model="confirmDialog.show"
        :title="'確認刪除公告'"
        :message="'確定要刪除此公告嗎？此操作無法復原。'"
        @confirm="deleteAnnouncement"
      />
    </template>
    <div
      v-else
      class="d-flex justify-center align-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { definePage } from 'vue-router/auto'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useUserStore } from '@/stores/user'
import UserRole from '@/enums/UserRole'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'
import AnnouncementList from '@/components/AnnouncementList.vue'

definePage({
  meta: {
    title: '所有公告 | ysphere',
    login: true
  }
})

// 路由配置
const router = useRouter()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const user = useUserStore()

// 基礎資料
const announcementTypes = ['置頂', '重要', '活動', '系統', '一般']
const currentTab = ref('all')
const searchText = ref('')
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const announcements = ref([])
const formValid = ref(false)
const submitting = ref(false)
const departments = ref([])
const showDeleteDatePicker = ref(false)

// 計算屬性
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const canManageAnnouncements = computed(() => {
  return user.role >= UserRole.ADMIN || false
})

const loadDepartments = async () => {
  try {
    const { data } = await apiAuth.get('/department/all')
    if (data.success) {
      // Ensure departments.value is an array
      departments.value = Array.isArray(data.result) ? data.result : data.result.data
    }
  } catch (error) {
    console.error('載入部門失敗:', error)
    createSnackbar({
      text: '載入部門資料失敗',
      snackbarProps: { color: 'error' }
    })
  }
}

// 篩選公告
const filteredAnnouncements = computed(() => {
  let filtered = announcements.value
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(search) ||
      a.content.toLowerCase().includes(search)
    )
  }
  return filtered
})

const getAnnouncementsByType = (type) => {
  return announcements.value.filter(a => a.type === type)
}

// 表單相關
const dialog = ref({
  show: false,
  id: null
})

const formData = ref({
  title: '',
  type: '一般',
  content: '',
  attachments: [],
  deleteDate: undefined // 改為 undefined
})

const editorToolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ color: [] }, { background: [] }],
  ['link'],
  ['clean']
]

const editorConfig = {
  placeholder: '請輸入公告內容...',
  modules: {
    toolbar: editorToolbar
  }
}

// 驗證規則
const titleRules = [
  v => !!v || '請輸入公告標題',
  v => v.length <= 100 || '標題不可超過100字'
]

const attachmentRules = [
  files => !files || files.length <= 10 || '最多只能上傳10個附件',
  files => !files || !files.some(f => f.size > 10 * 1024 * 1024) || '單個檔案不可超過10MB'
]

// 操作方法
const fetchAnnouncements = async () => {
  loading.value = true
  try {
    if (!user.token) {
      console.warn('User not loaded yet')
      return
    }

    // 修改這裡，確保每個參數都有值
    const params = {
      page: currentPage.value || 1,
      limit: itemsPerPage.value || 10,
      search: searchText.value || '', // 確保 search 不會是 undefined
      ...(currentTab.value !== 'all' ? { type: currentTab.value } : {}) // 只在需要時添加 type 參數
    }

    console.log('Fetching with params:', params) // 用於除錯

    const { data } = await apiAuth.get('/announcement/all', { params })

    if (data.success) { // 確保後端返回成功
      announcements.value = data.result.data
      totalItems.value = data.result.total
    } else {
      throw new Error(data.message || '獲取公告失敗')
    }
  } catch (error) {
    console.error('獲取公告失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '獲取公告失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    loading.value = false
  }
}

const openDialog = (announcement = null) => {
  if (announcement) {
    dialog.value.id = announcement._id
    formData.value = {
      title: announcement.title,
      type: announcement.type,
      content: announcement.content,
      attachments: [],
      deleteDate: announcement.deleteDate,
      department: announcement.department?._id || '' // 添加部門
    }
  } else {
    dialog.value.id = null
    formData.value = {
      title: '',
      type: '一般',
      content: '',
      attachments: [],
      deleteDate: null,
      department: '' // 添加部門
    }
  }
  dialog.value.show = true
}

const closeDialog = () => {
  dialog.value.show = false
  dialog.value.id = null
  formData.value = {
    title: '',
    type: '一般',
    content: '',
    attachments: [],
    deleteDate: null,
    department: '' // 添加部門
  }
}

const submitAnnouncement = async () => {
  try {
    const formDataToSend = new FormData()

    Object.entries(formData.value).forEach(([key, value]) => {
      if (key === 'attachments') {
        value.forEach(file => {
          formDataToSend.append('attachments', file)
        })
      } else if (key === 'deleteDate') {
        // 只有當啟用日期選擇且有選擇日期時才發送
        if (showDeleteDatePicker.value && value) {
          formDataToSend.append('deleteDate', value)
        }
      } else {
        formDataToSend.append(key, value)
      }
    })

    if (dialog.value.id) {
      await apiAuth.patch(`/announcement/${dialog.value.id}`, formDataToSend)
    } else {
      await apiAuth.post('/announcement', formDataToSend)
    }

    createSnackbar({
      text: `公告${dialog.value.id ? '更新' : '新增'}成功`,
      snackbarProps: { color: 'success' }
    })
    closeDialog()
    fetchAnnouncements()
  } catch (error) {
    console.error('提交公告失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '操作失敗',
      snackbarProps: { color: 'error' }
    })
  }
}

const confirmDelete = (announcement) => {
  confirmDialog.value = {
    show: true,
    announcement
  }
}

const deleteAnnouncement = async () => {
  try {
    await apiAuth.delete(`/announcement/${confirmDialog.value.announcement._id}`)
    createSnackbar({
      text: '公告刪除成功',
      snackbarProps: { color: 'success' }
    })
    fetchAnnouncements()
  } catch (error) {
    console.error('刪除公告失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    confirmDialog.value.show = false
  }
}

const viewAnnouncement = (announcement) => {
  router.push(`/announcement/${announcement._id}`)
}

// 修改 watch
// 改為分開監聽
watch([currentTab, currentPage], () => {
  if (user.token) {
    fetchAnnouncements()
  }
})

const debouncedQuickSearch = debounce(() => {
  if (user.token) {
    currentPage.value = 1
    fetchAnnouncements()
  }
}, 300)

watch(searchText, () => {
  debouncedQuickSearch()
})

// 使用說明內容
const showGuide = ref(false)
const guideItems = [
  {
    icon: 'mdi-format-list-text',
    title: '公告分類',
    content: '公告分為：置頂、重要、活動、系統、一般五種類型。置頂公告會顯示在最上方。'
  },
  {
    icon: 'mdi-text-search',
    title: '搜尋功能',
    content: '可以透過關鍵字搜尋公告標題和內容。'
  },
  {
    icon: 'mdi-file-upload',
    title: '附件上傳',
    content: '支援圖片、文件等多種格式，單個檔案大小不超過10MB。'
  },
  {
    icon: 'mdi-clock-outline',
    title: '自動下架',
    content: '置頂公告可以設定自動下架時間，到期後會自動變更為一般公告。'
  }
]

// 生命週期鉤子
// 初始化
// 在 onMounted 中載入部門資料

onUnmounted(() => {
  debouncedQuickSearch.cancel()
})

onMounted(async () => {
  if (user.token) {
    await loadDepartments() // 添加這行
    await fetchAnnouncements()
  }
})

const confirmDialog = ref({
  show: false,
  announcement: null
})
</script>

<style lang="scss" scoped>
.ql-editor {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.pinned-notice {
  border-left: 4px solid #FF5252;
}

.v-tabs {
  .v-tab {
    text-transform: none;
  }
}

:deep(.ql-container) {
  font-size: 16px;

  .ql-editor {
    padding: 12px 20px;
  }
}

:deep(.v-card) {
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12) !important;
  }
}
</style>
