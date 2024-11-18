<template>
  <v-container max-width="2200">
    <v-row
      class="elevation-4 rounded-xl py-4 py-sm-8 px-1 px-sm-10 mt-2 mt-sm-6 mx-0 mx-sm-4 mx-md-10 mb-4 bg-white"
    >
      <!-- 頁面標題 -->
      <v-col
        cols="12"
        class="ps-3 pb-6 d-flex align-center"
      >
        <h3>
          IT維修服務
        </h3>
        <v-btn
          v-if="smAndUp"
          size="x-small"
          color="grey-darken-1"
          class="ms-4"
          elevation="1"
          @click="priorityInfoDialog = true"
        >
          使用說明
        </v-btn>
      </v-col>

      <!-- 操作按鈕和搜索欄 -->
      <v-col cols="12">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn
                  prepend-icon="mdi-wrench-outline"
                  color="blue-grey-darken-2"
                  variant="outlined"
                  @click="openDialog(null)"
                >
                  我要報修
                </v-btn>
              </v-col>
              <v-col
                cols="6"
                md="4"
                lg="3"
                xl="2"
                class="d-flex justify-end align-center"
              >
                <v-icon
                  v-if="smAndUp"
                  v-tooltip:start="'可搜尋維修編號、標題、地點、描述'"
                  icon="mdi-information"
                  size="small"
                  color="blue-grey-darken-2"
                  class="me-4"
                />
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
          :headers="filteredHeaders"
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
              variant="outlined"
              size="small"
              label
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template #[`item.priority`]="{ item }">
            <v-chip
              :color="getPriorityColor(item.priority)"
              size="small"
              variant="outlined"
            >
              {{ item.priority }}
            </v-chip>
          </template>

          <template #[`item.attachments`]="{ item }">
            <template v-if="item.attachments && item.attachments.length">
              <v-icon
                icon="mdi-image-multiple"
                color="blue-grey"
              />
              <span class="ms-1">
                * {{ item.attachments.length }}
              </span>
            </template>
            <span v-else>無</span>
          </template>

          <template #[`item.actions`]="{ item }">
            <v-row class="d-flex justify-center my-1">
              <v-col
                cols="6"
                sm="4"
                md="3"
                lg="2"
                class="py-0 px-0 px-md-4"
              >
                <v-btn
                  icon
                  color="light-blue-darken-4"
                  variant="plain"
                  width="28"
                  height="32"
                  :size="buttonSize"
                  :ripple="false"
                  :disabled="item.status !== '待處理'"
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
                class="py-0 px-0 px-md-4"
              >
                <v-btn
                  icon
                  color="red-lighten-1"
                  variant="plain"
                  width="28"
                  height="32"
                  :size="buttonSize"
                  :ripple="false"
                  :disabled="item.status !== '待處理'"
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
    <v-dialog
      v-model="dialog.open"
      persistent
      max-width="600px"
    >
      <v-card class="rounded-lg px-4 py-6">
        <div class="card-title ps-4 py-3">
          {{ dialog.id ? '編輯維修請求' : '新增維修請求' }}
        </div>
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
                  label="*標題"
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
                  label="*類別"
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
                  label="*優先程度"
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
                  label="*地點"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="description.value.value"
                  :error-messages="description.errorMessage.value"
                  label="*描述"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>

              <!-- 圖片顯示和上傳區域 -->
              <v-col
                v-if="attachments.length > 0"
                cols="12"
                class="pt-0"
              >
                <v-card
                  flat
                  class="py-2 px-4"
                  style="border: 1px solid #a1a1a1;"
                >
                  <div
                    style="font-size: 15px;"
                    class="ps-2"
                  >
                    現有圖片
                  </div>
                  <v-row class="ma-0">
                    <v-col
                      v-for="(attachment, index) in attachments"
                      :key="attachment.publicId"
                      cols="4"
                      md="3"
                      class="pa-2"
                    >
                      <v-card class="position-relative overflow-visible">
                        <v-img
                          :src="attachment.url"
                          aspect-ratio="1"
                          cover
                        />
                        <v-btn
                          icon
                          size="x-small"
                          elevation="4"
                          class="position-absolute"
                          style="top: -6px; right: -6px;"
                          @click="removeImage(index)"
                        >
                          <v-icon
                            icon="mdi-close"
                            color="red-darken-2"
                          />
                        </v-btn>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="uploadedFiles"
                  v-tooltip:top="'最多4張，每張圖片大小不超過2MB。請一次選擇所有需上傳圖片。'"
                  label="上傳圖片(僅限 JPG、PNG、WEBP格式)"
                  variant="underlined"
                  multiple
                  accept="image/*"
                  show-size
                  :rules="[
                    files => !files || files.length <= 4 || '最多只能上傳4張圖片',
                    files => !files || !files.some(file => file.size > 2000000) || '圖片大小不能超過2MB'
                  ]"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn
              color="red-lighten-1"
              variant="outlined"
              :size="buttonSize"
              @click="closeDialog"
            >
              取消
            </v-btn>
            <v-btn
              type="submit"
              color="teal-darken-1"
              class="ms-2"
              variant="outlined"
              :size="buttonSize"
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
      :title="'確認刪除'"
      :message="`確定要刪除 ${ticketToDelete?.ticketId || ''} 嗎？此操作無法恢復。`"
      confirm-button-text="確認"
      confirm-button-color="error"
      @confirm="handleDeleteConfirm"
    />
    <v-dialog
      v-model="priorityInfoDialog"
      max-width="500"
    >
      <v-card class="pa-4">
        <div class="card-title ps-4 py-3">
          維修服務相關說明
        </div>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12">
              <div class="d-flex flex-column gap-4">
                <div style="line-height: 2; font-size: 14px;">
                  (1) <span style="font-size: 15px; font-weight: 600;">狀態</span> : <br>僅限狀態為<v-chip
                    color="grey-darken-1"
                    size="small"
                    variant="outlined"
                    label
                    class="mx-2"
                  >
                    待處理
                  </v-chip>時，才能使用「編輯 <v-icon
                    icon="mdi-pencil"
                    size="small"
                    color="light-blue-darken-4"
                  />」及「刪除<v-icon
                    icon="mdi-delete"
                    size="small"
                    color="red-lighten-1"
                  />」功能。
                </div>
                <div
                  style="line-height: 2; font-size: 14px;"
                  class="mb-2"
                >
                  (2) <span style="font-size: 15px; font-weight: 600;">優先度</span> :
                </div>
                <div>
                  <v-chip
                    color="red"
                    size="small"
                    variant="outlined"
                    class="mb-2"
                  >
                    緊急
                  </v-chip>
                  <div class="text-body-1 mt-1">
                    系統完全無法運作或造成重大業務影響，需要立即處理的問題。
                    <br>
                    例如：系統當機、網路完全中斷、資料遺失等。
                  </div>
                </div>
                <v-divider class="my-4" />

                <div>
                  <v-chip
                    color="orange-darken-1"
                    size="small"
                    variant="outlined"
                    class="mb-2"
                  >
                    高
                  </v-chip>
                  <div class="text-body-1 mt-1">
                    影響工作進行但有暫時替代方案，需要優先處理的問題。
                    <br>
                    例如：系統緩慢、部分功能異常、列印設備故障等。
                  </div>
                </div>
                <v-divider class="my-4" />

                <div>
                  <v-chip
                    color="blue"
                    size="small"
                    variant="outlined"
                    class="mb-2"
                  >
                    中
                  </v-chip>
                  <div class="text-body-1 mt-1">
                    造成不便但不影響主要工作，可以排程處理的問題。
                    <br>
                    例如：軟體安裝、設備維護、功能諮詢等。
                  </div>
                </div>
                <v-divider class="my-4" />

                <div>
                  <v-chip
                    color="green"
                    size="small"
                    variant="outlined"
                    class="mb-2"
                  >
                    低
                  </v-chip>
                  <div class="text-body-1 mt-1">
                    一般性問題或建議，可以安排在較空閒時處理。
                    <br>
                    例如：新功能建議、系統優化、預防性維護等。
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            :size="buttonSize"
            @click="priorityInfoDialog = false"
          >
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { definePage } from 'vue-router/auto'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useDisplay } from 'vuetify'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'

definePage({
  meta: {
    title: 'IT維修服務 | ysphere',
    login: true
  }
})

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const { smAndUp, mdAndUp, lgAndUp, xlAndUp } = useDisplay()

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
const priorityInfoDialog = ref(false)

// 修改刪除確認方法
const confirmDelete = (ticket) => {
  ticketToDelete.value = ticket
  confirmDialog.value = true
}
// 表格相關
const headers = [
  { title: '維修編號', align: 'start', key: 'ticketId', sortable: true },
  { title: '標題', align: 'start', key: 'title', sortable: true },
  { title: '類別', align: 'start', key: 'category', sortable: true },
  { title: '優先度', align: 'start', key: 'priority', sortable: true },
  { title: '狀態', align: 'start', key: 'status', sortable: true },
  { title: '地點', align: 'start', key: 'location', sortable: true },
  { title: '圖片', align: 'start', key: 'attachments', sortable: false },
  { title: '描述', align: 'start', key: 'description', sortable: false },
  {
    title: '操作',
    align: 'center',
    key: 'actions',
    sortable: false,
    render: (item) => item.status === '待處理' ? 'mdi-pencil' : ''
  }
]

// 響應式表頭
const filteredHeaders = computed(() => {
  // 最大尺寸顯示全部
  if (xlAndUp.value) {
    return headers
  }

  // lg 移除附件欄位
  if (lgAndUp.value) {
    return headers.filter(header => header.key !== 'attachments')
  }

  // md 移除類別和狀態欄位
  if (mdAndUp.value) {
    return headers.filter(header =>
      !['attachments', 'category', 'priority'].includes(header.key)
    )
  }

  // sm 以下只保留維修編號、標題和操作
  return headers.filter(header =>
    ['ticketId', 'title', 'status', 'actions'].includes(header.key)
  )
})
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
    待處理: 'grey-darken-1',
    處理中: 'blue',
    待確認: 'orange-darken-1',
    已完成: 'green',
    已取消: 'red'
  }
  return colors[status] || 'grey'
}

const getPriorityColor = (priority) => {
  const colors = {
    低: 'green',
    中: 'blue',
    高: 'orange-darken-1',
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
        text: '只能編輯或刪除"待處理"狀態的維修請求',
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
    console.log('要移除的附件:', removedAttachment)

    if (removedAttachment?.publicId) {
      // 檢查這個 publicId 是否已經在待刪除列表中
      const fullPublicId = removedAttachment.publicId.includes('tickets/')
        ? removedAttachment.publicId
        : `tickets/${removedAttachment.publicId}`

      console.log('待刪除的 fullPublicId:', fullPublicId)
      console.log('當前的 tempDeletedImages:', tempDeletedImages.value)

      // 確保不重複添加
      if (!tempDeletedImages.value.includes(fullPublicId)) {
        tempDeletedImages.value.push(fullPublicId)
        console.log('更新後的 tempDeletedImages:', tempDeletedImages.value)
      }
    }
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
      // 1. 先執行圖片刪除操作
      if (tempDeletedImages.value.length > 0) {
        console.log('正在刪除圖片，數量:', tempDeletedImages.value.length)
        const deletePromises = tempDeletedImages.value.map(publicId => {
          const shortPublicId = publicId.split('tickets/')[1]
          console.log(`準備刪除圖片: ${shortPublicId}`)
          return apiAuth.delete(`/serviceTicket/${dialog.value.id}/images/${shortPublicId}`)
        })

        // 等待所有刪除操作完成
        await Promise.all(deletePromises)
        // 確保刪除操作完全完成後再繼續
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // 2. 更新基本資料
      console.log('正在更新請求基本資料')
      await apiAuth.patch(`/serviceTicket/${dialog.value.id}/edit`, values)

      // 3. 最後處理新上傳的圖片
      if (uploadedFiles.value.length > 0) {
        console.log('正在上傳新圖片，數量:', uploadedFiles.value.length)
        const formData = new FormData()
        uploadedFiles.value.forEach(file => formData.append('images', file))
        await apiAuth.post(`/serviceTicket/${dialog.value.id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
    } else {
      // 創建新請求
      console.log('正在創建新維修請求')
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('category', values.category)
      formData.append('priority', values.priority)
      formData.append('location', values.location)
      formData.append('description', values.description)

      if (uploadedFiles.value.length > 0) {
        console.log('附加上傳圖片到新請求，數量:', uploadedFiles.value.length)
        uploadedFiles.value.forEach(file => formData.append('images', file))
      }

      await apiAuth.post('/serviceTicket', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    createSnackbar({
      text: `維修請求${dialog.value.id ? '更新' : '建立'}成功`,
      snackbarProps: { color: 'teal-lighten-1' }
    })
    closeDialog()
    fetchTickets()
  } catch (error) {
    console.error('提交失敗:', error)
    console.error('錯誤詳情:', error.response?.data)
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
  if (totalImages > 4) {
    createSnackbar({
      text: '最多只能上傳4張圖片',
      snackbarProps: { color: 'warning' }
    })
    return false
  }

  // 檢查每個檔案的大小限制
  const tooLarge = files.some(file => file.size > 2 * 1024 * 1024) // 2MB
  if (tooLarge) {
    createSnackbar({
      text: '圖片大小不能超過2MB',
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
  // 修改過濾條件，使用 find 檢查完整的 publicId
    ...originalAttachments.value.filter(att => {
      const fullPublicId = att.publicId.includes('tickets/')
        ? att.publicId
        : `tickets/${att.publicId}`
      return !tempDeletedImages.value.includes(fullPublicId)
    }),
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

  td.v-data-table__td:nth-last-child(2) {
    max-width: 240px;
    white-space: normal;
    word-wrap: break-word;
    padding: 16px;
  }
}

// 調整按鈕樣式 (保持不變)
.v-btn {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
}

.v-data-table {
  :deep(th):nth-child(2) {
    width: 25%;
  }
  :deep(th):nth-last-child(1) {
    width: 15%;
  }
}

.text-body-1 {
  line-height: 1.5;
  color: #424242;
  font-size: 14px !important;
}

@include sm {
  .v-data-table {
    :deep(th):nth-child(2) {
      width: auto;
    }
    :deep(th):nth-last-child(1) {
    width: auto;
  }
  }
}

</style>
