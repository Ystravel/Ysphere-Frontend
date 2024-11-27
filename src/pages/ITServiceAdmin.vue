<template>
  <v-container max-width="2200">
    <v-row class="py-0 ma-sm-1 ma-md-2">
      <!-- 搜尋條件區塊 -->
      <v-col
        cols="12"
        lg="3"
      >
        <v-row>
          <v-col
            cols="12"
            class="mt-1 ps-lg-8 pe-lg-12"
          >
            <v-card
              class="elevation-4 rounded-lg py-4 py-sm-8 px-4 px-sm-4 px-xl-8"
            >
              <v-card-title class="font-weight-bold d-flex align-center">
                搜尋條件
              </v-card-title>
              <v-card-text class="pa-2">
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
                  >
                    <!-- 申請人自動完成 -->
                    <v-autocomplete
                      v-model="searchCriteria.requesterId"
                      v-model:search-input="requesterSearchInput"
                      :items="requesterSuggestions"
                      :loading="requesterLoading"
                      label="申請人"
                      return-object
                      :item-props="item => ({
                        title: `${item.name} (${item.userId})`,
                        value: item
                      })"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      @update:search="handleRequesterSearch"
                      @click:clear="clearRequesterSearch"
                    >
                      <template #selection="{ item }">
                        {{ item?.props?.title }}
                      </template>
                      <template
                        v-if="smAndUp"
                        #append-inner
                      >
                        <v-tooltip
                          location="top"
                          close-delay="200"
                        >
                          <template #activator="{ props }">
                            <v-icon
                              v-bind="props"
                              icon="mdi-information"
                              size="18"
                            />
                          </template>
                          輸入員編、姓名查詢
                        </v-tooltip>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
                  >
                    <v-select
                      v-model="searchCriteria.category"
                      :items="['硬體問題', '軟體問題', '網路問題', '帳號權限', '其他']"
                      label="類別"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
                  >
                    <v-select
                      v-model="searchCriteria.priority"
                      :items="['低', '中', '高', '緊急']"
                      label="優先度"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
                  >
                    <v-select
                      v-model="searchCriteria.status"
                      :items="['待處理', '處理中', '待確認', '已完成', '已取消']"
                      label="狀態"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col
                    cols="12"
                    class="d-flex justify-end gap-2"
                  >
                    <v-row class="d-flex justify-space-between">
                      <v-col cols="3">
                        <v-btn
                          color="grey"
                          width="40"
                          block
                          @click="resetSearch"
                        >
                          <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col
                        cols="9"
                        class="ps-0"
                      >
                        <v-btn
                          color="blue-grey-darken-1"
                          prepend-icon="mdi-magnify"
                          :loading="loading"
                          block
                          @click="performSearch"
                        >
                          搜尋
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- 表格區塊 -->
      <v-col
        cols="12"
        lg="9"
        class="px-6 ps-lg-4 pe-lg-12 mb-6"
      >
        <v-row class="elevation-4 rounded-lg py-4 py-sm-8 px-1 px-sm-4 px-md-10 mt-1 bg-white">
          <!-- 標題和一般搜尋欄位 -->
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center mb-2 mb-sm-4">
              <v-row>
                <v-col>
                  <h3>IT維修服務管理</h3>
                </v-col>
                <v-col
                  cols="6"
                  sm="5"
                  md="4"
                  xl="3"
                  class="d-flex align-center"
                >
                  <v-icon
                    v-if="smAndUp"
                    v-tooltip:start="'可搜尋維修編號、標題、分機、地點、問題描述'"
                    icon="mdi-information"
                    size="small"
                    color="blue-grey-darken-2"
                    class="me-4"
                  />
                  <v-text-field
                    v-model="searchText"
                    label="搜尋"
                    append-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    @update:model-value="performSearch"
                  />
                </v-col>
              </v-row>
            </div>
          </v-col>

          <!-- 表格 -->
          <v-col cols="12">
            <v-data-table-server
              :key="tableKey"
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
              density="comfortable"
              class="rounded-lg"
              @update:options="fetchTickets"
            >
              <!-- 狀態列 -->
              <template #[`item.status`]="{ item }">
                <v-menu>
                  <template #activator="{ props }">
                    <v-chip
                      v-tooltip:start="'點擊更改狀態'"
                      v-bind="props"
                      :color="getStatusColor(item.status)"
                      variant="outlined"
                      label
                      size="small"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="status in ['待處理', '處理中', '待確認', '已完成', '已取消']"
                      :key="status"
                      :active="item.status === status"
                      @click="handleStatusChange(item, status)"
                    >
                      <v-list-item-title>{{ status }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>

              <!-- 優先度列 -->
              <template #[`item.priority`]="{ item }">
                <v-chip
                  :color="getPriorityColor(item.priority)"
                  variant="outlined"
                  size="small"
                >
                  {{ item.priority }}
                </v-chip>
              </template>

              <!-- 分機號碼列 -->
              <template #[`item.requesterId.extNumber`]="{ item }">
                {{ item.requesterId?.extNumber || '-' }}
              </template>

              <!-- 處理者欄位的模板 -->
              <template #[`item.assigneeId`]="{ item }">
                <v-menu>
                  <template #activator="{ props }">
                    <v-chip
                      v-tooltip:start="'點擊指派處理者'"
                      v-bind="props"
                      :color="item.assigneeId ? 'blue' : 'grey'"
                      variant="outlined"
                      label
                      size="small"
                    >
                      {{ item.assigneeId?.name ? `${item.assigneeId.name} (${item.assigneeId.userId})` : '尚未指派' }}
                    </v-chip>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="assignee in assignees"
                      :key="assignee._id"
                      :active="item.assigneeId?._id === assignee._id"
                      @click="handleAssigneeChange(item, assignee._id)"
                    >
                      <v-list-item-title>{{ assignee.name }} ({{ assignee.userId }})</v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item @click="handleAssigneeChange(item, null)">
                      <v-list-item-title class="text-grey">
                        移除指派
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>

              <!-- 圖片列 -->
              <template #[`item.attachments`]="{ item }">
                <v-btn
                  v-if="item.attachments?.length"
                  v-tooltip:start="`查看${item.attachments.length}張圖片`"
                  icon
                  variant="plain"
                  color="blue-grey-darken-1"
                  :ripple="false"
                  @click="openImageDialog(item.attachments)"
                >
                  <v-icon
                    size="small"
                  >
                    mdi-image-multiple
                  </v-icon>
                  <span class="ms-1">*{{ item.attachments.length }}</span>
                </v-btn>
                <span v-else>無</span>
              </template>

              <!-- 操作列 -->
              <template #[`item.actions`]="{ item }">
                <div class="d-flex justify-center align-center">
                  <v-col
                    cols="6"
                    sm="4"
                    md="3"
                    lg="2"
                    class="pa-0 "
                  >
                    <v-btn
                      v-tooltip:start="item.solution ? '編輯處理方案':'新增處理方案'"
                      icon
                      :color="item.solution ? 'light-blue-darken-4':'green-darken-1'"
                      class="me-2"
                      variant="plain"
                      :ripple="false"
                      :size="buttonSize"
                      @click="openSolutionDialog(item)"
                    >
                      <v-icon size="small">
                        {{ item.solution ? 'mdi-note-edit' : 'mdi-note-plus' }}
                      </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="6"
                    sm="4"
                    md="3"
                    lg="2"
                    class="pa-0 "
                  >
                    <v-btn
                      color="blue-grey-darken-2"
                      variant="plain"
                      :ripple="false"
                      :size="buttonSize"
                      @click="showDetail(item)"
                    >
                      <v-icon :size="buttonSize">
                        mdi-book-open-variant-outline
                      </v-icon>
                    </v-btn>
                  </v-col>
                </div>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 圖片查看對話框 -->
    <vue-easy-lightbox
      :visible="lightbox.visible"
      :imgs="lightbox.imgs"
      :index="lightbox.index"
      :dblclick-closable="true"
      @hide="lightbox.visible = false"
    />

    <!-- 處理方案對話框 -->
    <v-dialog
      v-model="solutionDialog.show"
      persistent
      max-width="480"
    >
      <v-form @submit.prevent="saveSolution">
        <v-card class="rounded-lg pa-4 pt-6">
          <div class="ps-3 pt-3 pb-5 card-title d-inline">
            {{ solutionDialog.ticket?.solution ? '編輯處理方案' : '新增處理方案' }}
            <!-- 最後更新時間 -->
            <div
              v-if="solutionDialog.ticket?.solutionUpdatedAt"
              style="font-size: 12px;"
              class="text-grey-darken-1"
            >
              ( <span>最後更新時間：</span>
              {{ formatDate(solutionDialog.ticket.solutionUpdatedAt) }} )
            </div>
          </div>
          <v-card-text class="px-3">
            <v-textarea
              v-model="solutionDialog.solution"
              label="處理方案"
              variant="outlined"
              density="compact"
              :error-messages="solutionDialog.error"
              rows="10"
              auto-grow
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="red-lighten-1"
              variant="outlined"
              :size="buttonSize"
              :loading="solutionDialog.loading"
              @click="closeSolutionDialog"
            >
              取消
            </v-btn>
            <v-btn
              color="teal-darken-1"
              variant="outlined"
              type="submit"
              :size="buttonSize"
              class="ms-1"
              :loading="solutionDialog.loading"
              :disabled="!solutionDialog.solution?.trim()"
            >
              送出
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- 詳情查看對話框 -->
    <v-dialog
      v-model="detailDialog.show"
      max-width="600"
    >
      <v-card class="pa-4">
        <div class="ps-6 pt-4 pb-1 pb-sm-3 card-title">
          維修請求詳細資料
        </div>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div class="d-flex flex-column gap-4">
                <div>
                  <div class="text-grey-darken-1 list-title">
                    維修編號
                  </div>
                  <div class="list-content">
                    {{ detailDialog.ticket?.ticketId }}
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    申請人
                  </div>
                  <div class="list-content">
                    {{ detailDialog.ticket?.requesterId?.name }}
                    ({{ detailDialog.ticket?.requesterId?.userId }})
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    分機號碼
                  </div>
                  <div class="list-content">
                    {{ detailDialog.ticket?.requesterId?.extNumber || '-' }}
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    標題
                  </div>
                  <div class="list-content">
                    {{ detailDialog.ticket?.title }}
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    類別
                  </div>
                  <div class="list-content">
                    {{ detailDialog.ticket?.category }}
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    優先程度
                  </div>
                  <div class="list-content">
                    {{ detailDialog.ticket?.priority }}
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    狀態
                  </div>
                  <div class="list-content">
                    {{ detailDialog.ticket?.status }}
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    地點
                  </div>
                  <div class="list-content">
                    {{ detailDialog.ticket?.location }}
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    問題描述
                  </div>
                  <div
                    style="white-space: pre-wrap;"
                    class="list-content"
                  >
                    {{ detailDialog.ticket?.description }}
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    處理者
                  </div>
                  <div class="list-content">
                    {{ detailDialog.ticket?.assigneeId?.name || '尚未指派' }}
                  </div>
                </div>
                <v-divider class="my-2" />

                <div>
                  <div class="text-grey-darken-1 list-title">
                    處理方案
                  </div>
                  <div
                    style="white-space: pre-wrap; min-height: 64px; border-radius: 8px; padding: 12px;"
                    class="list-content border"
                  >
                    {{ detailDialog.ticket?.solution || '尚未填寫' }}
                  </div>
                  <div
                    v-if="detailDialog.ticket?.solutionUpdatedAt"
                    class="text-grey text-caption mt-1"
                  >
                    最後更新：{{ formatDate(detailDialog.ticket.solutionUpdatedAt) }}
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
            @click="detailDialog.show = false"
          >
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import UserRole from '@/enums/UserRole'
import { definePage } from 'vue-router/auto'
import VueEasyLightbox from 'vue-easy-lightbox'
import { debounce } from 'lodash'

// 定義頁面元數據
definePage({
  meta: {
    title: 'IT維修服務管理 | ysphere',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.IT]
  }
})

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const { smAndUp, mdAndUp, xlAndUp, width } = useDisplay()
const is2200up = computed(() => width.value >= 2200)
const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)

  // 補零函數
  const pad = (num) => String(num).padStart(2, '0')

  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const seconds = pad(d.getSeconds())

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

// 表格相關狀態
const loading = ref(false)
const tickets = ref([])
const totalTickets = ref(0)
const tableItemsPerPage = ref(10)
const tablePage = ref(1)
const tableSortBy = ref([])
const searchText = ref('')
const headerProps = {
  class: 'header-bg'
}
const requesterSuggestions = ref([])
const requesterLoading = ref(false)
const requesterSearchInput = ref('')
const assignees = ref([])
const assigneeLoading = ref(false)

const loadAssignees = async () => {
  try {
    console.log('開始載入處理者清單')
    const { data } = await apiAuth.get('/serviceTicket/assignees')

    console.log('API 回應資料:', data)

    if (data.success && Array.isArray(data.result)) {
      assignees.value = data.result
    } else {
      console.error('API 回傳的資料格式不正確:', data)
      assignees.value = []
    }
  } catch (error) {
    console.error('載入處理者清單失敗:', error)
    if (error.response) {
      console.error('錯誤回應:', error.response.data)
    }
    createSnackbar({
      text: error?.response?.data?.message || '載入處理者清單失敗',
      snackbarProps: { color: 'error' }
    })
    assignees.value = []
  }
}

const tableKey = ref(0) // 定義表格 key

const refreshTable = () => {
  tableKey.value += 1 // 遞增 key 強制渲染
}

const handleAssigneeChange = async (ticket, assigneeId) => {
  try {
    assigneeLoading.value = true
    const { data } = await apiAuth.patch(`/serviceTicket/${ticket._id}`, {
      assigneeId
    })

    const updatedAssignee = data.result.assigneeId

    // 更新本地資料
    const index = tickets.value.findIndex((t) => t._id === ticket._id)
    if (index !== -1) {
      tickets.value[index] = {
        ...tickets.value[index],
        assigneeId: updatedAssignee
      }
    }

    // 觸發成功訊息
    createSnackbar({
      text: assigneeId ? '處理者更新成功' : '已移除指派',
      snackbarProps: { color: 'teal-lighten-1' }
    })

    refreshTable() // 強制刷新表格
  } catch (error) {
    console.error('更新處理者失敗:', error)

    createSnackbar({
      text: error?.response?.data?.message || '更新處理者失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    assigneeLoading.value = false // 確保 loading 狀態重置
  }
}

// 篩選條件
const filters = ref({
  status: null,
  category: null,
  priority: null
})

const searchCriteria = ref({
  requesterId: null,
  category: null,
  priority: null,
  status: null
})

// 表格欄位定義
const headers = [
  { title: '維修編號', align: 'start', key: 'ticketId', sortable: true, minWidth: '120px' },
  { title: '標題', align: 'start', key: 'title', sortable: true, minWidth: '120px' },
  { title: '申請人', align: 'start', key: 'requesterId.name', sortable: true, minWidth: '100px' },
  { title: '分機', align: 'start', key: 'requesterId.extNumber', sortable: true, minWidth: '100px' },
  { title: '類別', align: 'start', key: 'category', sortable: true },
  { title: '優先度', align: 'start', key: 'priority', sortable: true, minWidth: '100px' },
  { title: '狀態', align: 'start', key: 'status', sortable: true },
  { title: '地點', align: 'start', key: 'location', sortable: true, minWidth: '64px' },
  { title: '圖片', align: 'center', key: 'attachments', sortable: false, minWidth: '100px' },
  { title: '處理者', align: 'start', key: 'assigneeId', sortable: true, minWidth: '100px' },
  { title: '問題描述', align: 'start', key: 'description', sortable: false },
  { title: '操作', align: 'center', key: 'actions', sortable: false }
]

// 響應式表頭
const filteredHeaders = computed(() => {
  if (is2200up.value) {
    return headers
  }
  if (xlAndUp.value) {
    return headers.filter(header =>
      !['description', 'category', 'location', 'assigneeId.name'].includes(header.key)
    )
  }
  if (mdAndUp.value) {
    return headers.filter(header =>
      !['description', 'category', 'location', 'assigneeId.name'].includes(header.key)
    )
  }
  return headers.filter(header =>
    ['ticketId', 'requesterId.name', 'requesterId.extNumber', 'title', 'status', 'actions', 'attachments'].includes(header.key)
  )
})

// 圖片查看相關狀態
const lightbox = ref({
  visible: false,
  index: 0,
  imgs: []
})

// 處理方案對話框狀態
const solutionDialog = ref({
  show: false,
  ticket: null,
  solution: '',
  loading: false,
  error: '',
  pendingStatus: null
})

// 詳情對話框狀態
const detailDialog = ref({
  show: false,
  ticket: null
})

// 查看詳情方法
const showDetail = (ticket) => {
  detailDialog.value = {
    show: true,
    ticket
  }
}

// 取得狀態顏色
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

// 取得優先度顏色
const getPriorityColor = (priority) => {
  const colors = {
    低: 'green',
    中: 'blue',
    高: 'orange-darken-1',
    緊急: 'red'
  }
  return colors[priority] || 'grey'
}

const handleRequesterSearch = debounce(async (text) => {
  requesterLoading.value = true
  try {
    const { data } = await apiAuth.get('/user/suggestions', {
      params: { search: text }
    })
    if (data.success) {
      requesterSuggestions.value = data.result
    }
  } catch (error) {
    console.error('搜索申請人失敗:', error)
    requesterSuggestions.value = []
  } finally {
    requesterLoading.value = false
  }
}, 300)

// 清除申請人搜尋
const clearRequesterSearch = () => {
  requesterSearchInput.value = ''
  requesterSuggestions.value = []
  searchCriteria.value.requesterId = null
}

// 重置搜尋
const resetSearch = () => {
  searchCriteria.value = {
    requesterId: null,
    category: null,
    priority: null,
    status: null
  }
  searchText.value = ''
  clearRequesterSearch()
  performSearch()
}

// 狀態更新前的檢查
const handleStatusChange = async (ticket, newStatus) => {
  // 如果要改為已完成，先檢查是否有處理方案
  if (newStatus === '已完成') {
    if (!ticket.solution) {
      // 如果沒有處理方案，打開處理方案對話框
      openSolutionDialog(ticket, newStatus)
      return
    }
  }

  // 其他狀態或已有處理方案，直接更新
  await updateStatus(ticket, newStatus)
}

// 獲取維修請求列表
const fetchTickets = async () => {
  loading.value = true
  try {
    const params = {
      page: tablePage.value,
      limit: tableItemsPerPage.value,
      sort: tableSortBy.value.length ? `${tableSortBy.value[0].order === 'desc' ? '-' : ''}${tableSortBy.value[0].key}` : '-createdAt',
      search: searchText.value
    }

    // 添加搜尋條件
    if (searchCriteria.value.requesterId?._id) {
      params.requesterId = searchCriteria.value.requesterId._id
    }
    if (searchCriteria.value.category) {
      params.category = searchCriteria.value.category
    }
    if (searchCriteria.value.priority) {
      params.priority = searchCriteria.value.priority
    }
    if (searchCriteria.value.status) {
      params.status = searchCriteria.value.status
    }

    const { data } = await apiAuth.get('/serviceTicket/all', { params })

    if (data.success) {
      tickets.value = data.result.data
      totalTickets.value = data.result.total
    }
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
const performSearch = async () => {
  tablePage.value = 1
  await fetchTickets()
}

// 開啟圖片對話框
const openImageDialog = (images) => {
  lightbox.value = {
    visible: true,
    index: 0,
    imgs: images.map(img => ({
      src: img.url,
      title: img.publicId
    }))
  }
}

// 開啟處理方案對話框
const openSolutionDialog = (ticket, pendingStatus = null) => {
  solutionDialog.value = {
    show: true,
    ticket,
    solution: ticket.solution || '',
    loading: false,
    error: '',
    pendingStatus
  }
}

const closeSolutionDialog = () => {
  solutionDialog.value = {
    show: false,
    ticket: null,
    solution: '',
    loading: false,
    error: '',
    pendingStatus: null
  }
}

// 更新狀態
const updateStatus = async (ticket, newStatus) => {
  try {
    const { data } = await apiAuth.patch(`/serviceTicket/${ticket._id}`, {
      status: newStatus
    })

    // 更新本地數據，保留原有的 requesterId 信息
    const index = tickets.value.findIndex(t => t._id === ticket._id)
    if (index !== -1) {
      tickets.value[index] = {
        ...data.result,
        requesterId: {
          ...tickets.value[index].requesterId,
          ...data.result.requesterId
        }
      }
    }

    createSnackbar({
      text: '狀態更新成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })
  } catch (error) {
    console.error('更新狀態失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '更新狀態失敗',
      snackbarProps: { color: 'error' }
    })
  }
}

// 儲存處理方案
const saveSolution = async (event) => {
  event?.preventDefault()

  if (!solutionDialog.value.solution?.trim()) {
    solutionDialog.value.error = '請輸入處理方案'
    return
  }

  solutionDialog.value.loading = true
  try {
    const { data } = await apiAuth.patch(`/serviceTicket/${solutionDialog.value.ticket._id}`, {
      solution: solutionDialog.value.solution
    })

    // 更新本地數據，保留原有的 requesterId 信息
    const index = tickets.value.findIndex(t => t._id === solutionDialog.value.ticket._id)
    if (index !== -1) {
      tickets.value[index] = {
        ...data.result,
        requesterId: {
          ...tickets.value[index].requesterId,
          ...data.result.requesterId
        }
      }
    }

    createSnackbar({
      text: '處理方案儲存成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })

    // 如果有待更新的狀態，繼續更新狀態
    if (solutionDialog.value.pendingStatus) {
      await updateStatus(tickets.value[index], solutionDialog.value.pendingStatus)
    }

    closeSolutionDialog()
  } catch (error) {
    console.error('儲存處理方案失敗:', error)
    solutionDialog.value.error = error?.response?.data?.message || '儲存處理方案失敗'
    createSnackbar({
      text: error?.response?.data?.message || '儲存處理方案失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    solutionDialog.value.loading = false
  }
}

// 監聽篩選條件變化
watch(
  [
    () => filters.value.status,
    () => filters.value.category,
    () => filters.value.priority
  ],
  () => {
    tablePage.value = 1
    fetchTickets()
  }
)

// 組件掛載時獲取數據
onMounted(async () => {
  console.log('組件載入') // debug
  try {
    await loadAssignees() // 先載入處理者清單
    await fetchTickets() // 再載入請求列表
  } catch (error) {
    console.error('初始化失敗:', error)
  }
})
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}

// 表格樣式
:deep(.header-bg) {
  background-color: #5e5858;
  color: white;
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

.v-dialog--active {
  overflow-y: auto;
}
</style>
