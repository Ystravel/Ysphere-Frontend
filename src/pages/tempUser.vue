<template>
  <v-container max-width="2500">
    <!-- 搜尋條件卡片 -->
    <v-row class="rounded-xl py-0 mt-2 ma-sm-1 ma-md-6">
      <v-col class="pa-0 mb-6 mb-sm-0">
        <v-card
          class="d-flex mx-3 mx-sm-4 px-4 pt-2 pt-sm-5 pb-4 pb-sm-5"
          elevation="4"
          rounded="xl"
        >
          <v-card-text class="d-flex align-center">
            <v-row class="h-100">
              <v-col
                cols="12"
                class="d-flex flex-column justify-center"
              >
                <v-row>
                  <h6
                    style="font-size: 16px;"
                    class="ps-3 mb-1"
                  >
                    搜尋篩選
                  </h6>
                </v-row>
                <v-row>
                  <!-- 公司選擇 -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-select
                      v-model="searchCriteria.plannedCompany"
                      :items="companyList"
                      label="預計任職公司"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      @update:model-value="handleCompanyChange"
                    />
                  </v-col>

                  <!-- 部門選擇 -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-select
                      v-model="searchCriteria.plannedDepartment"
                      :items="filteredDepartments"
                      label="預計任職部門"
                      item-title="name"
                      item-value="_id"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      :disabled="!searchCriteria.plannedCompany"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <!-- 狀態選擇 -->
                  <v-col
                    cols="12"
                    sm="6"
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
                  <!-- 日期區間選擇 -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-date-input
                      v-model="searchCriteria.effectiveDateRange"
                      label="生效日期區間"
                      variant="outlined"
                      density="compact"
                      hide-details
                      multiple="range"
                      prepend-icon
                      clearable
                      persistent-placeholder
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <!-- 性別選擇 -->
                  <v-col
                    cols="12"
                    class="py-0"
                  >
                    <div class="d-flex flex-column gap-2">
                      <label class="text-grey-darken-1 search-label">性別</label>
                      <v-chip-group
                        v-model="searchCriteria.gender"
                        column
                        class="custom-chip-group"
                      >
                        <v-chip
                          filter
                          variant="outlined"
                          color="blue-grey-darken-2"
                          value="男性"
                          label
                        >
                          男性
                        </v-chip>
                        <v-chip
                          filter
                          variant="outlined"
                          color="blue-grey-darken-2"
                          value="女性"
                          label
                        >
                          女性
                        </v-chip>
                      </v-chip-group>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    class="d-flex justify-end gap-2"
                  >
                    <v-row>
                      <v-col cols="3">
                        <v-btn
                          color="grey"
                          block
                          @click="resetSearch"
                        >
                          <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn
                          prepend-icon="mdi-magnify"
                          color="cyan-darken-2"
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
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 表格區域 -->
    <v-row class="elevation-4 rounded-xl py-4 py-sm-8 px-1 px-sm-10 mt-2 mt-sm-10 mx-0 mx-sm-4 mx-md-10 mb-4 bg-white">
      <v-col
        cols="12"
        class="ps-3 pb-6"
      >
        <h3>臨時員工管理</h3>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn
                  prepend-icon="mdi-account-plus"
                  variant="outlined"
                  color="blue-grey-darken-2"
                  @click="openDialog(null)"
                >
                  新增臨時員工
                </v-btn>
              </v-col>
              <v-col
                sm="4"
                lg="3"
                xl="2"
              >
                <v-row class="d-flex align-center">
                  <v-col
                    v-if="mdAndUp"
                    cols="2"
                    class="ps-lg-5"
                  >
                    <v-icon
                      v-tooltip:start="'可搜尋姓名、Email、手機、預計分機'"
                      icon="mdi-information"
                      size="small"
                      color="blue-grey-darken-2"
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
              v-model:items-per-page="tableItemsPerPage"
              v-model:sort-by="tableSortBy"
              :page="tablePage"
              density="compact"
              class="rounded-ts-lg rounded-te-lg py-3"
              :items-per-page-options="[10, 20, 50]"
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
                  <td>{{ item.name }}</td>
                  <td>{{ item.personalEmail }}</td>
                  <td v-if="lgAndUp">
                    {{ item.cellphone }}
                  </td>
                  <td v-if="mdAndUp">
                    {{ item.plannedCompany?.name || '' }}
                  </td>
                  <td v-if="mdAndUp">
                    {{ item.plannedDepartment?.name || '' }}
                  </td>
                  <td>{{ item.plannedExtNumber }}</td>
                  <td>{{ formatDate(item.effectiveDate) }}</td>
                  <td>{{ getStatusText(item.status) }}</td>
                  <td class="d-flex align-center overflow-hidden h-25">
                    <v-btn
                      icon
                      color="light-blue-darken-4"
                      variant="plain"
                      width="28"
                      :size="buttonSize"
                      :ripple="false"
                      @click="openDialog(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="item.status === '待入職'"
                      v-tooltip="'轉為正式員工'"
                      icon
                      color="teal-darken-1"
                      variant="plain"
                      width="28"
                      class="ms-2"
                      :size="buttonSize"
                      :ripple="false"
                      @click="openConvertDialog(item)"
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

    <!-- 編輯對話框 -->
    <v-dialog
      v-model="dialog.open"
      persistent
      :width="dialogWidth"
    >
      <v-form
        ref="form"
        :disabled="isSubmitting"
        @submit.prevent="submit"
      >
        <v-card class="rounded-lg px-4 py-6">
          <div class="card-title ps-4 py-3">
            {{ dialog.id ? '編輯臨員資料' : '新增臨員資料' }}
          </div>
          <!-- 基本資料區域 -->
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

          <v-card-text class="mt-3 pa-3">
            <!-- 基本表單欄位 -->
            <v-row>
              <!-- 姓名 -->
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
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 英文名 -->
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
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 性別 -->
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
                  label="性別"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 生日 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-date-input
                  v-model="birthDate.value.value"
                  label="生日"
                  prepend-icon
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 身分證號碼 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="IDNumber.value.value"
                  label="身分證號碼"
                  maxlength="10"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- Email -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="personalEmail.value.value"
                  :error-messages="personalEmail.errorMessage.value"
                  label="Email"
                  type="email"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 手機 -->
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
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 戶籍地址 -->
              <v-col
                cols="12"
                sm="6"
                class="pb-0"
              >
                <v-text-field
                  v-model="permanentAddress.value.value"
                  label="戶籍地址"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 聯絡地址 -->
              <v-col
                cols="12"
                sm="6"
                class="pb-0"
              >
                <v-text-field
                  v-model="contactAddress.value.value"
                  label="聯絡地址"
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

              <!-- 緊急聯絡人資料 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                class="pb-0"
              >
                <v-text-field
                  v-model="emergencyName.value.value"
                  label="緊急聯絡人姓名"
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
                  label="緊急聯絡人電話"
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
                  label="緊急聯絡人關係"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 預計任職資訊區域 -->
              <v-col
                cols="12"
                class="pa-0"
              >
                <v-row class="py-4 mb-2">
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
                    class="info-title text-blue-grey-darken-2"
                  >
                    預計任職資訊
                  </v-col>
                  <v-col
                    cols="4"
                    md="5"
                    class="d-flex align-center pe-6"
                  >
                    <v-divider />
                  </v-col>
                </v-row>
              </v-col>

              <!-- 預計任職公司 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-select
                  v-model="selectedCompany"
                  :error-messages="plannedCompany.errorMessage.value"
                  :items="companyOptions"
                  label="預計任職公司"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="handleCompanyChange"
                />
              </v-col>

              <!-- 預計任職部門 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-select
                  v-model="plannedDepartment.value.value"
                  :items="filteredDepartments"
                  :error-messages="plannedDepartment.errorMessage.value"
                  item-title="name"
                  item-value="_id"
                  label="預計任職部門"
                  variant="outlined"
                  density="compact"
                  clearable
                  :disabled="!selectedCompany"
                />
              </v-col>

              <!-- 預計職稱 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="plannedJobTitle.value.value"
                  :error-messages="plannedJobTitle.errorMessage.value"
                  label="預計職稱"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 預計薪資 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="plannedSalary.value.value"
                  :error-messages="plannedSalary.errorMessage.value"
                  label="預計薪資"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 預計分機 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="plannedExtNumber.value.value"
                  :error-messages="plannedExtNumber.errorMessage.value"
                  label="預計分機"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 生效日期 -->
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
                  label="生效日期"
                  prepend-icon
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 狀態 -->
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
                  label="狀態"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 備註 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="note.value.value"
                  label="備註"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- 座位描述 -->
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="pb-0"
              >
                <v-text-field
                  v-model="seatDescription.value.value"
                  label="座位描述"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
            </v-row>
          </v-card-text>

          <!-- 操作按鈕 -->
          <v-card-actions class="px-3 mt-4">
            <v-hover v-if="isEditing">
              <template #default="{ isHovering, props }">
                <v-btn
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
              :loading="isSubmitting"
              @click="closeDialog"
            >
              取消
            </v-btn>
            <v-btn
              color="teal-darken-1"
              variant="outlined"
              type="submit"
              class="ms-1"
              :size="buttonSize"
              :loading="isSubmitting"
              :disabled="isEditing && !hasChanges"
            >
              送出
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- 確認刪除對話框 -->
    <ConfirmDeleteDialogWithTextField
      v-model="confirmDeleteDialog"
      title="確認刪除臨員資料"
      :message="`確定要刪除「<span class='text-pink-lighten-1' style='font-weight: 800;'>${originalData?.name || ''}</span>」的資料嗎？此操作無法復原。`"
      :expected-name="originalData?.name || ''"
      input-label="姓名"
      @confirm="deleteTempUser"
    />

    <!-- 轉換為正式員工確認對話框 -->
    <v-dialog
      v-model="convertDialog.open"
      max-width="460"
    >
      <v-card class="rounded-lg pa-4">
        <div class="card-title pa-4">
          轉換為正式員工
        </div>
        <div class="list-content ps-4 py-3 mb-4">
          確定要將「<span class="text-cyan-darken-2 font-weight-bold">{{ convertDialog.name }}</span>」轉換為正式員工嗎？
          <div class="mt-2 text-grey">
            系統將自動產生員工編號、Email 和初始密碼。
          </div>
        </div>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn
            color="grey"
            variant="outlined"
            :size="buttonSize"
            @click="closeConvertDialog"
          >
            取消
          </v-btn>
          <v-btn
            color="teal-darken-1"
            variant="outlined"
            :size="buttonSize"
            :loading="convertDialog.loading"
            @click="convertToFormalUser"
          >
            確認轉換
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { debounce } from 'lodash'
import * as yup from 'yup'
import { definePage } from 'vue-router/auto'
import { useForm, useField } from 'vee-validate'
import { useDisplay } from 'vuetify'
import UserRole from '@/enums/UserRole'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import ConfirmDeleteDialogWithTextField from '@/components/ConfirmDeleteDialogWithTextField.vue'

// ===== 頁面設定 =====
definePage({
  meta: {
    title: '臨時員工資料管理 | ysphere',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.HR, UserRole.ADMIN]
  }
})

// ===== API 與 Store 初始化 =====
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

// ===== 響應式設定與螢幕斷點 =====
const { smAndUp, mdAndUp, lgAndUp } = useDisplay()

const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})

// ===== 基礎狀態管理 =====
const isEditing = ref(false)
const originalData = ref(null)
const confirmDeleteDialog = ref(false)
const headerProps = {
  class: 'header-bg'
}

const statusOptions = [
  { title: '待面試', value: '待面試' },
  { title: '待入職', value: '待入職' },
  { title: '待離職', value: '待離職' },
  { title: '待留停', value: '待留停' },
  { title: '待退休', value: '待退休' },
  { title: '已處理', value: '已處理' },
  { title: '已取消', value: '已取消' }
]

const getStatusText = (status) => {
  return statusOptions.find(option => option.value === status)?.title || status
}

const genderOptions = [
  { title: '男性', value: '男性' },
  { title: '女性', value: '女性' }
]

const dialog = ref({
  open: false,
  id: ''
})

const convertDialog = ref({
  open: false,
  id: '',
  name: '',
  loading: false
})

const selectedCompany = ref(null)
const filteredDepartments = ref([])
const departments = ref([])
const companies = ref([])

const companyList = computed(() => {
  return [
    { title: '全部', value: '' },
    ...[...companies.value]
      .sort((a, b) => {
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
      const idA = a.companyId || ''
      const idB = b.companyId || ''
      return idA.localeCompare(idB)
    })
    .map(company => ({
      title: company.name,
      value: company._id
    }))
})

// ===== 對話框設定 =====
const dialogWidth = computed(() => {
  if (lgAndUp.value) return '1200'
  if (mdAndUp.value) return '800'
  if (smAndUp.value) return '600'
  return '100%'
})

// ===== 表單驗證架構 =====
const tempUserSchema = yup.object({
  name: yup.string().required('請輸入姓名'),
  personalEmail: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .test('email', '請輸入正確的 email 格式', (value) => {
      if (!value) return true // 空值通過驗證
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
      return emailRegex.test(value)
    }),
  gender: yup.string().nullable(),
  cellphone: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .test('cellphone', '手機號碼格式不正確', (value) => {
      if (!value) return true // 空值通過驗證
      return /^\d{10}$/.test(value)
    }),
  plannedCompany: yup.string().nullable(),
  plannedDepartment: yup.string().nullable(),
  plannedJobTitle: yup.string().nullable(),
  plannedSalary: yup.string().nullable(),
  effectiveDate: yup.date().nullable(),
  status: yup
    .string()
    .oneOf(['待面試', '待入職', '待離職', '待留停', '待退休', '待處理', '已處理', '已取消'])
    .default('待入職'),
  IDNumber: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .test('IDNumber', '身分證號碼格式不正確', (value) => {
      if (!value) return true // 空值通過驗證
      return /^[A-Za-z][12]\d{8}$/.test(value)
    })
})

// ===== 表單初始化與欄位設定 =====
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: tempUserSchema,
  initialValues: {
    name: '', // 只有必填欄位保持空字串
    englishName: null,
    personalEmail: null,
    gender: null,
    cellphone: null,
    birthDate: null,
    IDNumber: null,
    permanentAddress: null,
    contactAddress: null,
    plannedCompany: null,
    plannedDepartment: null,
    plannedJobTitle: null,
    plannedSalary: null,
    plannedExtNumber: null,
    effectiveDate: null,
    status: '待入職', // 預設值保持字串
    seatDescription: null,
    note: null,
    emergencyName: null,
    emergencyCellphone: null,
    emergencyRelationship: null
  }
})

// ===== 表單欄位定義 =====
const name = useField('name')
const englishName = useField('englishName')
const personalEmail = useField('personalEmail')
const gender = useField('gender')
const cellphone = useField('cellphone')
const birthDate = useField('birthDate')
const IDNumber = useField('IDNumber')
const permanentAddress = useField('permanentAddress')
const contactAddress = useField('contactAddress')
const plannedCompany = useField('plannedCompany')
const plannedDepartment = useField('plannedDepartment')
const plannedJobTitle = useField('plannedJobTitle')
const plannedSalary = useField('plannedSalary')
const plannedExtNumber = useField('plannedExtNumber')
const effectiveDate = useField('effectiveDate')
const status = useField('status')
const seatDescription = useField('seatDescription')
const note = useField('note')
const emergencyName = useField('emergencyName')
const emergencyCellphone = useField('emergencyCellphone')
const emergencyRelationship = useField('emergencyRelationship')

// ===== 表格相關設定 =====
const tableItemsPerPage = ref(10)
const tableSortBy = ref([{ key: 'name', order: 'asc' }])
const tablePage = ref(1)
const tableItems = ref([])
const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableSearch = ref('')

const tableHeaders = [
  { title: '姓名', align: 'left', sortable: true, key: 'name' },
  { title: 'Email', align: 'left', sortable: true, key: 'personalEmail' },
  { title: '手機', align: 'left', sortable: true, key: 'cellphone' },
  { title: '預計任職公司', align: 'left', sortable: true, key: 'plannedCompany.name' },
  { title: '預計任職部門', align: 'left', sortable: true, key: 'plannedDepartment.name' },
  { title: '預計分機', align: 'left', sortable: true, key: 'plannedExtNumber' },
  { title: '生效日期', align: 'left', sortable: true, key: 'effectiveDate' },
  { title: '狀態', align: 'left', sortable: true, key: 'status' },
  { title: '操作', align: 'left', sortable: false, key: 'action' }
]

// ===== 搜尋相關設定 =====
const searchCriteria = ref({
  plannedCompany: '',
  plannedDepartment: '',
  gender: '',
  status: '',
  effectiveDateRange: []
})

const quickSearchText = ref('')

// ===== 響應式表格抬頭設定 =====
const filteredHeaders = computed(() => {
  if (lgAndUp.value) {
    return tableHeaders
  }
  if (mdAndUp.value) {
    return tableHeaders.filter(header => header.key !== 'cellphone')
  }
  return tableHeaders.filter(header =>
    !['cellphone', 'plannedCompany.name', 'plannedDepartment.name'].includes(header.key)
  )
})

const loadDepartments = async () => {
  try {
    const { data } = await apiAuth.get('/department/all')
    departments.value = data.result
  } catch (error) {
    console.error('加載部門失敗', error)
    createSnackbar({
      text: '加載部門失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 載入公司列表
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

// ===== 表格操作函數 =====
const tableLoadItems = async (reset = false) => {
  if (reset) {
    tablePage.value = 1
  }
  await performSearch()
}

// 搜尋相關函數
const performSearch = async () => {
  tableLoading.value = true
  try {
    // 構建查詢參數
    const params = {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'createdAt',
      sortOrder: tableSortBy.value[0]?.order || 'desc',
      quickSearch: quickSearchText.value || undefined
    }

    // 添加篩選條件
    if (searchCriteria.value.plannedCompany) {
      params.plannedCompany = searchCriteria.value.plannedCompany
    }
    if (searchCriteria.value.plannedDepartment) {
      params.plannedDepartment = searchCriteria.value.plannedDepartment
    }
    if (searchCriteria.value.gender) {
      params.gender = searchCriteria.value.gender
    }
    if (searchCriteria.value.status) {
      params.status = searchCriteria.value.status
    }
    if (searchCriteria.value.effectiveDateRange?.length === 2) {
      params.startDate = searchCriteria.value.effectiveDateRange[0]
      params.endDate = searchCriteria.value.effectiveDateRange[1]
    }

    const { data } = await apiAuth.get('/tempUser/all', { params })

    if (data.success) {
      tableItems.value = data.result.data
      tableItemsLength.value = data.result.totalItems
    }
  } catch (error) {
    console.error('搜尋失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '搜尋失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
    tableItems.value = []
    tableItemsLength.value = 0
  } finally {
    tableLoading.value = false
  }
}

// ===== 表單相關函數 =====
// ===== 表單相關函數 =====
const submit = handleSubmit(async (values) => {
  try {
    // 處理空值為 null，而不是空字串
    const processedValues = Object.entries(values).reduce((acc, [key, value]) => {
      // 如果是空字串，轉換為 null
      acc[key] = value === '' ? null : value
      return acc
    }, {})

    if (isEditing.value) {
      // 編輯模式
      const { data } = await apiAuth.patch(`/tempUser/${dialog.value.id}`, {
        ...processedValues,
        plannedCompany: selectedCompany.value || null,
        plannedDepartment: plannedDepartment.value.value || null
      })

      if (data.success) {
        const index = tableItems.value.findIndex(item => item._id === dialog.value.id)
        if (index !== -1) {
          tableItems.value[index] = data.result
        }

        createSnackbar({
          text: '臨時員工資料更新成功',
          snackbarProps: { color: 'teal-lighten-1' }
        })
      }
    } else {
      // 新增模式
      const { data } = await apiAuth.post('/tempUser', {
        ...processedValues,
        plannedCompany: selectedCompany.value || null,
        plannedDepartment: plannedDepartment.value.value || null
      })

      if (data.success) {
        await tableLoadItems(true)
        createSnackbar({
          text: '臨時員工資料新增成功',
          snackbarProps: { color: 'teal-lighten-1' }
        })
      }
    }

    closeDialog()
  } catch (error) {
    console.error('提交失敗:', error)
    if (error.response?.status === 400) {
      // 處理驗證錯誤
      let errorMessage = '資料驗證失敗：'
      if (error.response.data?.message) {
        errorMessage += error.response.data.message
      }
      createSnackbar({
        text: errorMessage,
        snackbarProps: { color: 'red-lighten-1' }
      })
    } else {
      createSnackbar({
        text: error?.response?.data?.message || '操作失敗',
        snackbarProps: { color: 'red-lighten-1' }
      })
    }
  }
})

// ===== 對話框操作函數 =====
const openDialog = async (item) => {
  dialog.value.open = true

  if (item) {
    // 編輯模式
    isEditing.value = true
    dialog.value.id = item._id

    if (item.plannedCompany) {
      selectedCompany.value = item.plannedCompany._id
      await handleCompanyChange(item.plannedCompany._id)
    }

    // 設置表單值
    resetForm({
      values: {
        name: item.name,
        englishName: item.englishName || '',
        personalEmail: item.personalEmail,
        gender: item.gender,
        cellphone: item.cellphone,
        birthDate: item.birthDate,
        IDNumber: item.IDNumber || '',
        permanentAddress: item.permanentAddress || '',
        contactAddress: item.contactAddress || '',
        plannedDepartment: item.plannedDepartment?._id,
        plannedJobTitle: item.plannedJobTitle,
        plannedSalary: item.plannedSalary,
        plannedExtNumber: item.plannedExtNumber || '',
        effectiveDate: item.effectiveDate,
        status: item.status,
        seatDescription: item.seatDescription || '',
        note: item.note || '',
        emergencyName: item.emergencyName || '',
        emergencyCellphone: item.emergencyCellphone || '',
        emergencyRelationship: item.emergencyRelationship || ''
      }
    })

    originalData.value = { ...item }
  } else {
    // 新增模式
    isEditing.value = false
    dialog.value.id = ''
    selectedCompany.value = null
    originalData.value = null
    filteredDepartments.value = []
    resetForm()
  }
}

const closeDialog = () => {
  dialog.value.open = false
  selectedCompany.value = null
  filteredDepartments.value = []
  originalData.value = null
  resetForm()
}

// ===== 轉換相關函數 =====
const openConvertDialog = (item) => {
  convertDialog.value = {
    open: true,
    id: item._id,
    name: item.name,
    loading: false
  }
}

const closeConvertDialog = () => {
  convertDialog.value = {
    open: false,
    id: '',
    name: '',
    loading: false
  }
}

const convertToFormalUser = async () => {
  convertDialog.value.loading = true
  try {
    const { data } = await apiAuth.post(`/tempUser/${convertDialog.value.id}/convert`)

    if (data.success) {
      createSnackbar({
        text: '成功轉換為正式員工',
        snackbarProps: { color: 'teal-lighten-1' }
      })

      await tableLoadItems()
      closeConvertDialog()
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('轉換失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || error.message || '轉換失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    convertDialog.value.loading = false
  }
}

// ===== 刪除相關函數 =====
const deleteTempUser = async () => {
  try {
    await apiAuth.delete(`/tempUser/${dialog.value.id}`)
    await tableLoadItems()

    createSnackbar({
      text: '臨時員工資料刪除成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })

    closeDialog()
  } catch (error) {
    console.error('刪除失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    confirmDeleteDialog.value = false
  }
}

// ===== 工具函數 =====
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-TW')
}

const copyPermanentAddress = () => {
  if (permanentAddress.value.value) {
    contactAddress.value.value = permanentAddress.value.value
  }
}

const onUpdatePage = (page) => {
  tablePage.value = page
  tableLoadItems()
}

const resetSearch = () => {
  searchCriteria.value = {
    plannedCompany: '',
    plannedDepartment: '',
    gender: '',
    status: '',
    effectiveDateRange: []
  }
  quickSearchText.value = ''
  filteredDepartments.value = []
  tableSearch.value = ''
  performSearch()
}

// ===== 監聽器 =====
// 公司變更處理
const handleCompanyChange = async (selectedCompanyId) => {
  try {
    if (dialog.value.open) {
      selectedCompany.value = selectedCompanyId
      plannedCompany.value.value = selectedCompanyId // 修改這裡
    } else {
      searchCriteria.value = {
        ...searchCriteria.value,
        plannedCompany: selectedCompanyId, // 修改這裡
        plannedDepartment: '' // 修改這裡
      }
    }

    if (!selectedCompanyId) {
      filteredDepartments.value = []
      return
    }

    const { data } = await apiAuth.get('/department/all', {
      params: { companyId: selectedCompanyId }
    })

    if (data.success) {
      filteredDepartments.value = data.result || []
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

// 快速搜尋防抖
const debouncedQuickSearch = debounce(() => {
  tablePage.value = 1
  performSearch()
}, 300)

// 監聽快速搜尋
watch(quickSearchText, () => {
  debouncedQuickSearch()
})

// 監聽公司選擇
watch(() => searchCriteria.value.plannedCompany, async (newVal) => {
  if (newVal) {
    await handleCompanyChange(newVal)
  } else {
    filteredDepartments.value = []
  }
})

// 監聽身分證字號自動設置性別
watch(() => IDNumber.value.value, (newVal) => {
  if (!newVal) {
    gender.value.value = null
    return
  }

  const idNumberRegex = /^[A-Za-z][12]\d{8}$/
  if (idNumberRegex.test(newVal)) {
    const secondDigit = newVal.charAt(1)
    if (secondDigit === '1') {
      gender.value.value = '男性'
    } else if (secondDigit === '2') {
      gender.value.value = '女性'
    }
  }
})

// ===== 生命週期鉤子 =====
onMounted(async () => {
  await Promise.all([
    loadCompanies(),
    loadDepartments()
  ])
  await performSearch()
})

onUnmounted(() => {
  debouncedQuickSearch.cancel()
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

.search-label {
  font-size: 13px;
  font-weight: 500;
}

@include md {
  .info-title {
    text-align: center;
    letter-spacing: 4px;
    font-size: 15px;
  }
}
</style>
