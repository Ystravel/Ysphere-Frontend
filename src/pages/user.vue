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

      <!-- 生日提醒
      <v-col
        v-if="isLgmUp"
        class="ps-4 py-0"
      >
        <BirthdayReminder ref="birthdayReminderRef" />
      </v-col> -->
      <!-- 搜尋條件卡片 -->
      <v-col
        class="pa-0 mb-6 mb-sm-0"
      >
        <v-card
          class="d-flex mx-3 mx-sm-4 px-4 pt-2 pt-sm-5 pb-4 pb-sm-5 "
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
                  <!-- 身分別選擇 -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-select
                      v-model="searchCriteria.dateType"
                      :items="dateTypes"
                      label="日期類型"
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
                    <v-date-input
                      v-model="searchCriteria.dateRange"
                      label="日期區間"
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
                    cols="6"
                    class="pe-0 py-0"
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
                  <!-- <v-col
                    cols="6"
                    class="py-0"
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
                  </v-col> -->
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
                          @click="() => {
                            console.log('Current search criteria:', searchCriteria.value);
                            performSearch();
                          }"
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
                      v-tooltip:start="'可搜尋員編、姓名、公司Email、手機、分機、職稱、備註'"
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
                    {{ item.company?.name || '' }}
                  </td>
                  <td v-if="mdAndUp">
                    {{ item.department?.name || '' }}
                  </td>
                  <td>{{ item.extNumber }}</td>
                  <td v-if="smAndUp">
                    {{ getRoleTitle(item.role) }}
                  </td>
                  <td v-if="xlAndUp">
                    {{ item.employmentStatus }}
                  </td>
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

                    <!-- 添加密碼重置按鈕 -->
                    <v-btn
                      v-if="item.isFirstLogin"
                      v-tooltip="'發送初始密碼'"
                      icon
                      color="teal-darken-1"
                      variant="plain"
                      width="28"
                      class="ms-2"
                      :size="buttonSize"
                      :ripple="false"
                      @click="openResetPasswordDialog(item)"
                    >
                      <v-icon>mdi-key-variant</v-icon>
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

  <!-- 添加密碼重置確認對話框 -->
  <v-dialog
    v-model="resetPasswordDialog.open"
    persistent
    max-width="360"
  >
    <v-card class="rounded-lg pa-4">
      <div class="card-title pa-4">
        發送初始密碼
      </div>
      <div class="list-content ps-4 py-3 mb-4">
        確定要發送系統生成的初始密碼給 <span
          style="font-weight: 800;"
          class="text-cyan-darken-2"
        >{{ resetPasswordDialog.userName }}</span> 嗎？
      </div>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn
          color="grey"
          variant="outlined"
          :size="buttonSize"
          @click="closeResetPasswordDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="teal-darken-1"
          variant="outlined"
          :size="buttonSize"
          :loading="resetPasswordDialog.loading"
          @click="sendInitialPassword"
        >
          確認發送
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
      <v-card
        class="rounded-lg px-4 py-6"
      >
        <div class="card-title ps-4 py-3">
          {{ dialog.id ? '員工資料編輯' : '新增員工' }}
        </div>

        <!-- Tab Menu -->
        <div class="mb-4">
          <v-tabs
            v-model="activeTab"
            color="blue-grey-darken-2"
            align-tabs="center"
            mobile-breakpoint="sm"
            density="compact"
            height="40"
          >
            <v-tab
              value="basic"
              class="tab-title"
            >
              <v-icon start>
                mdi-account-outline
              </v-icon>
              個人資訊
            </v-tab>
            <v-tab
              value="employment"
              class="tab-title"
            >
              <v-icon start>
                mdi-briefcase-outline
              </v-icon>
              任職資訊
            </v-tab>
            <v-tab
              value="insurance"
              class="tab-title"
            >
              <v-icon start>
                mdi-shield-account-outline
              </v-icon>
              保險及薪轉資訊
            </v-tab>
          </v-tabs>
        </div>
        <!-- Loading State -->
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

        <!-- Content Tabs -->
        <v-tabs-window
          v-else
          v-model="activeTab"
          class="overflow-y-auto mx-1"
        >
          <!-- 個人資訊 Tab -->
          <v-tabs-window-item
            value="basic"
          >
            <v-card-text class="mt-3 pa-3">
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="2"
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
                  lg="2"
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
                  lg="2"
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
                  lg="2"
                  class="pb-0"
                >
                  <v-select
                    v-model="gender.value.value"
                    :items="genderOptions"
                    :error-messages="gender.errorMessage.value"
                    label="*性別"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="2"
                  class="pb-0"
                >
                  <v-select
                    v-model="disabilityStatus.value.value"
                    :error-messages="disabilityStatus.errorMessage.value"
                    :items="disabilityStatusOptions"
                    item-title="title"
                    item-value="value"
                    label="身心障礙身份"
                    variant="outlined"
                    density="compact"
                    clearable
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="2"
                  class="pb-0"
                >
                  <v-select
                    v-model="indigenousStatus.value.value"
                    :error-messages="indigenousStatus.errorMessage.value"
                    :items="indigenousStatusOptions"
                    item-title="title"
                    item-value="value"
                    label="原住民身份"
                    variant="outlined"
                    density="compact"
                    clearable
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="2"
                  class="pb-0"
                >
                  <v-date-input
                    v-model="birthDate.value.value"
                    :error-messages="birthDate.errorMessage.value"
                    label="*生日"
                    prepend-icon
                    variant="outlined"
                    density="compact"
                    :hint="birthDateROC"
                    persistent-hint
                    clearable
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="birthDate.value.value = null"
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="2"
                  class="pb-0"
                >
                  <v-text-field
                    v-model="phoneNumber.value.value"
                    :error-messages="phoneNumber.errorMessage.value"
                    label="室內電話"
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
                  lg="2"
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
                  md="6"
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
                        <template #activator="{tprops }">
                          <v-icon
                            v-bind="tprops"
                            icon="mdi-content-copy"
                            @click="copyPermanentAddress"
                          />
                        </template>
                        複製戶籍地址
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-row class="d-flex align-center my-2">
                    <v-col cols="4">
                      <v-divider />
                    </v-col>
                    <v-col
                      cols="4"
                      class="text-blue-grey-darken-1 info-title"
                    >
                      緊急連絡人資訊
                    </v-col>
                    <v-col cols="4">
                      <v-divider />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
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
                  lg="3"
                  class="pb-0"
                >
                  <v-text-field
                    v-model="emergencyPhoneNumber.value.value"
                    :error-messages="emergencyPhoneNumber.errorMessage.value"
                    label="緊急聯絡人室內電話"
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
                    v-model="emergencyCellphone.value.value"
                    :error-messages="emergencyCellphone.errorMessage.value"
                    label="緊急聯絡人手機"
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
          </v-tabs-window-item>

          <!-- 任職資訊 Tab -->
          <v-tabs-window-item
            value="employment"
          >
            <v-card-text class="mt-3 pa-3">
              <v-row>
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
                    :items="companyOptions"
                    label="*所屬公司"
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
                    label="職稱"
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
                    :hint="hireDateROC"
                    persistent-hint
                    clearable
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="hireDate.value.value = null"
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
                    persistent-hint
                    clearable
                    :hint="resignationDateROC"
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="resignationDate.value.value = null"
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
                    label="分機號碼"
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
                    label="列印編號"
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
                    label="基本薪資"
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
                    v-model="tourManager.value.value"
                    :error-messages="tourManager.errorMessage.value"
                    :items="tourManagerOptions"
                    item-title="title"
                    item-value="value"
                    label="旅遊經理人"
                    variant="outlined"
                    density="compact"
                    clearable
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="8"
                  lg="6"
                  class="pb-0"
                >
                  <GuideLicenseSelection
                    v-model="guideLicense.value.value"
                    :error-messages="guideLicense.errorMessage.value"
                  />
                </v-col>

                <v-col cols="12">
                  <v-row class="d-flex align-center my-2">
                    <v-col cols="4">
                      <v-divider />
                    </v-col>
                    <v-col
                      cols="4"
                      class="text-blue-grey-darken-1 info-title"
                    >
                      系統帳號資訊
                    </v-col>
                    <v-col cols="4">
                      <v-divider />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  class="pb-0"
                >
                  <v-text-field
                    v-model="email.value.value"
                    :error-messages="email.errorMessage.value"
                    label="公司Email"
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
                  md="4"
                  lg="3"
                  class="pb-0"
                >
                  <v-text-field
                    v-model="cowellAccount.value.value"
                    :error-messages="cowellAccount.errorMessage.value"
                    label="科威帳號"
                    :type="showCowellAccount ? 'text' : 'password'"
                    :append-inner-icon="showCowellAccount ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    density="compact"
                    clearable
                    autocomplete="new-password"
                    @click:append-inner="showCowellAccount = !showCowellAccount"
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
                    v-model="cowellPassword.value.value"
                    :error-messages="cowellPassword.errorMessage.value"
                    label="科威密碼"
                    :type="showCowellPassword ? 'text' : 'password'"
                    :append-inner-icon="showCowellPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    density="compact"
                    clearable
                    autocomplete="new-password"
                    @click:append-inner="showCowellPassword = !showCowellPassword"
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
                    v-model="YSRCAccount.value.value"
                    :error-messages="YSRCAccount.errorMessage.value"
                    label="YSRC帳號"
                    :type="showYSRCAccount ? 'text' : 'password'"
                    :append-inner-icon="showYSRCAccount ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    density="compact"
                    clearable
                    autocomplete="new-password"
                    @click:append-inner="showYSRCAccount = !showYSRCAccount"
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
                    v-model="YSRCPassword.value.value"
                    :error-messages="YSRCPassword.errorMessage.value"
                    label="YSRC密碼"
                    :type="showYSRCPassword ? 'text' : 'password'"
                    :append-inner-icon="showYSRCPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    density="compact"
                    clearable
                    autocomplete="new-password"
                    @click:append-inner="showYSRCPassword = !showYSRCPassword"
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
                    v-model="YS168Account.value.value"
                    :error-messages="YS168Account.errorMessage.value"
                    label="YS168帳號"
                    :type="showYS168Account ? 'text' : 'password'"
                    :append-inner-icon="showYS168Account ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    density="compact"
                    clearable
                    autocomplete="new-password"
                    @click:append-inner="showYS168Account = !showYS168Account"
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
                    v-model="YS168Password.value.value"
                    :error-messages="YS168Password.errorMessage.value"
                    label="YS168密碼"
                    :type="showYS168Password ? 'text' : 'password'"
                    :append-inner-icon="showYS168Password ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    density="compact"
                    clearable
                    autocomplete="new-password"
                    @click:append-inner="showYS168Password = !showYS168Password"
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
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
          </v-tabs-window-item>

          <!-- 保險資訊 Tab -->
          <v-tabs-window-item value="insurance">
            <v-card-text class="mt-3 pa-3">
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  class="pb-0"
                >
                  <v-date-input
                    v-model="healthInsuranceStartDate.value.value"
                    :error-messages="healthInsuranceStartDate.errorMessage.value"
                    label="健保加保日期"
                    prepend-icon
                    variant="outlined"
                    density="compact"
                    persistent-hint
                    clearable
                    :hint="healthInsuranceStartDateROC"
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="healthInsuranceStartDate.value.value = null"
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
                    v-model="healthInsuranceEndDate.value.value"
                    :error-messages="healthInsuranceEndDate.errorMessage.value"
                    label="健保退保日期"
                    prepend-icon
                    variant="outlined"
                    density="compact"
                    persistent-hint
                    clearable
                    :hint="healthInsuranceEndDateROC"
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="healthInsuranceEndDate.value.value = null"
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
                    v-model="laborInsuranceStartDate.value.value"
                    :error-messages="laborInsuranceStartDate.errorMessage.value"
                    label="勞保加保日期"
                    prepend-icon
                    variant="outlined"
                    density="compact"
                    persistent-hint
                    clearable
                    :hint="laborInsuranceStartDateROC"
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="laborInsuranceStartDate.value.value = null"
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
                    v-model="laborInsuranceEndDate.value.value"
                    :error-messages="laborInsuranceEndDate.errorMessage.value"
                    label="勞保退保日期"
                    prepend-icon
                    variant="outlined"
                    density="compact"
                    persistent-hint
                    clearable
                    :hint="laborInsuranceEndDateROC"
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="laborInsuranceEndDate.value.value = null"
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
                    v-model="voluntaryPensionRate.value.value"
                    :error-messages="voluntaryPensionRate.errorMessage.value"
                    :items="voluntaryPensionRateOptions"
                    item-title="title"
                    item-value="value"
                    label="勞退自提比率"
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
                    v-model="voluntaryPensionStartDate.value.value"
                    :error-messages="voluntaryPensionStartDate.errorMessage.value"
                    label="勞退自提加保日期"
                    prepend-icon
                    variant="outlined"
                    density="compact"
                    persistent-hint
                    clearable
                    :hint="voluntaryPensionStartDateROC"
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="voluntaryPensionStartDate.value.value = null"
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
                    v-model="voluntaryPensionEndDate.value.value"
                    :error-messages="voluntaryPensionEndDate.errorMessage.value"
                    label="勞保自提退保日期"
                    prepend-icon
                    variant="outlined"
                    density="compact"
                    persistent-hint
                    clearable
                    :hint="voluntaryPensionEndDateROC"
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="voluntaryPensionEndDate.value.value = null"
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  class="pb-0"
                >
                  <v-text-field
                    v-model="salaryBank.value.value"
                    :error-messages="salaryBank.errorMessage.value"
                    label="薪轉銀行"
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
                    v-model="salaryBankBranch.value.value"
                    :error-messages="salaryBankBranch.errorMessage.value"
                    label="薪轉分行"
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
                    v-model="salaryAccountNumber.value.value"
                    :error-messages="salaryAccountNumber.errorMessage.value"
                    label="薪轉帳戶號碼"
                    variant="outlined"
                    density="compact"
                    clearable
                  />
                </v-col>

                <v-col cols="12">
                  <DependentInsurance
                    v-model="dependents"
                    :errors="dependentErrors"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-tabs-window-item>
        </v-tabs-window>

        <!-- Actions -->
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
    :message="`確定要刪除員工「<span class='text-pink-lighten-1' style='font-weight: 800;'>${originalData?.name || ''}</span>」(<span class='text-pink-lighten-1' style='font-weight: 800;'> ${originalData?.userId || ''} </span>)嗎？ 此操作無法復原。`"
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
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import EmployeeDoughnut from '../components/EmployeeDoughnut.vue'
import ResignationDateDialog from '../components/ResignationDateDialog.vue'
import ConfirmDeleteDialogWithTextField from '@/components/ConfirmDeleteDialogWithTextField.vue'
import EmployeeTurnoverChart from '../components/EmployeeTurnoverChart.vue'
// import BirthdayReminder from '../components/BirthdayReminder.vue'
import { useROCDate } from '@/composables/useROCDate'
import GuideLicenseSelection from '@/components/GuideLicenseSelection.vue'
import DependentInsurance from '@/components/DependentInsurance.vue'

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
const { smAndUp, mdAndUp, lgAndUp, xlAndUp, name: currentBreakpoint } = useDisplay()
// const isLgmUp = computed(() => width.value >= 1520)
const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})
const circularSize = computed(() => {
  return smAndUp.value ? '64' : 'default'
})

// ===== 基礎狀態管理 =====
const isEditing = ref(false)
const originalData = ref(null)
const currentPage = ref(1)
const confirmDeleteDialog = ref(false)
const headerProps = {
  class: 'header-bg'
}
const dependents = ref([])
// 在其他 computed 屬性附近添加
const dependentErrors = computed(() => {
  const errors = {}
  const depInsList = dependents.value || []

  depInsList.forEach((dependent, index) => {
    if (!dependent.dependentName?.trim()) {
      errors[`dependentInsurance.${index}.dependentName`] = '請輸入受保人姓名'
    }
    if (!dependent.dependentIDNumber?.trim()) {
      errors[`dependentInsurance.${index}.dependentIDNumber`] = '請輸入身分證號碼'
    }
    if (!dependent.dependentBirthDate) {
      errors[`dependentInsurance.${index}.dependentBirthDate`] = '請選擇出生日期'
    }
  })

  return errors
})

const dateTypes = ref([
  { title: '入職日期', value: 'hireDate' },
  { title: '離職日期', value: 'resignationDate' }
])

const tourManagerOptions = [
  { title: '否', value: false },
  { title: '是', value: true }
]

const disabilityStatusOptions = [
  { title: '否', value: '否' },
  { title: '輕度', value: '輕度' },
  { title: '中度', value: '中度' }
]

const indigenousStatusOptions = [
  { title: '否', value: false },
  { title: '是', value: true }
]

const voluntaryPensionRateOptions = [
  { title: '1%', value: 1 },
  { title: '2%', value: 2 },
  { title: '3%', value: 3 },
  { title: '4%', value: 4 },
  { title: '5%', value: 5 },
  { title: '6%', value: 6 }
]

const activeTab = ref('basic')
const showCowellAccount = ref(false)
const showCowellPassword = ref(false)
const showYSRCAccount = ref(false)
const showYSRCPassword = ref(false)
const showYS168Account = ref(false)
const showYS168Password = ref(false)

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
const resetPasswordDialog = ref({
  open: false,
  userId: '',
  userName: '',
  loading: false
})

const selectedCompany = ref(null)
const filteredDepartments = ref([])
const departments = ref([])

const roles = ref(
  Object.entries(roleNames).map(([value, title]) => ({
    value: Number(value),
    title
  }))
)

const companyOptions = computed(() => {
  return [...companies.value]
    .sort((a, b) => {
      // 確保 companyId 存在
      const idA = a.companyId || ''
      const idB = b.companyId || ''
      return idA.localeCompare(idB)
    })
    .map(company => ({
      title: `${company.name}`,
      value: company._id
    }))
})

const companies = ref([])

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

// ===== 對話框設定 =====
const dialogWidth = computed(() => {
  if (xlAndUp.value) return '1280'
  if (lgAndUp.value) return '1080'
  if (mdAndUp.value) return '800'
  if (smAndUp.value) return '600'
  return '100%'
})

// ===== 表單驗證架構 =====
const dependentInsuranceSchema = yup.object({
  dependentName: yup
    .string()
    .required('請輸入受保人姓名'),
  dependentRelationship: yup
    .string(),
  dependentBirthDate: yup
    .date()
    .nullable()
    .required('請輸入受保人生日'),
  dependentIDNumber: yup
    .string()
    .matches(/^[A-Za-z][12]\d{8}$/, '身分證號碼格式錯誤')
    .required('請輸入受保人身分證號碼'),
  dependentInsuranceStartDate: yup
    .date()
    .nullable(),
  dependentInsuranceEndDate: yup
    .date()
    .nullable()
})

const userSchema = yup.object({
  email: yup
    .string()
    .email('請輸入正確的 email 格式'),
  personalEmail: yup
    .string()
    .email('請輸入正確的 email 格式')
    .nullable(),
  IDNumber: yup
    .string()
    .matches(/^[A-Za-z][12]\d{8}$/, '身分證號碼格式錯誤')
    .required('請輸入身分證號碼'),
  gender: yup
    .string()
    .required('請選擇姓別'),
  name: yup
    .string()
    .required('請輸入姓名'),
  englishName: yup
    .string()
    .nullable(),
  phoneNumber: yup
    .string()
    .nullable(),
  cellphone: yup
    .string()
    .min(10, '手機號碼需為10位數字')
    .max(10, '手機號碼勿超過10位數字')
    .nullable(),
  salary: yup
    .string()
    .nullable(),
  extNumber: yup
    .string()
    .nullable(),
  printNumber: yup
    .string()
    .nullable(),
  birthDate: yup
    .date()
    .nullable()
    .required('請選擇生日'),
  permanentAddress: yup
    .string()
    .required('請輸入戶籍地址'),
  contactAddress: yup
    .string()
    .required('請輸入聯絡地址'),
  company: yup
    .string()
    .nullable()
    .required('請選擇公司'),
  department: yup
    .string()
    .required('請選擇部門'),
  jobTitle: yup
    .string()
    .nullable(),
  role: yup
    .number()
    .required('請選擇使用者身分別'),
  cowellAccount: yup
    .string()
    .nullable(),
  cowellPassword: yup
    .string()
    .nullable(),
  userId: yup
    .string(),
  employmentStatus: yup
    .string()
    .required('請選擇任職狀態'),
  hireDate: yup
    .date()
    .required('請選擇入職日期'),
  resignationDate: yup
    .date()
    .nullable(),
  emergencyName: yup
    .string()
    .nullable(),
  emergencyPhoneNumber: yup
    .string()
    .nullable(),
  emergencyCellphone: yup
    .string()
    .nullable(),
  emergencyRelationship: yup
    .string()
    .nullable(),
  note: yup
    .string()
    .nullable(),
  healthInsuranceStartDate: yup
    .date()
    .nullable(),
  healthInsuranceEndDate: yup
    .date()
    .nullable(),
  laborInsuranceStartDate: yup
    .date()
    .nullable(),
  laborInsuranceEndDate: yup
    .date()
    .nullable(),
  salaryBank: yup
    .string()
    .nullable(),
  salaryBankBranch: yup
    .string()
    .nullable(),
  salaryAccountNumber: yup
    .string()
    .nullable(),
  guideLicense: yup
    .array()
    .of(
      yup.number().oneOf([0, 1, 2, 3, 4], '導遊證類型必須是 0, 1, 2, 3,4 之一')
    )
    .default([]),
  tourManager: yup
    .boolean(),
  YSRCAccount: yup
    .string()
    .nullable(),
  YSRCPassword: yup
    .string()
    .nullable(),
  YS168Account: yup
    .string()
    .nullable(),
  YS168Password: yup
    .string()
    .nullable(),
  disabilityStatus: yup
    .string()
    .nullable(),
  indigenousStatus: yup
    .boolean()
    .nullable(),
  voluntaryPensionRate: yup
    .number()
    .nullable() // 允許為 null
    .transform((value, originalValue) => {
      // 如果值是空字串，返回 null
      return originalValue === '' ? null : value
    }),
  voluntaryPensionStartDate: yup
    .date()
    .nullable(),
  voluntaryPensionEndDate: yup
    .date()
    .nullable(),
  dependentInsurance: yup
    .array()
    .of(dependentInsuranceSchema)
    .default([])
})

// ===== 表單初始化與欄位設定 =====
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: userSchema,
  initialValues: {
    email: '',
    personalEmail: '',
    IDNumber: '',
    gender: '',
    name: '',
    englishName: '',
    phoneNumber: '',
    cellphone: '',
    salary: '',
    extNumber: '',
    printNumber: '',
    birthDate: null,
    permanentAddress: '',
    contactAddress: '',
    company: 1,
    department: '',
    jobTitle: '',
    role: 0,
    cowellAccount: '',
    cowellPassword: '',
    userId: '',
    employmentStatus: '在職',
    hireDate: new Date(),
    resignationDate: null,
    emergencyName: '',
    emergencyPhoneNumber: '',
    emergencyCellphone: '',
    emergencyRelationship: '',
    note: '',
    healthInsuranceStartDate: null,
    healthInsuranceEndDate: null,
    laborInsuranceStartDate: null,
    laborInsuranceEndDate: null,
    salaryBank: '',
    salaryBankBranch: '',
    salaryAccountNumber: '',
    guideLicense: [],
    tourManager: false,
    YSRCAccount: '',
    YSRCPassword: '',
    YS168Account: '',
    YS168Password: '',
    disabilityStatus: '否',
    indigenousStatus: false,
    voluntaryPensionRate: null,
    voluntaryPensionStartDate: null,
    voluntaryPensionEndDate: null,
    dependentInsurance: []
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
const personalEmail = useField('personalEmail')
const IDNumber = useField('IDNumber')
const gender = useField('gender')
const name = useField('name')
const englishName = useField('englishName')
const phoneNumber = useField('phoneNumber')
const cellphone = useField('cellphone')
const salary = useField('salary')
const extNumber = useField('extNumber')
const printNumber = useField('printNumber')
const birthDate = useField('birthDate')
const permanentAddress = useField('permanentAddress')
const contactAddress = useField('contactAddress')
const company = useField('company')
const department = useField('department', undefined, {
  validateOnValueUpdate: false
})
const jobTitle = useField('jobTitle')
const role = useField('role')
const cowellAccount = useField('cowellAccount')
const cowellPassword = useField('cowellPassword')
const userId = useField('userId', undefined, {
  validateOnValueUpdate: false,
  transform: (value) => value ?? ''
})
const employmentStatus = useField('employmentStatus')
const hireDate = useField('hireDate')
const resignationDate = useField('resignationDate')
const emergencyName = useField('emergencyName')
const emergencyPhoneNumber = useField('emergencyPhoneNumber')
const emergencyCellphone = useField('emergencyCellphone')
const emergencyRelationship = useField('emergencyRelationship', undefined, {
  validateOnValueUpdate: false,
  transform: (value) => value ?? ''
})
const note = useField('note', undefined, {
  validateOnValueUpdate: false,
  transform: (value) => value ?? ''
})
const healthInsuranceStartDate = useField('healthInsuranceStartDate')
const healthInsuranceEndDate = useField('healthInsuranceEndDate')
const laborInsuranceStartDate = useField('laborInsuranceStartDate')
const laborInsuranceEndDate = useField('laborInsuranceEndDate')
const salaryBank = useField('salaryBank')
const salaryBankBranch = useField('salaryBankBranch')
const salaryAccountNumber = useField('salaryAccountNumber')
const guideLicense = useField('guideLicense')
const tourManager = useField('tourManager')
const YSRCAccount = useField('YSRCAccount')
const YSRCPassword = useField('YSRCPassword')
const YS168Account = useField('YS168Account')
const YS168Password = useField('YS168Password')
const disabilityStatus = useField('disabilityStatus')
const indigenousStatus = useField('indigenousStatus')
const voluntaryPensionRate = useField('voluntaryPensionRate')
const voluntaryPensionStartDate = useField('voluntaryPensionStartDate')
const voluntaryPensionEndDate = useField('voluntaryPensionEndDate')
const dependentInsurance = useField('dependentInsurance')

const { rocDate: birthDateROC } = useROCDate(birthDate)
const { rocDate: hireDateROC } = useROCDate(hireDate)
const { rocDate: resignationDateROC } = useROCDate(resignationDate)
const { rocDate: healthInsuranceStartDateROC } = useROCDate(healthInsuranceStartDate)
const { rocDate: healthInsuranceEndDateROC } = useROCDate(healthInsuranceEndDate)
const { rocDate: laborInsuranceStartDateROC } = useROCDate(laborInsuranceStartDate)
const { rocDate: laborInsuranceEndDateROC } = useROCDate(laborInsuranceEndDate)
const { rocDate: voluntaryPensionStartDateROC } = useROCDate(voluntaryPensionStartDate)
const { rocDate: voluntaryPensionEndDateROC } = useROCDate(voluntaryPensionEndDate)
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
  { title: '公司Email', align: 'left', sortable: true, key: 'email' },
  { title: '手機', align: 'left', sortable: true, key: 'cellphone' },
  { title: '所屬公司', align: 'left', sortable: true, key: 'company.name' },
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
  // guideLicense: '',
  employmentStatus: '',
  dateType: '',
  dateRange: []
})

const quickSearchText = ref('')

// ===== 輔助函數 =====

const getRoleTitle = (roleValue) => {
  return roleNames[roleValue] || '未知'
}

const formatToDate = (dateString) => {
  return dateString ? new Date(dateString) : null
}

// const formatDate = (date, dateType) => {
//   if (!date) return '-'
//   const d = new Date(date)
//   const pad = (n) => String(n).padStart(2, '0')
//   if (dateType === 'birthDate') {
//     return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
//   } else {
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
//   }
// }

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
    return tableHeaders.filter(header => header.key !== 'company.name' && header.key !== 'department.name' && header.key !== 'cellphone' && header.key !== 'email' && header.key !== 'employmentStatus')
  }
  return tableHeaders.filter(header => header.key !== 'company.name' && header.key !== 'department.name' && header.key !== 'cellphone' && header.key !== 'email' && header.key !== 'role' && header.key !== 'employmentStatus')
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

// 獲取特定公司的部門
const fetchDepartments = async () => {
  if (!searchCriteria.value.companyId) {
    filteredDepartments.value = []
    return
  }

  try {
    const { data } = await apiAuth.get('/department/all', {
      params: { companyId: searchCriteria.value.companyId }
    })

    // 直接使用 data.result，不需要 ?.data
    if (data.success) {
      filteredDepartments.value = data.result || []
    } else {
      console.warn('找不到該公司的部門')
      filteredDepartments.value = []
    }
  } catch (error) {
    console.error('載入部門失敗:', error)
    createSnackbar({
      text: '載入部門失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
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
const performSearch = async () => {
  tableLoading.value = true
  console.log('Selected date range:', searchCriteria.value.dateRange)

  try {
    const params = {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'userId',
      sortOrder: tableSortBy.value[0]?.order || 'asc',
      quickSearch: quickSearchText.value,
      ...searchCriteria.value,
      department: searchCriteria.value.department
    }

    // 处理日期范围搜索
    if (searchCriteria.value.dateType && searchCriteria.value.dateRange && searchCriteria.value.dateRange.length > 0) {
      params.dateType = searchCriteria.value.dateType
      params.startDate = searchCriteria.value.dateRange[0].toISOString()
      params.endDate = searchCriteria.value.dateRange[searchCriteria.value.dateRange.length - 1].toISOString()
    }

    console.log('Query params:', params)

    const { data } = await apiAuth.get('/user/search', { params })

    if (data.success) {
      tableItems.value = data.result.data
      tableItemsLength.value = data.result.totalItems
    }
  } catch (error) {
    console.error('搜索失败:', error)
    createSnackbar({
      text: error?.response?.data?.message || '搜索失败',
      snackbarProps: { color: 'error' }
    })
  } finally {
    tableLoading.value = false
  }
}

// 發送初始密碼
const sendInitialPassword = async () => {
  try {
    resetPasswordDialog.value.loading = true
    await apiAuth.post(`/user/${resetPasswordDialog.value.userId}/send-initial-password`)

    // 更新表格中的 isFirstLogin 狀態
    const userIndex = tableItems.value.findIndex(u => u._id === resetPasswordDialog.value.userId)
    if (userIndex !== -1) {
      tableItems.value[userIndex].isFirstLogin = false
    }

    createSnackbar({
      text: '初始密碼已發送成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })
    closeResetPasswordDialog()
  } catch (error) {
    console.error('發送初始密碼失敗:', error)
    createSnackbar({
      text: error?.response?.data?.message || '發送初始密碼失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    resetPasswordDialog.value.loading = false
  }
}

// ===== 表單操作函數 =====
const submit = handleSubmit(async (values) => {
  try {
    if (isEditing.value) {
      const currentPageNumber = tablePage.value

      // 確保日期欄位為 null 時也會被包含在更新數據中
      const updateData = {
        ...values,
        company: selectedCompany.value,
        healthInsuranceStartDate: values.healthInsuranceStartDate || null,
        healthInsuranceEndDate: values.healthInsuranceEndDate || null,
        laborInsuranceStartDate: values.laborInsuranceStartDate || null,
        laborInsuranceEndDate: values.laborInsuranceEndDate || null,
        voluntaryPensionStartDate: values.voluntaryPensionStartDate || null,
        voluntaryPensionEndDate: values.voluntaryPensionEndDate || null,
        birthDate: values.birthDate || null,
        hireDate: values.hireDate || null,
        resignationDate: values.resignationDate || null
      }

      // 直接使用選擇的公司 ID
      const { data: updateResponse } = await apiAuth.patch(`/user/${dialog.value.id}`, updateData)

      const index = tableItems.value.findIndex(item => item._id === dialog.value.id)
      if (index !== -1) {
        tableItems.value[index] = {
          ...updateResponse.result,
          company: companies.value.find(c => c._id === selectedCompany.value),
          department: {
            _id: values.department,
            name: filteredDepartments.value.find(d => d._id === values.department)?.name || ''
          }
        }
      }

      await tableLoadItems(false, currentPageNumber)
    } else {
      await apiAuth.post('/user', {
        ...values,
        company: selectedCompany.value
      })

      await tableLoadItems(true)
    }

    // 重新整理相關元件
    await Promise.all([
      chartRef.value?.refreshChart(),
      turnoverChartRef.value?.refreshChart(),
      birthdayReminderRef.value?.refreshData()
    ])

    // 顯示成功訊息
    createSnackbar({
      text: isEditing.value ? '員工資料更新成功' : '員工新增成功',
      snackbarProps: { color: 'teal-lighten-1' }
    })

    // 關閉對話框
    closeDialog()
  } catch (error) {
    // 錯誤處理
    const message = handleSubmitError(error)
    createSnackbar({
      text: message,
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
})

const handleSubmitError = (error) => {
  if (!error.response) return '發生錯誤'

  const errorMessages = {
    Email已註冊: 'Email已經被註冊,請使用其他Email',
    身分證號碼已註冊: '身分證號碼已經被使用,請確認是否輸入正確',
    手機號碼已註冊: '手機號碼已經被使用,請確認是否輸入正確',
    分機號碼已註冊: '分機號碼已經被使用,請使用其他號碼',
    列印編號已註冊: '列印編號已經存在,請使用其他編號',
    員工編號已註冊: '員工編號已經被使用,請重新輸入',
    科威帳號已註冊: '科威帳號已經被使用,請使用其他帳號',
    科威密碼已註冊: '科威密碼已經被使用,請使用其他密碼'
  }

  return errorMessages[error.response.data.message] || error.response.data.message
}

// ===== 對話框操作函數 =====
const openDialog = async (item) => {
  isInitializingStatus.value = true
  // 檢查權限
  if (!hasEditPermission.value) {
    createSnackbar({
      text: '權限不足',
      snackbarProps: { color: 'red-lighten-1' }
    })
    return
  }

  isInitializingStatus.value = true
  isInitialLoad.value = true
  currentPage.value = tablePage.value
  dialog.value.open = true

  if (item) {
    // 編輯模式
    isEditing.value = true
    dialog.value.id = item._id

    // 先設置公司資料
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

    // 直接設置各個表單欄位值
    // 基本資料
    email.value.value = item.email
    personalEmail.value.value = item.personalEmail
    name.value.value = item.name
    englishName.value.value = item.englishName
    gender.value.value = item.gender
    IDNumber.value.value = item.IDNumber
    phoneNumber.value.value = item.phoneNumber
    cellphone.value.value = item.cellphone
    birthDate.value.value = formatToDate(item.birthDate)
    permanentAddress.value.value = item.permanentAddress
    contactAddress.value.value = item.contactAddress
    emergencyName.value.value = item.emergencyName
    emergencyPhoneNumber.value.value = item.emergencyPhoneNumber
    emergencyCellphone.value.value = item.emergencyCellphone
    emergencyRelationship.value.value = item.emergencyRelationship ?? ''

    // 任職資訊
    userId.value.value = item.userId ?? ''
    jobTitle.value.value = item.jobTitle
    salary.value.value = item.salary
    role.value.value = item.role
    extNumber.value.value = item.extNumber
    printNumber.value.value = item.printNumber
    employmentStatus.value.value = item.employmentStatus
    hireDate.value.value = formatToDate(item.hireDate)
    resignationDate.value.value = formatToDate(item.resignationDate)
    note.value.value = item.note ?? ''

    // 系統帳號相關
    cowellAccount.value.value = item.cowellAccount
    cowellPassword.value.value = item.cowellPassword
    YSRCAccount.value.value = item.YSRCAccount
    YSRCPassword.value.value = item.YSRCPassword
    YS168Account.value.value = item.YS168Account
    YS168Password.value.value = item.YS168Password

    // 特殊身份與證照
    guideLicense.value.value = item.guideLicense
    tourManager.value.value = item.tourManager
    disabilityStatus.value.value = item.disabilityStatus
    indigenousStatus.value.value = item.indigenousStatus

    // 保險資訊
    healthInsuranceStartDate.value.value = formatToDate(item.healthInsuranceStartDate)
    healthInsuranceEndDate.value.value = formatToDate(item.healthInsuranceEndDate)
    laborInsuranceStartDate.value.value = formatToDate(item.laborInsuranceStartDate)
    laborInsuranceEndDate.value.value = formatToDate(item.laborInsuranceEndDate)
    voluntaryPensionRate.value.value = item.voluntaryPensionRate
    voluntaryPensionStartDate.value.value = formatToDate(item.voluntaryPensionStartDate)
    voluntaryPensionEndDate.value.value = formatToDate(item.voluntaryPensionEndDate)

    // 薪資帳戶資訊
    salaryBank.value.value = item.salaryBank
    salaryBankBranch.value.value = item.salaryBankBranch
    salaryAccountNumber.value.value = item.salaryAccountNumber

    // 眷屬加保資料
    dependentInsurance.value.value = item.dependentInsurance || []

    // 保存原始資料用於比對變更
    originalData.value = {
      // 基本資料
      email: item.email,
      personalEmail: item.personalEmail,
      name: item.name,
      englishName: item.englishName,
      gender: item.gender,
      IDNumber: item.IDNumber,
      phoneNumber: item.phoneNumber,
      cellphone: item.cellphone,
      birthDate: formatToDate(item.birthDate),
      permanentAddress: item.permanentAddress,
      contactAddress: item.contactAddress,
      emergencyName: item.emergencyName,
      emergencyPhoneNumber: item.emergencyPhoneNumber,
      emergencyCellphone: item.emergencyCellphone,
      emergencyRelationship: item.emergencyRelationship ?? '',

      // 任職資訊
      company: item.company?._id,
      department: item.department?._id,
      userId: item.userId ?? '',
      jobTitle: item.jobTitle,
      salary: item.salary,
      role: item.role,
      extNumber: item.extNumber,
      printNumber: item.printNumber,
      employmentStatus: item.employmentStatus,
      hireDate: formatToDate(item.hireDate),
      resignationDate: formatToDate(item.resignationDate),
      note: item.note ?? '',

      // 系統帳號相關
      cowellAccount: item.cowellAccount,
      cowellPassword: item.cowellPassword,
      YSRCAccount: item.YSRCAccount,
      YSRCPassword: item.YSRCPassword,
      YS168Account: item.YS168Account,
      YS168Password: item.YS168Password,

      // 特殊身份與證照
      guideLicense: item.guideLicense,
      tourManager: item.tourManager,
      disabilityStatus: item.disabilityStatus,
      indigenousStatus: item.indigenousStatus,

      // 保險資訊
      healthInsuranceStartDate: formatToDate(item.healthInsuranceStartDate),
      healthInsuranceEndDate: formatToDate(item.healthInsuranceEndDate),
      laborInsuranceStartDate: formatToDate(item.laborInsuranceStartDate),
      laborInsuranceEndDate: formatToDate(item.laborInsuranceEndDate),
      voluntaryPensionRate: item.voluntaryPensionRate,
      voluntaryPensionStartDate: formatToDate(item.voluntaryPensionStartDate),
      voluntaryPensionEndDate: formatToDate(item.voluntaryPensionEndDate),

      // 薪資帳戶資訊
      salaryBank: item.salaryBank,
      salaryBankBranch: item.salaryBankBranch,
      salaryAccountNumber: item.salaryAccountNumber,

      // 眷屬加保資料
      dependentInsurance: item.dependentInsurance || []
    }

    // 保存當前頁碼
    localStorage.setItem('userTablePage', tablePage.value.toString())
  } else {
    // 新增模式
    isEditing.value = false
    dialog.value.id = ''
    originalData.value = null
    selectedCompany.value = null
    filteredDepartments.value = []
    resetForm()
    hireDate.value.value = new Date()
  }

  // 延遲重置狀態旗標
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

// 開啟重置密碼對話框
const openResetPasswordDialog = (user) => {
  resetPasswordDialog.value = {
    open: true,
    userId: user._id,
    userName: user.name,
    loading: false
  }
}

// 關閉重置密碼對話框
const closeResetPasswordDialog = () => {
  resetPasswordDialog.value = {
    open: false,
    userId: '',
    userName: '',
    loading: false
  }
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
  // 重置搜尋條件
  searchCriteria.value = {
    role: '',
    companyId: '',
    department: '',
    gender: '',
    // guideLicense: '',  // 暫時不需要
    employmentStatus: '',
    dateType: '',
    dateRange: [] // 重置日期區間
  }

  // 清空部門列表
  filteredDepartments.value = []

  // 清空搜尋欄位
  tableSearch.value = ''
  quickSearchText.value = ''

  // 重置頁碼
  tablePage.value = 1

  // 重新獲取資料
  performSearch()
}

// ===== 計算屬性 =====
const hasChanges = computed(() => {
  if (!isEditing.value) return true
  if (!originalData.value) return false

  const currentValues = {
    email: email.value.value,
    personalEmail: personalEmail.value.value,
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
    userId: userId.value.value ?? '',
    cowellAccount: cowellAccount.value,
    cowellPassword: cowellPassword.value
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
const handleCompanyChange = async (selectedCompanyId) => {
  try {
    // 先設置公司 ID
    if (dialog.value.open) {
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

    console.log('正在載入公司ID的部門:', selectedCompanyId) // 新增除錯訊息

    // 獲取部門列表
    const { data } = await apiAuth.get('/department/all', {
      params: {
        companyId: selectedCompanyId,
        itemsPerPage: 100 // 確保獲取所有部門
      }
    })

    console.log('API 返回的部門數據:', data) // 新增除錯訊息

    if (data.success) {
      // 確保從正確的位置獲取部門數據
      filteredDepartments.value = data.result?.data || []

      console.log('設置過濾後的部門列表:', filteredDepartments.value) // 新增除錯訊息
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
    department.value.value = ''
    await handleCompanyChange(newVal)
  } else {
    company.value.value = null
    department.value.value = ''
    filteredDepartments.value = []
  }
})

watch(() => searchCriteria.value.companyId, async (newVal) => {
  if (newVal) {
    await handleCompanyChange(newVal)
  } else {
    filteredDepartments.value = []
  }
})

watch(() => searchCriteria.value.dateRange, (newVal) => {
  console.log('選擇的日期區間:', newVal)
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

  await loadCompanies()
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

.tab-title {
  font-weight: 600;
  font-size: 15px;
  color: #999;
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
