<template>
  <v-container max-width="1400">
    <v-row
      class="elevation-4 rounded-xl py-8 px-1 px-sm-10 mt-2 mt-sm-6 mx-0 mx-sm-4 mx-md-10 mb-4 bg-white"
    >
      <!-- 頁面標題 -->
      <v-col
        cols="12"
        class="ps-3 pb-6 d-flex align-center"
      >
        <h3>
          IT維修服務管理
        </h3>
        <v-icon
          v-tooltip="'此頁面管理所有IT維修請求'"
          icon="mdi-information"
          size="small"
          color="grey-darken-2"
          class="ms-4"
        />
      </v-col>

      <!-- 操作按鈕和搜索欄 -->
      <v-col cols="12">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn
                  prepend-icon="mdi-plus"
                  color="blue-grey-darken-2"
                  variant="outlined"
                  @click="openDialog(null)"
                >
                  新增維修請求
                </v-btn>
              </v-col>
              <v-col
                cols="6"
                sm="3"
                lg="2"
                class="d-flex justify-end"
              >
                <v-text-field
                  v-model="searchText"
                  label="搜尋"
                  append-inner-icon="mdi-magnify"
                  base-color="#666"
                  color="blue-grey-darken-3"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @input="performSearch"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <!-- 表格區域 -->
      <v-col cols="12">
        <v-data-table-server
          v-model:items-per-page="tableItemsPerPage"
          v-model:sort-by="tableSortBy"
          v-model:page="tablePage"
          :headers="headers"
          :items="tickets"
          :loading="loading"
          :items-length="totalTickets"
          :items-per-page-options="[10, 20, 50]"
          :header-props="headerProps"
          hover
          density="compact"
          class="rounded-ts-lg rounded-te-lg py-3"
          @update:options="fetchTickets"
        >
          <!-- 自定義列渲染 -->
          <template #[`item.status`]="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template #[`item.priority`]="{ item }">
            <v-chip
              :color="getPriorityColor(item.priority)"
              size="small"
            >
              {{ item.priority }}
            </v-chip>
          </template>

          <template #[`item.attachments`]="{ item }">
            <v-icon
              v-if="item.attachments && item.attachments.length"
              icon="mdi-image-multiple"
              color="blue-grey"
            />
            <span
              v-if="item.attachments && item.attachments.length"
              class="ms-1"
            >
              * {{ item.attachments.length }}
            </span>
          </template>

          <template #[`item.actions`]="{ item }">
            <v-row class="d-flex justify-center my-1">
              <v-col
                cols="6"
                sm="4"
                md="3"
                lg="2"
                class="pa-0 mx-1"
              >
                <v-btn
                  icon
                  color="light-blue-darken-4"
                  variant="plain"
                  width="28"
                  height="32"
                  :size="buttonSize"
                  :ripple="false"
                  @click="openDialog(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
              <v-col
                cols="6"
                sm="4"
                md="3"
                lg="2"
                class="pa-0 mx-1"
              >
                <v-btn
                  icon
                  color="red-lighten-1"
                  variant="plain"
                  width="28"
                  height="32"
                  :size="buttonSize"
                  :ripple="false"
                  @click="confirmDelete(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
    <!-- 新增/編輯對話框 -->
    <!-- 新增/編輯對話框 -->
    <v-dialog
      v-model="dialog.open"
      persistent
      max-width="800px"
    >
      <v-card>
        <v-card-title class="text-h6 pa-4">
          {{ dialog.id ? '編輯維修請求' : '新增維修請求' }}
        </v-card-title>
        <v-form
          :disabled="isSubmitting"
          @submit.prevent="submit"
        >
          <v-card-text class="pa-4">
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="title.value.value"
                  :error-messages="title.errorMessage.value"
                  label="標題"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  v-model="category.value.value"
                  :error-messages="category.errorMessage.value"
                  :items="categories"
                  label="類別"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  v-model="priority.value.value"
                  :error-messages="priority.errorMessage.value"
                  :items="priorities"
                  label="優先程度"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="location.value.value"
                  :error-messages="location.errorMessage.value"
                  label="地點"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="description.value.value"
                  :error-messages="description.errorMessage.value"
                  label="描述"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>

              <!-- 圖片顯示和上傳區域 -->
              <v-col
                v-if="attachments.length > 0"
                cols="12"
              >
                <v-card flat>
                  <v-card-title class="text-subtitle-1 ps-0">
                    現有圖片
                  </v-card-title>
                  <v-row class="ma-0">
                    <v-col
                      v-for="(attachment, index) in attachments"
                      :key="attachment.publicId"
                      cols="6"
                      sm="4"
                      md="3"
                      class="pa-2"
                    >
                      <v-card class="position-relative">
                        <v-img
                          :src="attachment.url"
                          aspect-ratio="1"
                          cover
                        />
                        <v-btn
                          icon="mdi-close"
                          size="small"
                          color="error"
                          variant="tonal"
                          class="position-absolute top-0 right-0 ma-1"
                          @click="removeImage(index)"
                        />
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="uploadedFiles"
                  label="上傳圖片"
                  variant="outlined"
                  density="comfortable"
                  multiple
                  accept="image/*"
                  show-size
                  :rules="[
                    files => !files || files.length <= 5 || '最多只能上傳5張圖片',
                    files => !files || !files.some(file => file.size > 5000000) || '圖片大小不能超過5MB'
                  ]"
                  prepend-icon="mdi-camera"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn
              color="grey"
              variant="outlined"
              @click="closeDialog"
            >
              取消
            </v-btn>
            <v-btn
              type="submit"
              color="teal-darken-1"
              class="ms-2"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              確定
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <ConfirmDeleteDialog
      v-model="confirmDialog"
      :title="'確認刪除維修請求'"
      :message="`確定要刪除維修請求 ${ticketToDelete?.ticketId || ''} 嗎？此操作無法恢復。`"
      confirm-button-text="確認刪除"
      confirm-button-color="error"
      @confirm="handleDeleteConfirm"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useDisplay } from 'vuetify'

import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const { smAndUp } = useDisplay()

const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})
const headerProps = {
  class: 'header-bg'
}

// 其他狀態
const attachments = ref([])
// 控制確認對話框的狀態
const confirmDialog = ref(false)
const ticketToDelete = ref(null)
const originalAttachments = ref([]) // 保存原始圖片列表
const tempDeletedImages = ref([]) // 保存準備要刪除的圖片 ID
const tempAddedFiles = ref([]) // 保存準備要新增的圖片

// 修改刪除確認方法
const confirmDelete = (ticket) => {
  ticketToDelete.value = ticket
  confirmDialog.value = true
}
// 表格相關
const headers = [
  { title: '編號', align: 'start', key: 'ticketId', sortable: true },
  { title: '標題', align: 'start', key: 'title', sortable: true },
  { title: '類別', align: 'start', key: 'category', sortable: true },
  { title: '優先程度', align: 'start', key: 'priority', sortable: true },
  { title: '狀態', align: 'start', key: 'status', sortable: true },
  { title: '地點', align: 'start', key: 'location', sortable: true },
  { title: '附件', align: 'start', key: 'attachments', sortable: false },
  {
    title: '操作',
    align: 'center',
    key: 'actions',
    sortable: false,
    render: (item) => item.status === '待處理' ? 'mdi-pencil' : ''
  }
]

const tableItemsPerPage = ref(10)
const tablePage = ref(1)
const tableSortBy = ref([])
const tickets = ref([])
const totalTickets = ref(0)
const loading = ref(false)
const searchText = ref('')

// 下拉選項
const categories = ['硬體問題', '軟體問題', '網路問題', '帳號權限', '其他']
const priorities = ['低', '中', '高', '緊急']

// 表單相關
const dialog = ref({
  open: false,
  id: ''
})

const form = ref({
  title: '',
  category: '',
  priority: '中',
  location: '',
  description: '',
  attachments: []
})

const uploadedFiles = ref([])

// 狀態和優先級顏色
const getStatusColor = (status) => {
  const colors = {
    待處理: 'grey',
    處理中: 'blue',
    待確認: 'orange',
    已完成: 'green',
    已取消: 'red'
  }
  return colors[status] || 'grey'
}

const getPriorityColor = (priority) => {
  const colors = {
    低: 'green',
    中: 'blue',
    高: 'orange',
    緊急: 'red'
  }
  return colors[priority] || 'grey'
}

// 獲取維修請求列表
const fetchTickets = async () => {
  loading.value = true
  try {
    const { data } = await apiAuth.get('/serviceTicket/my-tickets', {
      params: {
        page: tablePage.value,
        limit: tableItemsPerPage.value,
        sort: tableSortBy.value.length ? `${tableSortBy.value[0].order === 'desc' ? '-' : ''}${tableSortBy.value[0].key}` : '-createdAt',
        search: searchText.value
      }
    })
    tickets.value = data.result.data
    totalTickets.value = data.result.total
  } catch (error) {
    console.error('獲取維修請求失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '獲取維修請求失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    loading.value = false
  }
}
// 搜尋
const performSearch = () => {
  tablePage.value = 1
  fetchTickets()
}

const openDialog = (ticket) => {
  if (ticket) {
    dialog.value.id = ticket._id
    if (ticket.status !== '待處理') {
      createSnackbar({
        text: '只能編輯待處理狀態的維修請求',
        snackbarProps: { color: 'error' }
      })
      return
    }

    // 初始化表單字段
    title.value.value = ticket.title || ''
    category.value.value = ticket.category || ''
    priority.value.value = ticket.priority || ''
    location.value.value = ticket.location || ''
    description.value.value = ticket.description || ''

    // 初始化圖片列表
    console.log('從後端獲取的 attachments:', ticket.attachments) // 確認數據結構
    const formattedAttachments = (ticket.attachments || []).map((att) => {
      if (!att.publicId) {
        console.warn('缺少 publicId 的附件:', att) // 檢查 publicId 是否存在
      }
      return {
        url: att.url || '',
        publicId: att.publicId || null, // 確保至少有 `null` 作為占位
        isExisting: true // 標記為現有圖片
      }
    })

    attachments.value = formattedAttachments
    originalAttachments.value = [...formattedAttachments]
    console.log('格式化後的 attachments:', attachments.value)
  } else {
    // 新增維修請求的情況
    dialog.value.id = null
    resetForm()
    attachments.value = []
    originalAttachments.value = []
  }

  // 重置圖片相關的臨時狀態
  tempDeletedImages.value = []
  uploadedFiles.value = []
  dialog.value.open = true
}

const closeDialog = () => {
  dialog.value.open = false
  resetForm()
  // 清空所有圖片相關的狀態
  uploadedFiles.value = []
  attachments.value = []
  tempDeletedImages.value = []
  tempAddedFiles.value = []
  originalAttachments.value = []
}

// 處理確認刪除
const handleDeleteConfirm = async () => {
  try {
    await apiAuth.delete(`/serviceTicket/${ticketToDelete.value._id}`)
    createSnackbar({
      text: '維修請求刪除成功',
      snackbarProps: { color: 'success' }
    })
    fetchTickets() // 刷新請求列表
    confirmDialog.value = false
  } catch (error) {
    console.error('刪除維修請求失敗:', error)
    createSnackbar({
      text: error.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'error' }
    })
  }
}

// 移除圖片
const removeImage = (index) => {
  if (index >= 0 && index < attachments.value.length) {
    const removedAttachment = attachments.value.splice(index, 1)[0]
    if (removedAttachment?.publicId) {
      console.log('刪除圖片 Public ID:', removedAttachment.publicId)
      // 確保存儲完整的 publicId
      const fullPublicId = removedAttachment.publicId.includes('tickets/')
        ? removedAttachment.publicId
        : `tickets/${removedAttachment.publicId}`
      tempDeletedImages.value.push(fullPublicId)
    } else {
      console.error('刪除圖片時 publicId 不存在:', removedAttachment)
    }
  } else {
    console.error('索引無效，無法刪除圖片:', index)
  }
}
const ticketSchema = yup.object({
  title: yup
    .string()
    .required('請輸入標題'),
  category: yup
    .string()
    .required('請選擇類別')
    .oneOf(['硬體問題', '軟體問題', '網路問題', '帳號權限', '其他'], '請選擇有效的類別'),
  priority: yup
    .string()
    .default('中')
    .oneOf(['低', '中', '高', '緊急'], '請選擇有效的優先程度'),
  location: yup
    .string()
    .required('請輸入地點'),
  description: yup
    .string()
    .required('請輸入描述')
})

// 使用 vee-validate 設置表單
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: ticketSchema,
  initialValues: {
    title: '',
    category: '',
    priority: '中',
    location: '',
    description: ''
  }
})

// 表單欄位定義
const title = useField('title')
const category = useField('category')
const priority = useField('priority')
const location = useField('location')
const description = useField('description')

const submit = handleSubmit(async (values) => {
  try {
    if (dialog.value.id) {
      // 更新維修請求基本資料
      await apiAuth.patch(`/serviceTicket/${dialog.value.id}/edit`, values)

      // 刪除圖片
      if (tempDeletedImages.value.length > 0) {
        await Promise.all(
          tempDeletedImages.value.map(async publicId => {
            // 從完整路徑中取出後面部分
            const shortPublicId = publicId.split('tickets/')[1]
            return apiAuth.delete(`/serviceTicket/${dialog.value.id}/images/${shortPublicId}`)
          })
        )
      }

      // 新增圖片
      if (uploadedFiles.value.length > 0) {
        const formData = new FormData()
        uploadedFiles.value.forEach(file => formData.append('images', file))
        await apiAuth.post(`/serviceTicket/${dialog.value.id}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
    } else {
      // 創建新請求時處理圖片
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('category', values.category)
      formData.append('priority', values.priority)
      formData.append('location', values.location)
      formData.append('description', values.description)

      if (uploadedFiles.value.length > 0) {
        uploadedFiles.value.forEach(file => formData.append('images', file))
      }

      await apiAuth.post('/serviceTicket', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }

    createSnackbar({ text: '操作成功', snackbarProps: { color: 'success' } })
    closeDialog()
    fetchTickets()
  } catch (error) {
    console.error('提交失敗:', error)
    createSnackbar({
      text: error.response?.data?.message || '操作失敗',
      snackbarProps: { color: 'error' }
    })
  }
})
// 檢查檔案限制
const validateFiles = (files) => {
  if (!files) return true

  // 檢查總數量限制（包括已有的圖片）
  const totalImages = (dialog.value.id ? attachments.value.filter(att => !att.isNew).length : 0) + files.length
  if (totalImages > 5) {
    createSnackbar({
      text: '最多只能上傳5張圖片',
      snackbarProps: { color: 'warning' }
    })
    return false
  }

  // 檢查每個檔案的大小限制
  const tooLarge = files.some(file => file.size > 5 * 1024 * 1024) // 5MB
  if (tooLarge) {
    createSnackbar({
      text: '圖片大小不能超過5MB',
      snackbarProps: { color: 'warning' }
    })
    return false
  }

  return true
}

// 監聽檔案上傳
watch(uploadedFiles, (newFiles) => {
  if (!validateFiles(newFiles)) {
    uploadedFiles.value = []
    return
  }

  // 建立新上傳文件的預覽
  const newAttachments = newFiles.map(file => ({
    url: URL.createObjectURL(file),
    publicId: file.name,
    isExisting: false // 標記為新上傳的圖片
  }))

  console.log('新上傳的圖片:', newAttachments)

  // 更新顯示列表：保留未刪除的現有圖片 + 新上傳的圖片
  attachments.value = [
    // 保留現有且未被刪除的圖片
    ...originalAttachments.value.filter(att => !tempDeletedImages.value.includes(att.publicId)),
    // 添加新上傳的圖片
    ...newAttachments
  ]

  console.log('更新後的圖片列表:', attachments.value)
})

// 生命週期鉤子
onMounted(() => {
  fetchTickets()
})

// 檢查是否有保存的 Dialog 狀態
onMounted(() => {
  const savedState = localStorage.getItem('itServiceDialogState')
  if (savedState) {
    const { form: savedForm, dialogId } = JSON.parse(savedState)
    form.value = savedForm
    dialog.value.id = dialogId
    dialog.value.open = true
  }
})

// 在組件銷毀時清除保存的狀態
onUnmounted(() => {
  localStorage.removeItem('itServiceDialogState')
})

</script>

<style lang="scss" scoped>
@import '/src/styles/settings.scss';

// 修改表格樣式
:deep(.header-bg) {
  background-color: #455A64 !important;
  color: white !important;
}

:deep(.v-data-table) {
  .v-data-table__tr:nth-child(odd) {
    background-color: #fffffd;
  }
  .v-data-table__tr:nth-child(even) {
    background-color: rgb(247, 253, 255);
  }
}

// 調整按鈕樣式 (保持不變)
.v-btn {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
}
</style>
