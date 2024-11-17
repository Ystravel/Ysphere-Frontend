<template>
  <v-container
    max-width="2500"
  >
    <!-- 上方圖表與統計資訊區域 -->
    <v-row
      class="rounded-xl py-0 mt-2 ma-sm-1 ma-md-6"
    >
      <!-- 左側圖表，固定寬度 -->
      <v-col
        v-if="xlAndUp"
        class="ps-4 py-0"
      >
        <EmployeeDoughnut ref="chartRef" />
      </v-col>

      <!-- 右側統計資訊，自適應寬度 -->
      <!-- 員工流動趨勢圖-->
      <v-col
        v-if="mdAndUp"
        class="ps-4 py-0"
      >
        <EmployeeTurnoverChart ref="turnoverChartRef" />
      </v-col>

      <!-- 生日提醒 -->
      <v-col
        v-if="isLgmUp"
        class="ps-4 py-0"
      >
        <BirthdayReminder ref="birthdayReminderRef" />
      </v-col>
      <!-- 搜尋條件卡片 -->
      <v-col
        class="pa-0 mb-6 mb-sm-0"
      >
        <v-card
          class="d-flex mx-3 mx-sm-4 px-4 pt-2 pt-sm-5 pb-4 pb-sm-8 "
          elevation="4"
          rounded="xl"
          height="100%"
        >
          <v-card-text class="d-flex align-center">
            <v-row class="h-100">
              <!-- 搜尋條件區域 -->
              <v-col
                cols="12"
                class="d-flex flex-column justify-center "
              >
                <v-row>
                  <h6
                    style="font-size: 16px;"
                    class="ps-3 mb-3"
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

                  <!-- 部門選擇 -->
                  <v-col
                    cols="12"
                    sm="6"
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
                </v-row>
                <v-row>
                  <!-- 身分別選擇 -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-select
                      v-model="searchCriteria.role"
                      :items="roles"
                      label="身分別"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                  <!-- 任職狀態選擇 -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-select
                      v-model="searchCriteria.employmentStatus"
                      :items="employmentStatuses"
                      label="任職狀態"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <!-- 性別選擇 -->
                  <v-col
                    cols="6"
                    class="pe-0"
                  >
                    <div class="d-flex flex-column gap-2">
                      <label class="text-grey-darken-1 search-label">性別</label>
                      <v-chip-group
                        v-model="searchCriteria.gender"
                        column
                        class="custom-chip-group "
                      >
                        <v-chip
                          filter
                          variant="outlined"
                          color="blue-grey-darken-2"
                          :value="'男性'"
                          label
                        >
                          男性
                        </v-chip>
                        <v-chip
                          filter
                          variant="outlined"
                          color="blue-grey-darken-2"
                          :value="'女性'"
                          label
                        >
                          女性
                        </v-chip>
                      </v-chip-group>
                    </div>
                  </v-col>

                  <!-- 領隊證選擇 -->
                  <v-col
                    cols="6"
                  >
                    <div class="d-flex flex-column gap-2">
                      <label class="text-grey-darken-1 search-label">領隊證</label>
                      <v-chip-group
                        v-model="searchCriteria.guideLicense"
                        column
                        class="custom-chip-group"
                      >
                        <v-chip
                          filter
                          variant="outlined"
                          :value="true"
                          color="blue-grey-darken-2"
                          label
                        >
                          有
                        </v-chip>
                        <v-chip
                          filter
                          variant="outlined"
                          :value="false"
                          color="blue-grey-darken-2"
                          label
                        >
                          無
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
                        <!-- 重置按鈕 -->

                        <v-btn
                          color="grey"
                          block
                          @click="resetSearch"
                        >
                          <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col>
                        <!-- 搜尋按鈕 -->
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
                <!-- 搜尋按鈕區域 -->
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      class="elevation-4 rounded-xl py-4 py-sm-8 px-1 px-sm-10 mt-2 mt-sm-10 mx-0 mx-sm-4 mx-md-10 mb-4 bg-white"
    >
      <v-col
        cols="12"
        class="ps-3 pb-6"
      >
        <h3>
          員工管理
        </h3>
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
                  新增使用者
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
                      v-tooltip:start="'可搜尋員編、姓名、Email、手機、分機、職稱、備註'"
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
                  <td>{{ item.userId }}</td>
                  <td>{{ item.name }}</td>
                  <td v-if="lgAndUp">
                    {{ item.email }}
                  </td>
                  <td v-if="lgAndUp">
                    {{ item.cellphone }}
                  </td>
                  <td v-if="mdAndUp">
                    {{ getCompanyName(item.department.companyId) }}
                  </td>
                  <td v-if="mdAndUp">
                    {{ item.department.name }}
                  </td>
                  <td>{{ item.extNumber }}</td>
                  <td v-if="smAndUp">
                    {{ getRoleTitle(item.role) }}
                  </td>
                  <td v-if="xlAndUp">
                    {{ item.employmentStatus }}
                  </td>
                  <td>
                    <v-btn
                      icon
                      color="light-blue-darken-4"
                      variant="plain"
                      width="28"
                      height="48"
                      :size="buttonSize"
                      :ripple="false"
                      @click="openDialog(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <!-- 新增或編輯dialog -->
  <v-dialog
    v-model="dialog.open"
    persistent
    :width="dialogWidth"
  >
    <v-form
      :disabled="isSubmitting"
      @submit.prevent="submit"
    >
      <v-card class="rounded-lg px-4 py-6">
        <div class="card-title ps-4 py-3">
          {{ dialog.id ? '員工資料編輯' : '新增員工' }}
        </div>
        <v-row class="py-4">
          <v-col
            cols="4"
            md="5"
            class="d-flex align-center ps-6 "
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
                label="*英文名"
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
                label="*身分證號碼"
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
                label="*生日"
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
                :item-title="genderOptions.title"
                :item-value="genderOptions.value"
                label="*性別"
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
                label="*手機號碼"
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
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                label="*Email"
                type="email"
                variant="outlined"
                density="compact"
                clearable
                autocomplete="username"
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
                label="*戶籍地址"
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
                label="*聯絡地址"
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
            <v-col
              v-if="mdAndUp && !lgAndUp"
              cols="6"
            />
            <v-col
              cols="12"
              sm="6"
              md="4"
              class="pb-0"
            >
              <v-text-field
                v-model="emergencyName.value.value"
                :error-messages="emergencyName.errorMessage.value"
                label="*緊急聯絡人姓名"
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
                label="*緊急聯絡人電話"
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
                  class="info-title text-blue-grey-darken-2 "
                >
                  任職資訊
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
            <v-col
              v-if="isEditing"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="userId.value.value"
                :error-messages="userId.errorMessage.value"
                label="*員工編號"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="4"
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
                :items="Object.entries(companyNames).map(([id, name]) => ({ title: name, value: Number(id) }))"
                label="*所屬公司"
                item-title="title"
                item-value="value"
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
                v-model="department.value.value"
                :items="filteredDepartments"
                :error-messages="department.errorMessage.value"
                item-title="name"
                item-value="_id"
                label="*選擇部門"
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
                label="*職稱"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              v-if="user.isHR || user.isSuperAdmin"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-text-field
                v-model="salary.value.value"
                :error-messages="salary.errorMessage.value"
                label="*基本薪資"
                type="text"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              v-if="user.isHR || user.isSuperAdmin"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-select
                v-model="role.value.value"
                :error-messages="role.errorMessage.value"
                :items="roles"
                item-title="title"
                item-value="value"
                label="*權限"
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
                v-model="hireDate.value.value"
                :error-messages="hireDate.errorMessage.value"
                label="*入職日期"
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
              <v-text-field
                v-model="extNumber.value.value"
                :error-messages="extNumber.errorMessage.value"
                label="*分機號碼"
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
                v-model="printNumber.value.value"
                :error-messages="printNumber.errorMessage.value"
                label="*列印編號"
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
              <v-select
                v-model="guideLicense.value.value"
                :items="guideLicenseOptions"
                :error-messages="guideLicense.errorMessage.value"
                label="領隊證"
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
              <v-select
                v-model="employmentStatus.value.value"
                :error-messages="employmentStatus.errorMessage.value"
                :items="employmentStatuses"
                item-title="title"
                item-value="value"
                label="*任職狀態"
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
            <v-col
              v-if="resignationDate.value.value"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="pb-0"
            >
              <v-date-input
                v-model="resignationDate.value.value"
                label="離職日期"
                prepend-icon
                variant="outlined"
                density="compact"
                clearable
                :cancel-text="'取消'"
                :ok-text="'確認'"
              />
            </v-col>
          </v-row>

          <v-row v-if="!dialog.id">
            <v-col
              cols="12"
              sm="6"
              class="pb-0"
            >
              <v-text-field
                v-model="password.value.value"
                :error-messages="password.errorMessage.value"
                label="*密碼"
                variant="outlined"
                density="compact"
                clearable
                autocomplete="new-password"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              class="pb-0"
            >
              <v-text-field
                v-model="passwordConfirm.value.value"
                :error-messages="passwordConfirm.errorMessage.value"
                label="*確認密碼"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :append-inner-icon="showPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                density="compact"
                clearable
                autocomplete="new-password"
                @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions
          class="px-3 mt-4"
        >
          <v-hover>
            <template #default="{ isHovering, props}">
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
  <!-- 離職日期對話框取消時重置任職狀態 -->
  <ResignationDateDialog
    v-model="resignationDateDialog"
    @confirm="(date) => { resignationDate.value.value = date }"
    @cancel="employmentStatus.value.value = '在職'"
  />

  <!-- 在組件最後添加確認刪除對話框 -->
  <ConfirmDeleteDialogWithTextField
    v-model="confirmDeleteDialog"
    title="確認刪除員工"
    :message="`確定要刪除員工「${originalData?.name || ''}」(${originalData?.userId || ''}) 嗎？ 此操作無法復原。`"
    :expected-name="originalData?.name || ''"
    input-label="員工姓名"
    @confirm="deleteUser"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { debounce } from 'lodash'
import * as yup from 'yup'
import { definePage } from 'vue-router/auto'
import { useForm, useField } from 'vee-validate'
import { useDisplay } from 'vuetify'
import { useUserStore } from '@/stores/user'
import UserRole, { roleNames } from '@/enums/UserRole'
import { companyNames } from '@/enums/Company'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import EmployeeDoughnut from '../components/EmployeeDoughnut.vue'
import ResignationDateDialog from '../components/ResignationDateDialog.vue'
import ConfirmDeleteDialogWithTextField from '@/components/ConfirmDeleteDialogWithTextField.vue'
import EmployeeTurnoverChart from '../components/EmployeeTurnoverChart.vue'
import BirthdayReminder from '../components/BirthdayReminder.vue'

// ===== 頁面設定 =====
definePage({
  meta: {
    title: '員工管理 | ysphere',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.HR, UserRole.ADMIN]
  }
})

// ===== API 與 Store 初始化 =====
const { apiAuth } = useApi()
const user = useUserStore()
const createSnackbar = useSnackbar()

// ===== 響應式設定與螢幕斷點 =====
const { smAndUp, mdAndUp, lgAndUp, xlAndUp, name: currentBreakpoint, width } = useDisplay()
const isLgmUp = computed(() => width.value >= 1520)
const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})

// ===== 基礎狀態管理 =====
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const isEditing = ref(false)
const originalData = ref(null)
const currentPage = ref(1)
const confirmDeleteDialog = ref(false)
const headerProps = {
  class: 'header-bg'
}
const resignationDateDialog = ref(false)
const chartRef = ref(null)
const lastValidIDNumber = ref('')
const isInitialLoad = ref(false)
const isInitializingStatus = ref(false)
const dialog = ref({
  open: false,
  id: ''
})
const turnoverChartRef = ref(null)
const birthdayReminderRef = ref(null)

// ===== 選項列表設定 =====
const companyList = ref(
  Object.entries(companyNames).map(([id, name]) => ({
    title: name,
    value: Number(id)
  }))
)

const selectedCompany = ref(1)
const filteredDepartments = ref([])
const departments = ref([])

const roles = ref(
  Object.entries(roleNames).map(([value, title]) => ({
    value: Number(value),
    title
  }))
)

const employmentStatuses = ref([
  { title: '在職', value: '在職' },
  { title: '離職', value: '離職' },
  { title: '退休', value: '退休' },
  { title: '留職停薪', value: '留職停薪' }
])

const genderOptions = ref([
  { title: '男性', value: '男性' },
  { title: '女性', value: '女性' }
])

const guideLicenseOptions = ref([
  { title: '有', value: true },
  { title: '無', value: false }
])

// ===== 對話框設定 =====
const dialogWidth = computed(() => {
  if (xlAndUp.value) return '1200'
  if (lgAndUp.value) return '900'
  if (mdAndUp.value) return '800'
  if (smAndUp.value) return '600'
  return '100%'
})

// ===== 表單驗證架構 =====
const userSchema = yup.object({
  email: yup
    .string()
    .required('請輸入email')
    .email('請輸入正確的 email 格式'),
  name: yup
    .string()
    .required('請輸入姓名'),
  englishName: yup
    .string()
    .required('請輸入英文名'),
  gender: yup
    .string()
    .required('請選擇姓別'),
  IDNumber: yup
    .string()
    .matches(/^[A-Za-z][12]\d{8}$/, '身分證號碼格式錯誤')
    .required('請輸入身分證號碼'),
  permanentAddress: yup
    .string()
    .required('請輸入戶籍地址'),
  contactAddress: yup
    .string()
    .required('請輸入聯絡地址'),
  birthDate: yup
    .date()
    .nullable()
    .required('請選擇生日'),
  company: yup
    .number()
    .nullable()
    .required('請選擇公司'),
  department: yup
    .string()
    .required('請選擇部門'),
  cellphone: yup
    .string()
    .min(10, '手機號碼需為10位數字')
    .max(10, '手機號碼勿超過10位數字')
    .required('請輸入手機號碼'),
  salary: yup
    .string()
    .required('請輸入基本薪資'),
  extNumber: yup
    .string()
    .required('請輸入分機號碼'),
  printNumber: yup
    .string()
    .required('請輸入列印編號'),
  guideLicense: yup
    .boolean(),
  jobTitle: yup
    .string()
    .required('請輸入職稱'),
  role: yup
    .number()
    .required('請選擇使用者身分別'),
  employmentStatus: yup
    .string()
    .required('請選擇任職狀態'),
  hireDate: yup
    .date()
    .nullable()
    .required('請選擇入職日期'),
  resignationDate: yup
    .date()
    .nullable(),
  emergencyName: yup
    .string()
    .required('請輸入緊急聯絡人姓名'),
  emergencyCellphone: yup
    .string()
    .required('請輸入緊急聯絡人連絡電話'),
  emergencyRelationship: yup
    .string(),
  note: yup
    .string(),
  userId: yup
    .string(),
  password: yup
    .string()
    .test('password', '請輸入密碼', function (value) {
      if (!isEditing.value) {
        return !!value
      }
      return true
    })
    .test('password-length', '密碼至少需輸入8個字', function (value) {
      if (!isEditing.value && value) {
        return value.length >= 8
      }
      return true
    }),
  passwordConfirm: yup
    .string()
    .test('passwordConfirm', '請再次輸入密碼', function (value) {
      if (!isEditing.value) {
        return !!value
      }
      return true
    })
    .test('passwords-match', '密碼不一致', function (value) {
      if (!isEditing.value) {
        return value === this.parent.password
      }
      return true
    })
})

// ===== 表單初始化與欄位設定 =====
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: userSchema,
  initialValues: {
    email: '',
    name: '',
    englishName: '',
    gender: '',
    IDNumber: '',
    permanentAddress: '',
    contactAddress: '',
    birthDate: null,
    company: 1,
    department: '',
    cellphone: '',
    salary: '',
    extNumber: '',
    printNumber: '',
    guideLicense: false,
    jobTitle: '',
    role: 0,
    employmentStatus: '在職',
    hireDate: new Date(),
    resignationDate: null,
    emergencyName: '',
    emergencyCellphone: '',
    emergencyRelationship: '',
    note: '',
    userId: '',
    password: '',
    passwordConfirm: ''
  },
  validateOnMount: false,
  validateOnChange: true,
  validateOnBlur: true,
  validateOnInput: false,
  context: computed(() => ({
    isEditing: isEditing.value
  }))
})

// ===== 表單欄位定義 =====
const email = useField('email')
const name = useField('name')
const englishName = useField('englishName')
const gender = useField('gender')
const IDNumber = useField('IDNumber')
const permanentAddress = useField('permanentAddress')
const contactAddress = useField('contactAddress')
const birthDate = useField('birthDate')
const company = useField('company')
const department = useField('department', undefined, {
  validateOnValueUpdate: false
})
const cellphone = useField('cellphone')
const salary = useField('salary')
const extNumber = useField('extNumber')
const printNumber = useField('printNumber')
const guideLicense = useField('guideLicense')
const jobTitle = useField('jobTitle')
const role = useField('role')
const employmentStatus = useField('employmentStatus')
const hireDate = useField('hireDate')
const resignationDate = useField('resignationDate')
const emergencyName = useField('emergencyName')
const emergencyCellphone = useField('emergencyCellphone')
const emergencyRelationship = useField('emergencyRelationship', undefined, {
  validateOnValueUpdate: false,
  transform: (value) => value ?? ''
})
const note = useField('note', undefined, {
  validateOnValueUpdate: false,
  transform: (value) => value ?? ''
})
const userId = useField('userId', undefined, {
  validateOnValueUpdate: false,
  transform: (value) => value ?? ''
})
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')

// ===== 表格相關設定 =====
const tableItemsPerPage = ref(10)
const tableSortBy = ref([
  { key: 'userId', order: 'asc' }
])
const tablePage = ref(1)
const tableItems = ref([])
const tableKey = ref(0)
const tableHeaders = [
  { title: '員編', align: 'left', sortable: true, key: 'userId' },
  { title: '姓名', align: 'left', sortable: true, key: 'name' },
  { title: 'Email', align: 'left', sortable: true, key: 'email' },
  { title: '手機', align: 'left', sortable: true, key: 'cellphone' },
  { title: '所屬公司', align: 'left', sortable: true, key: 'department.companyId' },
  { title: '部門', align: 'left', sortable: true, key: 'department.name' },
  { title: '分機', align: 'left', sortable: true, key: 'extNumber' },
  { title: '身分別', align: 'left', sortable: true, key: 'role' },
  { title: '狀態', align: 'left', sortable: true, key: 'employmentStatus' },
  { title: '操作', align: 'left', sortable: false, key: 'action' }
]

const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableSearch = ref('')

// ===== 搜尋相關設定 =====
const searchCriteria = ref({
  role: '',
  companyId: '',
  department: '',
  gender: '',
  guideLicense: '',
  employmentStatus: ''
})

const quickSearchText = ref('')

// ===== 輔助函數 =====
const getCompanyName = (companyId) => {
  return companyNames[companyId] || '未知公司'
}

const getRoleTitle = (roleValue) => {
  return roleNames[roleValue] || '未知'
}

const formatToDate = (dateString) => {
  return dateString ? new Date(dateString) : null
}

// ===== 權限檢查 =====
const hasEditPermission = computed(() => {
  return user.isSuperAdmin || user.isHR || user.isAdmin
})

// ===== 響應式表格抬頭設定 =====
const filteredHeaders = computed(() => {
  if (['xl', 'xxl'].includes(currentBreakpoint.value)) {
    return tableHeaders
  }
  if (['lg'].includes(currentBreakpoint.value)) {
    return tableHeaders.filter(header => header.key !== 'employmentStatus')
  }
  if (['md'].includes(currentBreakpoint.value)) {
    return tableHeaders.filter(header => header.key !== 'cellphone' && header.key !== 'email' && header.key !== 'employmentStatus')
  }
  if (['sm'].includes(currentBreakpoint.value)) {
    return tableHeaders.filter(header => header.key !== 'department.companyId' && header.key !== 'department.name' && header.key !== 'cellphone' && header.key !== 'email' && header.key !== 'employmentStatus')
  }
  return tableHeaders.filter(header => header.key !== 'department.companyId' && header.key !== 'department.name' && header.key !== 'cellphone' && header.key !== 'email' && header.key !== 'role' && header.key !== 'employmentStatus')
})

// ===== API 相關函數 =====
// 載入部門列表
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

// 獲取特定公司的部門
const fetchDepartments = async () => {
  if (!selectedCompany.value) {
    filteredDepartments.value = []
    return
  }

  try {
    const response = await apiAuth.get('/department/all', {
      params: { companyId: selectedCompany.value }
    })

    if (response.data && response.data.result && response.data.result.data) {
      filteredDepartments.value = response.data.result.data.filter(
        dept => dept.companyId === selectedCompany.value
      )
    } else {
      console.warn('No departments found for selected company.')
      filteredDepartments.value = []
    }
  } catch (error) {
    console.error('部門加載失敗:', error)
    filteredDepartments.value = []
  }
}

// ===== 表格操作函數 =====
const tableLoadItems = async (reset, page) => {
  if (reset) {
    tablePage.value = 1
  } else if (page) {
    tablePage.value = page
  }
  await performSearch()
}

// 搜尋相關函數
const performSearch = async (fromQuickSearch = false) => {
  tableLoading.value = true
  try {
    const params = {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'userId',
      sortOrder: tableSortBy.value[0]?.order || 'asc',
      ...Object.fromEntries(
        Object.entries(searchCriteria.value).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined
        )
      )
    }

    if (fromQuickSearch) {
      params.quickSearch = quickSearchText.value
    }

    const response = await apiAuth.get('/user/all', { params })

    if (response.data.success) {
      const { data: users, totalItems } = response.data.result
      tableItems.value = users
      tableItemsLength.value = totalItems

      const maxPage = Math.ceil(totalItems / tableItemsPerPage.value)
      if (tablePage.value > maxPage) {
        tablePage.value = Math.max(1, maxPage)
      }
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    console.error('搜尋失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '搜尋時發生錯誤',
      snackbarProps: { color: 'error' }
    })
    tableItems.value = []
    tableItemsLength.value = 0
  } finally {
    tableLoading.value = false
  }
}

// ===== 表單操作函數 =====
const submit = handleSubmit(async (values) => {
  try {
    if (isEditing.value) {
      const currentPageNumber = tablePage.value

      const { data: updateResponse } = await apiAuth.patch(`/user/${dialog.value.id}`, {
        email: values.email,
        name: values.name,
        englishName: values.englishName,
        gender: values.gender,
        IDNumber: values.IDNumber,
        permanentAddress: values.permanentAddress,
        contactAddress: values.contactAddress,
        birthDate: values.birthDate,
        company: values.company,
        department: values.department,
        cellphone: values.cellphone,
        salary: values.salary,
        extNumber: values.extNumber,
        printNumber: values.printNumber,
        guideLicense: values.guideLicense,
        jobTitle: values.jobTitle,
        role: values.role,
        employmentStatus: values.employmentStatus,
        hireDate: values.hireDate,
        resignationDate: values.resignationDate,
        emergencyName: values.emergencyName,
        emergencyCellphone: values.emergencyCellphone,
        emergencyRelationship: values.emergencyRelationship,
        note: values.note,
        userId: values.userId
      })

      const { data: departmentResponse } = await apiAuth.get(`/department/${values.department}`)

      const index = tableItems.value.findIndex(item => item._id === dialog.value.id)
      if (index !== -1) {
        tableItems.value[index] = {
          ...updateResponse.result,
          department: departmentResponse.result
        }
      }

      localStorage.setItem('userTablePage', currentPageNumber.toString())
      await tableLoadItems(false, currentPageNumber)

      await chartRef.value?.refreshChart()
      await turnoverChartRef.value?.refreshChart()
      await birthdayReminderRef.value?.refreshData()

      createSnackbar({
        text: '員工資料更新成功',
        snackbarProps: {
          color: 'teal-lighten-1'
        }
      })
    } else {
      await apiAuth.post('/user', {
        email: values.email,
        name: values.name,
        englishName: values.englishName,
        gender: values.gender,
        IDNumber: values.IDNumber,
        permanentAddress: values.permanentAddress,
        contactAddress: values.contactAddress,
        birthDate: values.birthDate,
        company: values.company,
        department: values.department,
        cellphone: values.cellphone,
        salary: values.salary,
        extNumber: values.extNumber,
        printNumber: values.printNumber,
        guideLicense: values.guideLicense,
        jobTitle: values.jobTitle,
        role: values.role,
        employmentStatus: values.employmentStatus,
        hireDate: values.hireDate,
        resignationDate: values.resignationDate,
        emergencyName: values.emergencyName,
        emergencyCellphone: values.emergencyCellphone,
        emergencyRelationship: values.emergencyRelationship,
        note: values.note,
        userId: values.userId,
        password: values.password
      })

      localStorage.setItem('userTablePage', '1')
      await tableLoadItems(true)

      await chartRef.value?.refreshChart()
      await turnoverChartRef.value?.refreshChart()
      await birthdayReminderRef.value?.refreshData()

      createSnackbar({
        text: '員工新增成功',
        snackbarProps: {
          color: 'teal-lighten-1'
        }
      })
    }

    closeDialog()
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: error?.response?.data?.message || '發生錯誤',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
  }
})

// ===== 對話框操作函數 =====
const openDialog = (item) => {
  isInitializingStatus.value = true
  isInitialLoad.value = true

  if (!hasEditPermission.value) {
    createSnackbar({
      text: '權限不足',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
    return
  }

  currentPage.value = tablePage.value
  if (item) {
    isEditing.value = true
    dialog.value.id = item._id
    employmentStatus.value.value = item.employmentStatus
    localStorage.setItem('userTablePage', tablePage.value.toString())

    originalData.value = {
      email: item.email,
      name: item.name,
      englishName: item.englishName,
      gender: item.gender,
      IDNumber: item.IDNumber,
      permanentAddress: item.permanentAddress,
      contactAddress: item.contactAddress,
      birthDate: formatToDate(item.birthDate),
      company: item.department?.companyId || 1,
      department: item.department?._id,
      cellphone: item.cellphone,
      salary: item.salary,
      extNumber: item.extNumber,
      printNumber: item.printNumber,
      guideLicense: item.guideLicense,
      jobTitle: item.jobTitle,
      role: item.role,
      employmentStatus: item.employmentStatus,
      hireDate: formatToDate(item.hireDate),
      resignationDate: formatToDate(item.resignationDate),
      emergencyName: item.emergencyName,
      emergencyCellphone: item.emergencyCellphone,
      emergencyRelationship: item.emergencyRelationship ?? '',
      note: item.note ?? '',
      userId: item.userId ?? ''
    }

    // 設置表單值
    email.value.value = item.email
    name.value.value = item.name
    englishName.value.value = item.englishName
    gender.value.value = item.gender
    IDNumber.value.value = item.IDNumber
    permanentAddress.value.value = item.permanentAddress
    contactAddress.value.value = item.contactAddress
    birthDate.value.value = formatToDate(item.birthDate)
    hireDate.value.value = formatToDate(item.hireDate)
    resignationDate.value.value = formatToDate(item.resignationDate)
    selectedCompany.value = item.department?.companyId || 1
    fetchDepartments().then(() => {
      department.value.value = item.department?._id
    })
    cellphone.value.value = item.cellphone
    salary.value.value = item.salary
    extNumber.value.value = item.extNumber
    printNumber.value.value = item.printNumber
    guideLicense.value.value = item.guideLicense
    jobTitle.value.value = item.jobTitle
    role.value.value = item.role
    employmentStatus.value.value = item.employmentStatus
    emergencyName.value.value = item.emergencyName
    emergencyCellphone.value.value = item.emergencyCellphone
    emergencyRelationship.value.value = item.emergencyRelationship ?? ''
    note.value.value = item.note ?? ''
    userId.value.value = item.userId ?? ''
  } else {
    isEditing.value = false
    dialog.value.id = ''
    originalData.value = null
    selectedCompany.value = 1
    fetchDepartments()
    resetForm()
    hireDate.value.value = new Date()
  }
  dialog.value.open = true
  setTimeout(() => {
    isInitializingStatus.value = false
    isInitialLoad.value = false
  }, 300)
}

const closeDialog = () => {
  dialog.value.open = false
  selectedCompany.value = null
  filteredDepartments.value = []
  originalData.value = null
  resetForm()
}

// ===== 刪除用戶函數 =====
const deleteUser = async () => {
  try {
    tableLoading.value = true
    await apiAuth.delete(`/user/${dialog.value.id}`)

    closeDialog()
    await tableLoadItems(true)
    await chartRef.value?.refreshChart()
    await turnoverChartRef.value?.refreshChart()
    await birthdayReminderRef.value?.refreshData()

    createSnackbar({
      text: '員工刪除成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })
  } catch (error) {
    console.error('Delete user error:', error)
    createSnackbar({
      text: error?.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    tableLoading.value = false
    confirmDeleteDialog.value = false
  }
}

// ===== 工具函數 =====
const copyPermanentAddress = () => {
  if (permanentAddress.value.value) {
    contactAddress.value.value = permanentAddress.value.value
  }
}

const onUpdatePage = (page) => {
  if (page < 1) page = 1
  const maxPage = Math.ceil(tableItemsLength.value / tableItemsPerPage.value)
  if (page > maxPage) page = maxPage

  if (tablePage.value !== page) {
    tablePage.value = page
    localStorage.removeItem('userTablePage')
    tableLoadItems(false)
  }
}

const resetSearch = () => {
  searchCriteria.value = {
    role: '',
    companyId: '',
    department: '',
    gender: '',
    guideLicense: '',
    employmentStatus: ''
  }
  filteredDepartments.value = []
  tableSearch.value = ''
  performSearch()
}

// ===== 計算屬性 =====
const hasChanges = computed(() => {
  if (!isEditing.value) return true
  if (!originalData.value) return false

  const currentValues = {
    email: email.value.value,
    name: name.value.value,
    englishName: englishName.value.value,
    gender: gender.value.value,
    IDNumber: IDNumber.value.value,
    permanentAddress: permanentAddress.value.value,
    contactAddress: contactAddress.value.value,
    birthDate: birthDate.value.value,
    company: selectedCompany.value,
    department: department.value.value,
    cellphone: cellphone.value.value,
    salary: salary.value.value,
    extNumber: extNumber.value.value,
    printNumber: printNumber.value.value,
    guideLicense: guideLicense.value.value,
    jobTitle: jobTitle.value.value,
    role: role.value.value,
    employmentStatus: employmentStatus.value.value,
    hireDate: hireDate.value.value,
    resignationDate: resignationDate.value.value,
    emergencyName: emergencyName.value.value,
    emergencyCellphone: emergencyCellphone.value.value,
    emergencyRelationship: emergencyRelationship.value.value ?? '',
    note: note.value.value ?? '',
    userId: userId.value.value ?? ''
  }

  return Object.keys(originalData.value).some(key => {
    if (['note', 'emergencyRelationship'].includes(key)) {
      const originalValue = originalData.value[key] ?? ''
      const currentValue = currentValues[key] ?? ''
      return originalValue !== currentValue
    }

    if (key === 'birthDate' || key === 'hireDate' || key === 'resignationDate') {
      const originalDate = originalData.value[key] ? new Date(originalData.value[key]).toISOString() : null
      const currentDate = currentValues[key] ? new Date(currentValues[key]).toISOString() : null
      return originalDate !== currentDate
    }

    return originalData.value[key] !== currentValues[key]
  })
})

// ===== 監聽器 =====
// 公司變更處理
const handleCompanyChange = async (companyId) => {
  try {
    if (companyId) {
      const response = await apiAuth.get('/department/all', {
        params: { companyId }
      })
      if (response.data?.result?.data) {
        filteredDepartments.value = response.data.result.data
        const currentDepartment = filteredDepartments.value.find(
          dept => dept._id === searchCriteria.value.department
        )
        if (!currentDepartment) {
          searchCriteria.value.department = ''
        }
      }
    } else {
      searchCriteria.value.department = ''
      filteredDepartments.value = []
    }
  } catch (error) {
    console.error('載入部門失敗:', error)
    createSnackbar({
      text: '載入部門資料失敗',
      snackbarProps: { color: 'error' }
    })
  }
}

const debouncedSearch = debounce((value) => {
  tableLoadItems(true)
}, 300)

const debouncedQuickSearch = debounce((value) => {
  tablePage.value = 1
  performSearch(true)
}, 300)

watch(quickSearchText, (newVal) => {
  debouncedQuickSearch(newVal)
})

watch(selectedCompany, async (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    company.value.value = newVal
    department.value.value = null
    await fetchDepartments()
  } else {
    company.value.value = null
    department.value.value = null
    filteredDepartments.value = []
  }
})

watch(company.value, (newVal) => {
  if (newVal && newVal.value !== null && newVal.value !== undefined) {
    selectedCompany.value = newVal.value
  }
})

watch(employmentStatus.value, (newVal) => {
  if (isInitializingStatus.value) return
  if (newVal === '離職') {
    resignationDateDialog.value = true
  } else {
    resignationDateDialog.value = false
    resignationDate.value.value = null
  }
})

watch(() => IDNumber.value.value, (newVal) => {
  if (!newVal) {
    gender.value.value = null
    lastValidIDNumber.value = ''
    return
  }

  if (newVal.length === 10 && newVal !== lastValidIDNumber.value && !isInitialLoad.value) {
    const idNumberRegex = /^[A-Za-z][12]\d{8}$/
    if (idNumberRegex.test(newVal)) {
      const secondDigit = newVal.charAt(1)
      if (secondDigit === '1') {
        gender.value.value = '男性'
        lastValidIDNumber.value = newVal
        createSnackbar({
          text: '已自動設定性別為男性',
          snackbarProps: {
            color: 'teal-lighten-1',
            timeout: 1000
          }
        })
      } else if (secondDigit === '2') {
        gender.value.value = '女性'
        lastValidIDNumber.value = newVal
        createSnackbar({
          text: '已自動設定性別為女性',
          snackbarProps: {
            color: 'teal-lighten-1',
            timeout: 1000
          }
        })
      }
    }
  }
})

// ===== 生命週期鉤子 =====
onMounted(async () => {
  const storedPage = localStorage.getItem('userTablePage')
  if (storedPage) {
    tablePage.value = parseInt(storedPage)
    tableKey.value++
  }

  await loadDepartments()
  await fetchDepartments()
  await performSearch()
})

onMounted(() => {
  const storedPage = localStorage.getItem('userTablePage')
  if (storedPage && parseInt(storedPage) > 0) {
    tablePage.value = parseInt(storedPage)
    tableKey.value++
    localStorage.removeItem('userTablePage')
  } else {
    tablePage.value = 1
  }
})

onUnmounted(() => {
  debouncedSearch.cancel()
  debouncedQuickSearch.cancel()
})
</script>

<style lang="scss" scoped>
@import '/src/styles/settings.scss';

:deep(.header-bg)  {
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
