<template>
  <v-container max-width="2500">
    <v-row>
      <!-- 左側搜尋條件區塊 -->
      <v-col
        cols="12"
        lg="4"
        xl="3"
      >
        <v-row>
          <v-col
            cols="12"
            class="mt-1 px-lg-10"
          >
            <v-card
              class="elevation-4 rounded-xl py-4 py-sm-8 px-4 px-sm-4 px-xl-8"
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
                    <v-select
                      v-model="searchCriteria.status"
                      :items="statusOptions"
                      label="狀態"
                      item-title="title"
                      item-value="value"
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
                      v-model="searchCriteria.companyId"
                      :items="companyList"
                      label="公司"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      @update:model-value="handleCompanyChange"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
                  >
                    <v-select
                      v-model="searchCriteria.department"
                      :items="filteredDepartments"
                      label="部門"
                      item-title="name"
                      item-value="_id"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      :disabled="!searchCriteria.companyId"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    lg="12"
                  >
                    <v-date-input
                      v-model="searchCriteria.effectiveDate"
                      label="生效日期"
                      prepend-icon
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      multiple="range"
                      :cancel-text="'取消'"
                      :ok-text="'確認'"
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
                          color="cyan-darken-2"
                          prepend-icon="mdi-magnify"
                          :loading="tableLoading"
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

      <!-- 右側表格區塊 -->
      <v-col
        cols="12"
        lg="8"
        xl="9"
        class="px-6 ps-lg-4 pe-lg-12 mb-6"
      >
        <v-row class="elevation-4 rounded-xl py-4 py-sm-8 px-1 px-sm-4 px-md-10 mt-1 bg-white">
          <v-col
            cols="12"
            class="ps-4 pb-sm-6"
          >
            <h3>招聘資料管理</h3>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col>
                <v-btn
                  prepend-icon="mdi-account-plus"
                  variant="outlined"
                  color="blue-grey-darken-2"
                  @click="openTempDialog(null)"
                >
                  新增招聘資料
                </v-btn>
              </v-col>
              <v-col
                sm="4"
                lg="3"
              >
                <v-row class="d-flex align-center">
                  <v-col
                    v-if="mdAndUp"
                    cols="2"
                    class="ps-lg-5"
                  >
                    <v-icon
                      v-tooltip:start="'可搜尋姓名、個人Email、手機'"
                      icon="mdi-information"
                      size="small"
                      color="blue-grey-darken-2"
                      class="pe-3 pe-xl-0"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="quickSearchText"
                      label="搜尋"
                      append-inner-icon="mdi-magnify"
                      base-color="#666"
                      color="blue-grey-darken-3"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-data-table-server
              :key="tableKey"
              v-model:items-per-page="tableItemsPerPage"
              v-model:sort-by="tableSortBy"
              :page="tablePage"
              density="compact"
              class="rounded-ts-lg rounded-te-lg py-3"
              :items-per-page-options="[10, 20 ,50]"
              :items="tableItems"
              :headers="filteredHeaders"
              :header-props="headerProps"
              :loading="tableLoading"
              :items-length="tableItemsLength"
              :search="tableSearch"
              hover
              @update:items-per-page="tableLoadItems(false)"
              @update:sort-by="tableLoadItems(false)"
              @update:page="onUpdatePage"
            >
              <template #item="{ item, index }">
                <tr :class="{ 'odd-row': index % 2 === 0, 'even-row': index % 2 !== 0 }">
                  <td>{{ formatDate(item.effectiveDate) }}</td>
                  <td>{{ item.name }}</td>
                  <td v-if="smAndUp">
                    {{ item.company?.name || '' }}
                  </td>
                  <td v-if="smAndUp">
                    {{ item.department?.name || '' }}
                  </td>
                  <td v-if="mdAndUp">
                    {{ item.extNumber }}
                  </td>
                  <td v-if="mdAndUp">
                    {{ item.seatDescription }}
                  </td>
                  <td v-if="mdAndUp">
                    <v-chip
                      :color="getStatusColor(item.status)"
                      size="small"
                    >
                      {{ item.status }}
                    </v-chip>
                  </td>
                  <td class="d-flex align-center overflow-hidden h-25 pe-0">
                    <v-btn
                      icon
                      color="light-blue-darken-4"
                      variant="plain"
                      width="28"
                      :size="buttonSize"
                      :ripple="false"
                      @click="openTempDialog(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="item.status === '待入職'"
                      v-tooltip:top="'轉為正式員工'"
                      icon
                      color="teal-darken-1"
                      variant="plain"
                      width="28"
                      class="ms-2"
                      :size="buttonSize"
                      :ripple="false"
                      @click="openTransferDialog(item)"
                    >
                      <v-icon>mdi-account-convert</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 招聘資料 Dialog -->
    <v-dialog
      v-model="tempDialog.open"
      persistent
      :width="dialogWidth"
    >
      <v-form
        ref="tempForm"
        :disabled="istempUserSubmitting"
        @submit.prevent="submitTemp"
      >
        <v-card class="rounded-lg px-4 py-6">
          <div class="card-title ps-4 py-3">
            {{ tempDialog.id ? '招聘資料編輯' : '新增招聘資料' }}
          </div>

          <!-- 基本資料區塊 -->
          <v-row class="py-4">
            <v-col
              cols="4"
              md="5"
              class="d-flex align-center ps-6"
            >
              <v-divider />
            </v-col>
            <v-col
              cols="4"
              md="2"
              class="info-title px-0 text-blue-grey-darken-2"
            >
              基本資料
            </v-col>
            <v-col
              cols="4"
              md="5"
              class="d-flex align-center pe-6"
            >
              <v-divider />
            </v-col>
          </v-row>

          <v-card-text
            v-if="isInitializingStatus && isEditing"
            class="d-flex justify-center align-center"
            style="height: 600px;"
          >
            <v-progress-circular
              indeterminate
              color="blue-grey-darken-2"
              :size="circularSize"
            />
          </v-card-text>

          <v-card-text
            v-if="!isInitializingStatus || !isEditing"
            class="mt-3 pa-3"
          >
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="name.value.value"
                  :error-messages="name.errorMessage.value"
                  label="*姓名"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="englishName.value.value"
                  :error-messages="englishName.errorMessage.value"
                  label="英文名"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="IDNumber.value.value"
                  :error-messages="IDNumber.errorMessage.value"
                  label="身分證號碼"
                  maxlength="10"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-date-input
                  v-model="birthDate.value.value"
                  :error-messages="birthDate.errorMessage.value"
                  label="生日"
                  prepend-icon
                  variant="outlined"
                  density="compact"
                  clearable
                  :cancel-text="'取消'"
                  :ok-text="'確認'"
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-select
                  v-model="gender.value.value"
                  :items="genderOptions"
                  :error-messages="gender.errorMessage.value"
                  label="性別"
                  variant="outlined"
                  density="compact"
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="cellphone.value.value"
                  :error-messages="cellphone.errorMessage.value"
                  label="手機號碼"
                  maxlength="10"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                class="pb-0"
              >
                <v-text-field
                  v-model="personalEmail.value.value"
                  :error-messages="personalEmail.errorMessage.value"
                  label="個人Email"
                  type="email"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                class="pb-0"
              >
                <v-text-field
                  v-model="permanentAddress.value.value"
                  :error-messages="permanentAddress.errorMessage.value"
                  label="戶籍地址"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                class="pb-0"
              >
                <v-text-field
                  v-model="contactAddress.value.value"
                  :error-messages="contactAddress.errorMessage.value"
                  label="聯絡地址"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                >
                  <template #append-inner>
                    <v-tooltip
                      location="top"
                      close-delay="200"
                    >
                      <template #activator="{ props }">
                        <v-icon
                          v-bind="props"
                          icon="mdi-content-copy"
                          @click="copyPermanentAddress"
                        />
                      </template>
                      複製戶籍地址
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 緊急聯絡人資訊 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                class="pb-0"
              >
                <v-text-field
                  v-model="emergencyName.value.value"
                  :error-messages="emergencyName.errorMessage.value"
                  label="緊急聯絡人姓名"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                class="pb-0"
              >
                <v-text-field
                  v-model="emergencyCellphone.value.value"
                  :error-messages="emergencyCellphone.errorMessage.value"
                  label="緊急聯絡人電話"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                class="pb-0"
              >
                <v-text-field
                  v-model="emergencyRelationship.value.value"
                  :error-messages="emergencyRelationship.errorMessage.value"
                  label="緊急聯絡人關係"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
            </v-row>
          </v-card-text>

          <!-- 工作相關資訊區塊 -->
          <v-row
            v-if="!isInitializingStatus || !isEditing"
            class="py-4"
          >
            <v-col
              cols="3"
              md="4"
              class="d-flex align-center ps-6"
            >
              <v-divider />
            </v-col>
            <v-col
              cols="6"
              md="4"
              class="info-title text-blue-grey-darken-2"
            >
              預計任職資訊
            </v-col>
            <v-col
              cols="3"
              md="4"
              class="d-flex align-center pe-6"
            >
              <v-divider />
            </v-col>
          </v-row>

          <v-card-text
            v-if="!isInitializingStatus || !isEditing"
            class="mt-3 pa-3"
          >
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-date-input
                  v-model="effectiveDate.value.value"
                  :error-messages="effectiveDate.errorMessage.value"
                  label="*生效日期"
                  prepend-icon
                  variant="outlined"
                  density="compact"
                  clearable
                  :cancel-text="'取消'"
                  :ok-text="'確認'"
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-select
                  v-model="status.value.value"
                  :error-messages="status.errorMessage.value"
                  :items="statusOptions"
                  item-title="title"
                  item-value="value"
                  label="*狀態"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-select
                  v-model="selectedCompany"
                  :error-messages="company.errorMessage.value"
                  :items="companyOptions"
                  label="所屬公司"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="handleCompanyChange"
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-select
                  v-model="department.value.value"
                  :items="filteredDepartments"
                  :error-messages="department.errorMessage.value"
                  item-title="name"
                  item-value="_id"
                  label="選擇部門"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="jobTitle.value.value"
                  :error-messages="jobTitle.errorMessage.value"
                  label="預計職稱"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="salary.value.value"
                  :error-messages="salary.errorMessage.value"
                  label="預計薪資"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="extNumber.value.value"
                  :error-messages="extNumber.errorMessage.value"
                  label="預計分機號碼"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="seatDescription.value.value"
                  :error-messages="seatDescription.errorMessage.value"
                  label="座位描述"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="note.value.value"
                  :error-messages="note.errorMessage.value"
                  label="備註"
                  type="text"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="px-3 mt-4">
            <v-hover>
              <template #default="{ isHovering, props }">
                <v-btn
                  v-if="isEditing"
                  v-bind="props"
                  :color="isHovering ? 'red-lighten-1' : 'grey'"
                  variant="outlined"
                  prepend-icon="mdi-delete"
                  :size="buttonSize"
                  @click="confirmDeleteDialog = true"
                >
                  永久刪除
                </v-btn>
              </template>
            </v-hover>
            <v-spacer />
            <v-btn
              color="red-lighten-1"
              variant="outlined"
              :size="buttonSize"
              :loading="istempUserSubmitting"
              @click="closeTempDialog"
            >
              取消
            </v-btn>
            <v-btn
              color="teal-darken-1"
              variant="outlined"
              type="submit"
              class="ms-1"
              :size="buttonSize"
              :loading="istempUserSubmitting"
              :disabled="isEditing && !hasChanges"
            >
              送出
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- 確認刪除 Dialog -->
    <ConfirmDeleteDialogWithTextField
      v-model="confirmDeleteDialog"
      title="確認刪除招聘資料"
      :message="`確定要刪除「<span class='text-pink-lighten-1' style='font-weight: 800;'>${name.value.value}</span>」的招聘資料嗎？ 此操作無法復原。`"
      :expected-name="name.value.value"
      input-label="輸入欲刪除姓名"
      @confirm="deleteUser"
    />

    <TransferDialog
      v-if="selectedTempUser"
      ref="transferDialog"
      :temp-user="selectedTempUser"
      @transferred="handleTransferred"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useDisplay } from 'vuetify'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { debounce } from 'lodash'
import { definePage } from 'vue-router/auto'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import UserRole from '@/enums/UserRole'
import ConfirmDeleteDialogWithTextField from '@/components/ConfirmDeleteDialogWithTextField.vue'
import TransferDialog from '@/components/TransferDialog.vue'

// ===== 頁面設定 =====
definePage({
  meta: {
    title: '招聘資料管理 | ysphere',
    login: true,
    roles: [UserRole.HR, UserRole.SUPER_ADMIN]
  }
})

// ===== API & Store =====
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const transferDialog = ref(null)
const openTransferDialog = (item) => {
  // 先設置 selectedTempUser
  selectedTempUser.value = item

  // 確保 nextTick 後再開啟 dialog
  nextTick(() => {
    if (transferDialog.value) {
      transferDialog.value.openTransferDialog(item)
    }
  })
}
const handleTransferred = async (newUser) => {
  // 重新載入招聘資料列表
  await performSearch()

  // 重新載入員工管理表格
  if (tableLoadItems) {
    await tableLoadItems(true)
  }
}
const selectedTempUser = ref(null)

// ===== 響應式設定 =====
const { smAndUp, mdAndUp, lgAndUp, xlAndUp } = useDisplay()
const buttonSize = computed(() => smAndUp.value ? 'default' : 'small')
const circularSize = computed(() => {
  return smAndUp.value ? 64 : 48
})

// ===== 表格相關 =====
const tableLoading = ref(false)
const tableItems = ref([])
const tablePage = ref(1)
const tableItemsPerPage = ref(10)
const tableItemsLength = ref(0)
const tableKey = ref(0)
const tableSortBy = ref([{ key: 'effectiveDate', order: 'asc' }])
const tableSearch = ref('')
const headerProps = { class: 'header-bg' }
const tableLoadItems = async (reset) => {
  if (reset) {
    tablePage.value = 1
  }
  await performSearch()
}
const onUpdatePage = (page) => {
  if (page < 1) page = 1
  const maxPage = Math.ceil(tableItemsLength.value / tableItemsPerPage.value)
  if (page > maxPage) page = maxPage

  tablePage.value = page
  performSearch()
}

const isInitializingStatus = ref(false)

const tableHeaders = [
  { title: '生效日期', align: 'start', sortable: true, key: 'effectiveDate' },
  { title: '姓名', align: 'start', sortable: true, key: 'name' },
  { title: '預計公司', align: 'start', sortable: true, key: 'company.name' },
  { title: '預計部門', align: 'start', sortable: true, key: 'department.name' },
  { title: '預計分機', align: 'start', sortable: true, key: 'extNumber' },
  { title: '座位', align: 'start', sortable: true, key: 'seatDescription' },
  { title: '狀態', align: 'start', sortable: true, key: 'status' },
  { title: '操作', align: 'start', sortable: false, key: 'actions', minWidth: '100px' }
]

// 響應式表頭
const filteredHeaders = computed(() => {
  if (!smAndUp.value) {
    return tableHeaders.filter(header =>
      ['effectiveDate', 'name', 'actions'].includes(header.key)
    )
  }
  if (!mdAndUp.value) {
    return tableHeaders.filter(header =>
      !['extNumber', 'seatDescription', 'status'].includes(header.key)
    )
  }
  return tableHeaders
})

// ===== 下拉選項 =====
const statusOptions = [
  { title: '待面試', value: '待面試' },
  { title: '待入職', value: '待入職' },
  { title: '已完成', value: '已完成' },
  { title: '已取消', value: '已取消' }
]

const genderOptions = [
  { title: '男性', value: '男性' },
  { title: '女性', value: '女性' }
]

// 狀態顏色映射
const getStatusColor = (status) => {
  const colors = {
    待面試: 'warning',
    待入職: 'info',
    已完成: 'success',
    已取消: 'error'
  }
  return colors[status] || 'grey'
}

// ===== 搜尋條件 =====
const searchCriteria = ref({
  status: '',
  companyId: '',
  department: '',
  effectiveDate: null
})

const quickSearchText = ref('')

// ===== 公司相關設定 =====
const companies = ref([])
const filteredDepartments = ref([])
const selectedCompany = ref(null)

const companyList = computed(() => {
  return [
    { title: '全部', value: '' },
    ...[...companies.value]
      .sort((a, b) => {
        // 確保 companyId 存在
        const idA = a.companyId || ''
        const idB = b.companyId || ''
        return idA.localeCompare(idB)
      })
      .map(company => ({
        title: company.name,
        value: company._id
      }))
  ]
})

const companyOptions = computed(() => {
  return [...companies.value]
    .sort((a, b) => {
      // 確保 companyId 存在
      const idA = a.companyId || ''
      const idB = b.companyId || ''
      return idA.localeCompare(idB)
    })
    .map(company => ({
      title: company.name,
      value: company._id
    }))
})

// ===== Dialog 設定 =====
const dialogWidth = computed(() => {
  if (xlAndUp.value) return '1200'
  if (lgAndUp.value) return '900'
  if (mdAndUp.value) return '800'
  if (smAndUp.value) return '600'
  return '100%'
})

const isEditing = ref(false)
const tempDialog = ref({
  open: false,
  id: ''
})

// ===== 表單驗證 =====
const tempUserSchema = yup.object({
  // 必填欄位
  name: yup.string().required('請輸入姓名'),
  effectiveDate: yup.date().required('請選擇生效日期'),
  status: yup.string().required('請選擇狀態'),

  // 選填欄位但有格式要求
  personalEmail: yup.string()
    .transform((value) => (value === '' ? null : value))
    .test('email-format', '請輸入正確的Email格式', (value) => {
      if (!value) return true // 沒有值就不驗證
      return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
    })
    .nullable(),

  IDNumber: yup.string()
    .transform((value) => (value === '' ? null : value))
    .test('id-format', '身分證號碼格式不正確', (value) => {
      if (!value) return true // 沒有值就不驗證
      return /^[A-Za-z][12]\d{8}$/.test(value)
    })
    .nullable(),

  cellphone: yup.string()
    .transform((value) => (value === '' ? null : value))
    .test('phone-format', '手機號碼格式不正確', (value) => {
      if (!value) return true // 沒有值就不驗證
      return /^09\d{8}$/.test(value)
    })
    .nullable(),

  // 純選填欄位
  englishName: yup.string().nullable(),
  gender: yup.string().nullable(),
  birthDate: yup.date().nullable(),
  permanentAddress: yup.string().nullable(),
  contactAddress: yup.string().nullable(),
  emergencyName: yup.string().nullable(),
  emergencyCellphone: yup.string().nullable(),
  emergencyRelationship: yup.string().nullable(),
  company: yup.mixed()
    .transform((value) => {
      return value === '' ? null : value
    })
    .nullable(),
  department: yup.mixed()
    .transform((value) => {
      return value === '' ? null : value
    })
    .nullable(),
  jobTitle: yup.string().nullable(),
  salary: yup.string().nullable(),
  extNumber: yup.string().nullable(),
  seatDescription: yup.string().nullable(),
  note: yup.string().nullable()
})

// ===== 表單初始化 =====
const { handleSubmit: handleTempUserSubmit, isSubmitting: istempUserSubmitting, resetForm } = useForm({
  validationSchema: tempUserSchema,
  initialValues: {
    name: '',
    englishName: '',
    personalEmail: '',
    IDNumber: '',
    gender: '',
    cellphone: '',
    birthDate: null,
    permanentAddress: '',
    contactAddress: '',
    emergencyName: '',
    emergencyCellphone: '',
    emergencyRelationship: '',
    company: '',
    department: '',
    jobTitle: '',
    salary: '',
    extNumber: '',
    effectiveDate: null,
    status: '待面試',
    seatDescription: '',
    note: ''
  }
})

// ===== 表單欄位 =====
const name = useField('name')
const englishName = useField('englishName')
const personalEmail = useField('personalEmail')
const IDNumber = useField('IDNumber')
const gender = useField('gender')
const cellphone = useField('cellphone')
const birthDate = useField('birthDate')
const permanentAddress = useField('permanentAddress')
const contactAddress = useField('contactAddress')
const emergencyName = useField('emergencyName')
const emergencyCellphone = useField('emergencyCellphone')
const emergencyRelationship = useField('emergencyRelationship')
const company = useField('company')
const department = useField('department')
const jobTitle = useField('jobTitle')
const salary = useField('salary')
const extNumber = useField('extNumber')
const effectiveDate = useField('effectiveDate')
const status = useField('status')
const seatDescription = useField('seatDescription')
const note = useField('note')

// ===== 方法 =====
const copyPermanentAddress = () => {
  if (permanentAddress.value.value) {
    contactAddress.value.value = permanentAddress.value.value
  }
}

const hasChanges = computed(() => {
  if (!isEditing.value || !tempDialog.value?.originalData) return true

  const currentValues = {
    name: name.value.value,
    englishName: englishName.value.value,
    personalEmail: personalEmail.value.value,
    IDNumber: IDNumber.value.value,
    gender: gender.value.value,
    cellphone: cellphone.value.value,
    birthDate: birthDate.value.value,
    permanentAddress: permanentAddress.value.value,
    contactAddress: contactAddress.value.value,
    emergencyName: emergencyName.value.value,
    emergencyCellphone: emergencyCellphone.value.value,
    emergencyRelationship: emergencyRelationship.value.value,
    company: company.value.value,
    department: department.value.value,
    jobTitle: jobTitle.value.value,
    salary: salary.value.value,
    extNumber: extNumber.value.value,
    effectiveDate: effectiveDate.value.value,
    status: status.value.value,
    seatDescription: seatDescription.value.value,
    note: note.value.value
  }

  const originalData = tempDialog.value.originalData

  return Object.entries(currentValues).some(([key, value]) => {
    if (key === 'birthDate' || key === 'effectiveDate') {
      const originalDate = originalData[key] ? new Date(originalData[key]).toISOString() : null
      const currentDate = value ? new Date(value).toISOString() : null
      return originalDate !== currentDate
    }
    return originalData[key] !== value
  })
})

const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const handleCompanyChange = async (selectedCompanyId) => {
  try {
    // 先設置公司 ID
    if (tempDialog.value.open) {
      selectedCompany.value = selectedCompanyId
    } else {
      searchCriteria.value = {
        ...searchCriteria.value,
        companyId: selectedCompanyId,
        department: ''
      }
    }

    // 如果沒有選擇公司，清空部門列表並返回
    if (!selectedCompanyId) {
      filteredDepartments.value = []
      return
    }

    // 獲取部門列表
    const { data } = await apiAuth.get('/department/all', {
      params: {
        companyId: selectedCompanyId,
        itemsPerPage: 100 // 確保獲取所有部門
      }
    })

    if (data.success) {
      // 確保從正確的位置獲取部門數據
      filteredDepartments.value = data.result?.data || []
    } else {
      console.warn('找不到該公司的部門')
      filteredDepartments.value = []
    }
  } catch (error) {
    console.error('載入部門失敗:', error)
    createSnackbar({
      text: '載入部門資料失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
    filteredDepartments.value = []
  }
}

const loadCompanies = async () => {
  try {
    const { data } = await apiAuth.get('/company/all')
    if (data.success) {
      companies.value = data.result
    }
  } catch (error) {
    console.error('載入公司列表失敗:', error)
    createSnackbar({
      text: '載入公司列表失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

const performSearch = async () => {
  tableLoading.value = true
  console.log('Selected date range:', searchCriteria.value.effectiveDate)

  try {
    const params = {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'createdAt',
      sortOrder: tableSortBy.value[0]?.order || 'desc',
      quickSearch: quickSearchText.value,
      ...searchCriteria.value,
      department: searchCriteria.value.department
    }

    // 处理生效日期范围搜索
    if (searchCriteria.value.effectiveDate && searchCriteria.value.effectiveDate.length > 0) {
      params.effectiveStartDate = searchCriteria.value.effectiveDate[0].toISOString()
      params.effectiveEndDate = searchCriteria.value.effectiveDate.length > 1
        ? searchCriteria.value.effectiveDate[searchCriteria.value.effectiveDate.length - 1].toISOString()
        : params.effectiveStartDate // 如果只有一个日期，开始和结束日期相同
    }

    console.log('Query params:', params)

    const { data } = await apiAuth.get('/tempUser/all', { params })

    if (data.success) {
      tableItems.value = data.result.data
      tableItemsLength.value = data.result.totalItems
    }
  } catch (error) {
    console.error('搜索失败:', error)
    createSnackbar({
      text: error?.response?.data?.message || '搜索失败',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    tableLoading.value = false
  }
}
const resetSearch = () => {
  searchCriteria.value = {
    status: '',
    companyId: '',
    department: '',
    effectiveDate: null
  }
  quickSearchText.value = ''
  performSearch()
}

const submitTemp = handleTempUserSubmit(async (values) => {
  try {
    // 處理資料，移除空值的 company 和 department
    const processedValues = {
      ...values,
      company: values.company || undefined,
      department: values.department || undefined
    }

    if (tempDialog.value.id) {
      await apiAuth.patch(`/tempUser/${tempDialog.value.id}`, processedValues)
    } else {
      await apiAuth.post('/tempUser', processedValues)
    }
    await tableLoadItems(true)
    closeTempDialog()
    createSnackbar({
      text: tempDialog.value.id ? '更新成功' : '新增成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '操作失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
})

// ===== Dialog操作 =====
const openTempDialog = async (item) => {
  tempDialog.value = {
    open: true,
    id: item?._id || '',
    originalData: item ? { ...item } : null
  }

  isInitializingStatus.value = true

  if (item) {
    isEditing.value = true

    // 處理公司和部門資料
    if (item.company) {
      selectedCompany.value = item.company._id
      company.value.value = item.company._id

      // 等待部門資料載入完成
      await handleCompanyChange(item.company._id)

      // 確保部門資料載入後再設置部門值
      if (item.department && item.department._id) {
        department.value.value = item.department._id
      }
    }

    name.value.value = item.name
    englishName.value.value = item.englishName
    personalEmail.value.value = item.personalEmail
    IDNumber.value.value = item.IDNumber
    gender.value.value = item.gender
    cellphone.value.value = item.cellphone
    birthDate.value.value = item.birthDate ? new Date(item.birthDate) : null
    permanentAddress.value.value = item.permanentAddress
    contactAddress.value.value = item.contactAddress
    emergencyName.value.value = item.emergencyName
    emergencyCellphone.value.value = item.emergencyCellphone
    emergencyRelationship.value.value = item.emergencyRelationship
    jobTitle.value.value = item.jobTitle
    salary.value.value = item.salary
    extNumber.value.value = item.extNumber
    effectiveDate.value.value = item.effectiveDate ? new Date(item.effectiveDate) : null
    status.value.value = item.status
    seatDescription.value.value = item.seatDescription
    note.value.value = item.note
  } else {
    isEditing.value = false
    selectedCompany.value = null
    filteredDepartments.value = []
    resetForm()
  }
  setTimeout(() => {
    isInitializingStatus.value = false
  }, 300)
}

const closeTempDialog = () => {
  tempDialog.value.open = false
  selectedCompany.value = null
  filteredDepartments.value = []
  resetForm()
}

const confirmDeleteDialog = ref(false)

const deleteUser = async () => {
  try {
    await apiAuth.delete(`/tempUser/${tempDialog.value.id}`)
    await tableLoadItems(true)
    closeTempDialog()
    confirmDeleteDialog.value = false
    createSnackbar({
      text: '刪除成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })
  } catch (error) {
    createSnackbar({
      text: error?.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// ===== 生命週期 =====
onMounted(async () => {
  await performSearch()
  await loadCompanies()
})

// ===== 監聽器 =====
watch(quickSearchText, debounce(() => {
  performSearch()
}, 300))

// 監聽 selectedCompany 變更
watch(selectedCompany, async (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    company.value.value = newVal
    department.value.value = ''
    await handleCompanyChange(newVal)
  } else {
    company.value.value = null
    department.value.value = ''
    filteredDepartments.value = []
  }
})

// 監聽搜尋條件中的公司變更
watch(() => searchCriteria.value.companyId, async (newVal) => {
  if (newVal) {
    await handleCompanyChange(newVal)
  } else {
    filteredDepartments.value = []
  }
})

// 監聽公司欄位值變更
watch(company.value, (newVal) => {
  if (newVal && newVal.value !== null && newVal.value !== undefined) {
    selectedCompany.value = newVal.value
  }
})
</script>

<style lang="scss" scoped>
@import '/src/styles/settings.scss';

:deep(.header-bg) {
  background-color: #455A64;
  color: white;
}

.odd-row {
  background-color: #f9f9f9;
}

.even-row {
  background-color: rgb(255, 250, 240);
}

.info-title {
  text-align: center;
  letter-spacing: 2px;
  font-size: 14px;
  font-weight: 900;
}

@include md {
  .info-title {
    text-align: center;
    letter-spacing: 4px;
    font-size: 15px;
  }
}
</style>
