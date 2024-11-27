<template>
  <v-container
    max-width="2500"
  >
    <!-- 上方圖表與統計資訊區域 -->
    <v-row
      class="py-0 mt-2 ma-sm-1 ma-md-6"
    >
      <!-- 左側圖表，固定寬度 -->
      <v-col
        v-if="xlAndUp"
        class="ps-4 pe-6 py-0"
      >
        <EmployeeDoughnut ref="chartRef" />
      </v-col>

      <!-- 右側統計資訊，自適應寬度 -->
      <!-- 員工流動趨勢圖-->
      <v-col
        v-if="lgAndUp"
        class="ps-4 pe-6 py-0"
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
        cols="12"
        lg="6"
        xl="5"
        class="pa-0 mb-6 mb-sm-0"
      >
        <v-card
          class="d-flex mx-3 mx-sm-4 px-4 pt-2 pt-sm-3 pb-4 pb-sm-5 "
          elevation="4"
          rounded="lg"
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
                    sm="4"
                  >
                    <v-autocomplete
                      v-model="searchCriteria.companyId"
                      :items="companyList"
                      label="公司"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      :filter="(item, queryText) => {
                        const searchText = `${item.title}`.toLowerCase()
                        const query = queryText.toLowerCase()
                        return searchText.includes(query)
                      }"
                      @update:model-value="handleCompanyChange"
                    />
                  </v-col>

                  <!-- 部門選擇 -->
                  <v-col
                    cols="12"
                    sm="4"
                  >
                    <v-autocomplete
                      v-model="searchCriteria.department"
                      :items="filteredDepartments"
                      label="部門"
                      :item-title="item => item?.name && item?.departmentId ? `${item.name} (${item.departmentId})` : ''"
                      item-value="_id"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      :disabled="!searchCriteria.companyId"
                      :loading="!filteredDepartments.length && !!searchCriteria.companyId"
                      :filter="(item, queryText) => {
                        const searchText = item?.name && item?.departmentId ?
                          `${item.name} ${item.departmentId}`.toLowerCase() : ''
                        const query = queryText.toLowerCase()
                        return searchText.includes(query)
                      }"
                      no-data-text="找不到相關部門"
                    />
                  </v-col>
                  <!-- 身分別選擇 -->
                  <v-col
                    cols="12"
                    sm="4"
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
                </v-row>
                <v-row>
                  <!-- 任職狀態選擇 -->
                  <v-col
                    cols="12"
                    sm="4"
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
                  <v-col
                    cols="12"
                    sm="4"
                  >
                    <v-select
                      v-model="searchCriteria.guideLicense"
                      :items="guideLicenseOptions"
                      label="導遊領隊證"
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
                    sm="4"
                  >
                    <v-select
                      v-model="searchCriteria.disabilityStatus"
                      :items="disabilityStatusSearchOptions"
                      label="身心障礙身份"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                  <v-col
                    cols="12"
                    sm="4"
                  >
                    <v-select
                      v-model="searchCriteria.formStatus"
                      :items="formStatusSearchOptions"
                      label="表單狀態"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    />
                  </v-col>
                  <v-col>
                    <v-row class="border rounded ">
                      <v-col
                        cols="12"
                        sm="6"
                        class="pa-2"
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
                        class="pa-2"
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
                          :ok-text="'確認'"
                          :cancel-text="'取消'"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row class="mt-5">
                  <v-col
                    cols="6"
                    sm="4"
                    class="pe-0 py-0"
                  >
                    <!-- 原住民身分 v-chip-group -->
                    <div class="d-flex flex-column gap-2">
                      <label class="text-grey-darken-1 search-label">原住民身分</label>
                      <v-chip-group
                        v-model="searchCriteria.indigenousStatus"
                        column
                        class="custom-chip-group"
                      >
                        <v-chip
                          filter
                          variant="outlined"
                          color="blue-grey-darken-2"
                          value="是"
                          label
                        >
                          是
                        </v-chip>
                        <v-chip
                          filter
                          variant="outlined"
                          color="blue-grey-darken-2"
                          value="否"
                          label
                        >
                          否
                        </v-chip>
                      </v-chip-group>
                    </div>
                  </v-col>
                  <v-col
                    cols="6"
                    sm="4"
                    class="pe-0 py-0"
                  >
                    <div class="d-flex flex-column gap-2">
                      <label class="text-grey-darken-1 search-label">旅遊經理人</label>
                      <v-chip-group
                        v-model="searchCriteria.tourManager"
                        column
                        class="custom-chip-group"
                      >
                        <v-chip
                          filter
                          variant="outlined"
                          color="blue-grey-darken-2"
                          value="是"
                          label
                        >
                          是
                        </v-chip>
                        <v-chip
                          filter
                          variant="outlined"
                          color="blue-grey-darken-2"
                          value="否"
                          label
                        >
                          否
                        </v-chip>
                      </v-chip-group>
                    </div>
                  </v-col>

                  <!-- 性別選擇 -->
                  <v-col
                    cols="12"
                    sm="4"
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
                </v-row>
                <v-row>
                  <v-spacer />
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
      class="elevation-4 rounded-lg py-4 py-sm-8 px-1 px-sm-10 mt-2 mt-sm-10 mx-0 mx-sm-4 mx-md-10 mb-4 bg-white"
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
                      v-tooltip:start="'可搜尋員編、姓名、個人Email、公司Email、手機、分機、職稱、地址、備註'"
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
                  <td v-if="xlAndUp">
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
                  <td v-if="lgAndUp">
                    <v-menu>
                      <template #activator="{ props }">
                        <v-chip
                          v-tooltip="'更改表單狀態'"
                          v-bind="props"
                          :color="getFormStatusColor(item.formStatus)"
                          variant="outlined"
                          size="small"
                          label
                          :loading="item._id === updatingStatusId"
                          :disabled="item._id === updatingStatusId"
                        >
                          {{ item.formStatus }}
                        </v-chip>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="status in formStatusOptions"
                          :key="status"
                          :active="item.formStatus === status"
                          @click="updateTableFormStatus(item._id, status)"
                        >
                          <v-list-item-title>{{ status }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
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
          size="small"
          @click="closeResetPasswordDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="teal-darken-1"
          variant="outlined"
          size="small"
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
        <div class="card-title px-4 py-3 d-flex justify-space-between">
          {{ dialog.id ? '員工資料編輯' : '新增員工' }}
          <v-menu>
            <template #activator="{ props }">
              <v-chip
                v-tooltip:start="'點擊更改表單狀態'"
                v-bind="props"
                :color="getFormStatusColor(formStatus.value.value)"
                variant="outlined"
                :size="buttonSize"
                label
                class="ml-2"
                :loading="formStatusLoading"
                :disabled="formStatusLoading"
              >
                {{ formStatus.value.value }}
              </v-chip>
            </template>
            <v-list>
              <v-list-item
                v-for="status in formStatusOptions"
                :key="status"
                :active="formStatus.value.value === status"
                @click="isEditing ? updateFormStatus(status) : (formStatus.value.value = status)"
              >
                <v-list-item-title>{{ status }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
          class="mx-1 overflow-y-auto "
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
                    <v-col
                      cols="3"
                      sm="4"
                    >
                      <v-divider
                        color="blue-grey-darken-2"
                        opacity="0.3"
                      />
                    </v-col>
                    <v-col
                      cols="6"
                      sm="4"
                      class="text-blue-grey-darken-1 info-title"
                    >
                      緊急連絡人資訊
                    </v-col>
                    <v-col
                      cols="3"
                      sm="4"
                    >
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
                    maxlength="10"
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
                    clearable
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  class="pb-2"
                >
                  <v-autocomplete
                    v-model="selectedCompany"
                    :error-messages="company.errorMessage.value"
                    :items="companyOptions"
                    label="*所屬公司"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                    clearable
                    :hint="'可輸入公司編號、名稱搜尋'"
                    persistent-hint
                    :error="!!company.errorMessage.value"
                    :filter="(item, queryText) => {
                      const searchText = `${item.title}`.toLowerCase()
                      const query = queryText.toLowerCase()
                      return searchText.includes(query)
                    }"
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
                  <v-autocomplete
                    v-model="department.value.value"
                    :items="filteredDepartments"
                    :error-messages="department.errorMessage.value"
                    :item-title="item => item?.name && item?.departmentId ? `${item.name} (${item.departmentId})` : ''"
                    item-value="_id"
                    label="*選擇部門"
                    variant="outlined"
                    density="compact"
                    clearable
                    :hint="'可輸入部門編號、名稱搜尋'"
                    persistent-hint
                    :loading="!filteredDepartments.length && !!selectedCompany"
                    :filter="(item, queryText) => {
                      const searchText = item?.name && item?.departmentId ?
                        `${item.name} ${item.departmentId}`.toLowerCase() : ''
                      const query = queryText.toLowerCase()
                      return searchText.includes(query)
                    }"
                    no-data-text="找不到相關部門"
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
                  sm="6"
                  md="4"
                  lg="3"
                  class="pb-0"
                >
                  <v-date-input
                    v-model="tourismReportDate.value.value"
                    :error-messages="tourismReportDate.errorMessage.value"
                    label="觀光局申報到職日期"
                    prepend-icon
                    variant="outlined"
                    density="compact"
                    persistent-hint
                    clearable
                    :hint="tourismReportDateROC"
                    :cancel-text="'取消'"
                    :ok-text="'確認'"
                    @click:clear="tourismReportDate.value.value = null"
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
                    <v-col
                      cols="3"
                      sm="4"
                    >
                      <v-divider
                        color="blue-grey-darken-2"
                        opacity="0.3"
                      />
                    </v-col>
                    <v-col
                      cols="6"
                      sm="4"
                      class="text-blue-grey-darken-1 info-title"
                    >
                      系統帳號資訊
                    </v-col>
                    <v-col
                      cols="3"
                      sm="4"
                    >
                      <v-divider
                        color="blue-grey-darken-2"
                        opacity="0.3"
                      />
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
                    label="*公司Email"
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
                  <v-autocomplete
                    v-model="salaryBank.value.value"
                    :items="formattedBankOptions"
                    :error-messages="salaryBank.errorMessage.value"
                    label="薪轉銀行"
                    variant="outlined"
                    density="compact"
                    item-title="title"
                    item-value="value"
                    clearable
                    :hint="'可輸入銀行代碼或銀行名稱搜尋'"
                    persistent-hint
                  >
                    <template #selection="{ item }">
                      {{ item.title }}
                    </template>
                  </v-autocomplete>
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

                <v-col
                  cols="12"
                  class="mt-10"
                >
                  <v-divider
                    color="blue-grey-darken-2"
                    opacity="0.3"
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
          class="px-4 mt-4"
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
const updatingStatusId = ref('')

const formStatusLoading = ref(false)
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

const updateTableFormStatus = async (userId, newStatus) => {
  try {
    updatingStatusId.value = userId
    const { data } = await apiAuth.patch(`/user/${userId}`, {
      formStatus: newStatus
    })

    if (data.success) {
      // 更新表格中的對應行
      const index = tableItems.value.findIndex(item => item._id === userId)
      if (index !== -1) {
        tableItems.value[index].formStatus = newStatus
      }

      // 強制重新渲染表格
      tableKey.value++

      createSnackbar({
        text: '表單狀態更新成功',
        snackbarProps: { color: 'teal-lighten-1' }
      })
    } else {
      throw new Error(data.message || '更新失敗')
    }
  } catch (error) {
    console.error('更新表單狀態失敗:', error)
    createSnackbar({
      text: error.response?.data?.message || '更新表單狀態失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    updatingStatusId.value = ''
  }
}

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

const getFormStatusColor = (status) => {
  switch (status) {
    case '已完成':
      return 'green-darken-1'
    case '尚未完成':
      return 'pink-lighten-1'
    case '尚缺資料':
      return 'amber-darken-3'
    default:
      return 'grey'
  }
}

// 新增選項常數
const guideLicenseOptions = [
  { title: '華語導遊', value: 1 },
  { title: '外語導遊', value: 2 },
  { title: '華語領隊', value: 3 },
  { title: '外語領隊', value: 4 }
]

const formStatusSearchOptions = [
  { title: '尚未完成', value: '尚未完成' },
  { title: '尚缺資料', value: '尚缺資料' },
  { title: '已完成', value: '已完成' }
]

const disabilityStatusSearchOptions = [
  { title: '否', value: '否' },
  { title: '輕度', value: '輕度' },
  { title: '中度', value: '中度' }
]

const formStatusOptions = ['尚未完成', '尚缺資料', '已完成']

const bankOptions = [
  { code: '008', name: '華南商業銀行' }, // 預設銀行
  { code: '004', name: '臺灣銀行' },
  { code: '005', name: '台灣土地銀行' },
  { code: '006', name: '合作金庫銀行' },
  { code: '007', name: '第一商業銀行' },
  { code: '009', name: '彰化商業銀行' },
  { code: '010', name: '花旗(台灣)(原華僑銀行)' },
  { code: '011', name: '上海商業銀行' },
  { code: '012', name: '台北富邦銀行' },
  { code: '013', name: '國泰世華商業銀行' },
  { code: '016', name: '高雄銀行' },
  { code: '017', name: '兆豐國際商業銀行' },
  { code: '021', name: '花旗銀行' },
  { code: '024', name: '美國運通銀行' },
  { code: '025', name: '首都銀行' },
  { code: '039', name: '荷蘭銀行' },
  { code: '040', name: '中華開發' },
  { code: '050', name: '台灣中小企業銀行' },
  { code: '052', name: '渣打國際商銀(原新竹商銀)' },
  { code: '053', name: '台中商業銀行' },
  { code: '054', name: '京城商銀' },
  { code: '057', name: '台東區中小企業銀行' },
  { code: '072', name: '德意志銀行' },
  { code: '073', name: '東亞銀行' },
  { code: '081', name: '匯豐銀行' },
  { code: '101', name: '稻江商銀' },
  { code: '102', name: '華泰商業銀行' },
  { code: '103', name: '新光商業銀行' },
  { code: '108', name: '陽信商業銀行' },
  { code: '118', name: '板信商業銀行' },
  { code: '147', name: '三信商業銀行' },
  { code: '700', name: '中華郵政' },
  { code: '803', name: '聯邦商業銀行' },
  { code: '805', name: '遠東商業銀行' },
  { code: '806', name: '元大銀行' },
  { code: '807', name: '永豐銀行' },
  { code: '808', name: '玉山商業銀行' },
  { code: '809', name: '萬泰商業銀行' },
  { code: '810', name: '星展銀行' },
  { code: '812', name: '台新國際商業銀行' },
  { code: '815', name: '日盛國際商業銀行' },
  { code: '816', name: '安泰商業銀行' },
  { code: '822', name: '中國信託商業銀行' }
]

const formattedBankOptions = computed(() => {
  return bankOptions.map(bank => ({
    title: `(${bank.code}) ${bank.name}`,
    value: bank.code
  }))
})

const updateFormStatus = async (newStatus) => {
  if (formStatus.value === newStatus) return

  formStatusLoading.value = true
  try {
    const { data } = await apiAuth.patch(`/user/${dialog.value.id}`, {
      formStatus: newStatus
    })

    if (data.success) {
      // 更新本地狀態
      formStatus.value.value = newStatus

      // 更新表格中的對應行
      const index = tableItems.value.findIndex(item => item._id === dialog.value.id)
      if (index !== -1) {
        tableItems.value[index].formStatus = newStatus
      }

      // 強制重新渲染表格
      tableKey.value++

      createSnackbar({
        text: '表單狀態更新成功',
        snackbarProps: { color: 'teal-lighten-1' }
      })
    } else {
      throw new Error(data.message || '更新失敗')
    }
  } catch (error) {
    console.error('更新表單狀態失敗:', error)
    createSnackbar({
      text: error.response?.data?.message || '更新表單狀態失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    formStatusLoading.value = false
  }
}

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
      const idA = a.companyId || ''
      const idB = b.companyId || ''
      return idA.localeCompare(idB)
    })
    .map(company => ({
      title: `${company.name} (${company.companyId})`, // 修改這裡，加入公司編號
      value: company._id
    }))
})

const companies = ref([])

const companyList = computed(() => {
  return [
    ...[...companies.value]
      .sort((a, b) => {
        const idA = a.companyId || ''
        const idB = b.companyId || ''
        return idA.localeCompare(idB)
      })
      .map(company => ({
        title: `${company.name} (${company.companyId})`,
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
    .required('請輸入公司 email')
    .email('請輸入正確的 email 格式'),
  personalEmail: yup
    .string()
    .email('請輸入正確的 email 格式')
    .nullable(),
  IDNumber: yup
    .string()
    .matches(/^[A-Za-z][12]\d{8}$/, '身分證格式錯誤')
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
    .nullable()
    .test('is-valid-cellphone', '手機號碼格式錯誤', (value) => {
      if (!value) return true // 允許空值
      // 台灣手機號碼格式：09xxxxxxxx
      return /^09\d{8}$/.test(value)
    }),
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
    .required('請選擇所屬公司'),
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
    .nullable()
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
    .nullable()
    .test('is-valid-cellphone', '手機號碼格式錯誤', (value) => {
      if (!value) return true // 允許空值
      // 台灣手機號碼格式：09xxxxxxxx
      return /^09\d{8}$/.test(value)
    }),
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
    .boolean()
    .nullable(),
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
    .default([]),
  tourismReportDate: yup
    .date()
    .nullable(),
  formStatus: yup
    .string()
    .nullable()
})

// ===== 表單初始化與欄位設定 =====
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: userSchema,
  initialValues: {
    email: '',
    personalEmail: '',
    IDNumber: '',
    gender: '男性',
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
    company: '',
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
    salaryBank: '008',
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
    dependentInsurance: [],
    tourismReportDate: null,
    formStatus: '尚未完成'
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
const company = useField('company', undefined, {
  validateOnValueUpdate: true,
  validateOnChange: true
})
const department = useField('department', undefined, {
  validateOnValueUpdate: true,
  validateOnChange: true
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
const emergencyRelationship = useField('emergencyRelationship')
const note = useField('note')
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
const tourismReportDate = useField('tourismReportDate')
const formStatus = useField('formStatus')

const { rocDate: birthDateROC } = useROCDate(birthDate)
const { rocDate: hireDateROC } = useROCDate(hireDate)
const { rocDate: resignationDateROC } = useROCDate(resignationDate)
const { rocDate: healthInsuranceStartDateROC } = useROCDate(healthInsuranceStartDate)
const { rocDate: healthInsuranceEndDateROC } = useROCDate(healthInsuranceEndDate)
const { rocDate: laborInsuranceStartDateROC } = useROCDate(laborInsuranceStartDate)
const { rocDate: laborInsuranceEndDateROC } = useROCDate(laborInsuranceEndDate)
const { rocDate: voluntaryPensionStartDateROC } = useROCDate(voluntaryPensionStartDate)
const { rocDate: voluntaryPensionEndDateROC } = useROCDate(voluntaryPensionEndDate)
const { rocDate: tourismReportDateROC } = useROCDate(tourismReportDate)
// ===== 表格相關設定 =====
const tableItemsPerPage = ref(10)
const tableSortBy = ref([
  { key: 'userId', order: 'asc' }
])
const tablePage = ref(1)
const tableItems = ref([])
const tableKey = ref(0)
const tableHeaders = [
  { title: '員工編號', align: 'left', sortable: true, key: 'userId' },
  { title: '姓名', align: 'left', sortable: true, key: 'name' },
  { title: '公司Email', align: 'left', sortable: true, key: 'email' },
  { title: '手機', align: 'left', sortable: true, key: 'cellphone' },
  { title: '所屬公司', align: 'left', sortable: true, key: 'company.name' },
  { title: '部門', align: 'left', sortable: true, key: 'department.name' },
  { title: '分機', align: 'left', sortable: true, key: 'extNumber' },
  { title: '身分別', align: 'left', sortable: true, key: 'role' },
  { title: '狀態', align: 'left', sortable: true, key: 'employmentStatus' },
  { title: '表單狀態', align: 'left', sortable: true, key: 'formStatus' },
  { title: '操作', align: 'left', sortable: false, key: 'action' }
]

const tableLoading = ref(true)
const tableItemsLength = ref(0)
const tableSearch = ref('')

// ===== 搜尋相關設定 =====
const searchCriteria = ref({})

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
    return tableHeaders.filter(header => header.key !== 'employmentStatus' && header.key !== 'cellphone')
  }
  if (['md'].includes(currentBreakpoint.value)) {
    return tableHeaders.filter(header => header.key !== 'cellphone' && header.key !== 'email' && header.key !== 'employmentStatus' && header.key !== 'formStatus')
  }
  if (['sm'].includes(currentBreakpoint.value)) {
    return tableHeaders.filter(header => header.key !== 'company.name' && header.key !== 'department.name' && header.key !== 'cellphone' && header.key !== 'email' && header.key !== 'employmentStatus' && header.key !== 'formStatus')
  }
  return tableHeaders.filter(header => header.key !== 'company.name' && header.key !== 'department.name' && header.key !== 'cellphone' && header.key !== 'email' && header.key !== 'role' && header.key !== 'employmentStatus' && header.key !== 'formStatus')
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

  try {
    // 將前端的 '是'/'否' 轉換成 Boolean 值
    const convertBooleanField = (value) => {
      if (value === '是') return true
      if (value === '否') return false
      return undefined
    }

    const params = {
      page: tablePage.value,
      itemsPerPage: tableItemsPerPage.value,
      sortBy: tableSortBy.value[0]?.key || 'userId',
      sortOrder: tableSortBy.value[0]?.order || 'asc',
      quickSearch: quickSearchText.value,
      ...searchCriteria.value,
      department: searchCriteria.value.department,
      // 修改這裡：轉換成 Boolean 值
      indigenousStatus: convertBooleanField(searchCriteria.value.indigenousStatus),
      tourManager: convertBooleanField(searchCriteria.value.tourManager)
    }

    // 移除未定義的值，避免發送不必要的參數
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key]
      }
    })

    // 處理日期範圍
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
    if (!selectedCompany.value) {
      company.errorMessage.value = '請選擇公司'
      createSnackbar({
        text: '請選擇公司',
        snackbarProps: { color: 'red-lighten-1' }
      })
      return
    }

    if (isEditing.value) {
      const currentPageNumber = tablePage.value

      // 確保日期欄位為 null 時也會被包含在更新數據中
      const updateData = {
        ...values,
        company: selectedCompany.value,
        dependentInsurance: dependents.value,
        healthInsuranceStartDate: values.healthInsuranceStartDate,
        healthInsuranceEndDate: values.healthInsuranceEndDate,
        laborInsuranceStartDate: values.laborInsuranceStartDate,
        laborInsuranceEndDate: values.laborInsuranceEndDate,
        voluntaryPensionStartDate: values.voluntaryPensionStartDate,
        voluntaryPensionEndDate: values.voluntaryPensionEndDate,
        birthDate: values.birthDate,
        hireDate: values.hireDate,
        tourismReportDate: values.tourismReportDate,
        resignationDate: values.resignationDate
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
      // 在發送請求前先打印資料
      const submitData = {
        ...values,
        company: selectedCompany.value,
        dependentInsurance: dependents.value
      }

      console.log('送出的資料:', {
        // 基本資料
        email: submitData.email,
        personalEmail: submitData.personalEmail,
        name: submitData.name,
        englishName: submitData.englishName,
        gender: submitData.gender,
        IDNumber: submitData.IDNumber,
        phoneNumber: submitData.phoneNumber,
        cellphone: submitData.cellphone,
        birthDate: submitData.birthDate,

        // 地址與緊急聯絡人
        permanentAddress: submitData.permanentAddress,
        contactAddress: submitData.contactAddress,
        emergencyName: submitData.emergencyName,
        emergencyPhoneNumber: submitData.emergencyPhoneNumber,
        emergencyCellphone: submitData.emergencyCellphone,
        emergencyRelationship: submitData.emergencyRelationship,

        // 任職資訊
        company: submitData.company,
        department: submitData.department,
        jobTitle: submitData.jobTitle,
        role: submitData.role,
        employmentStatus: submitData.employmentStatus,
        hireDate: submitData.hireDate,
        salary: submitData.salary,
        formStatus: submitData.formStatus,

        // 系統相關
        extNumber: submitData.extNumber,
        printNumber: submitData.printNumber,
        cowellAccount: submitData.cowellAccount,
        cowellPassword: submitData.cowellPassword,
        YSRCAccount: submitData.YSRCAccount,
        YSRCPassword: submitData.YSRCPassword,
        YS168Account: submitData.YS168Account,
        YS168Password: submitData.YS168Password,

        // 其他資訊
        guideLicense: submitData.guideLicense,
        tourManager: submitData.tourManager,
        disabilityStatus: submitData.disabilityStatus,
        indigenousStatus: submitData.indigenousStatus,

        // 保險資訊
        healthInsuranceStartDate: submitData.healthInsuranceStartDate,
        healthInsuranceEndDate: submitData.healthInsuranceEndDate,
        laborInsuranceStartDate: submitData.laborInsuranceStartDate,
        laborInsuranceEndDate: submitData.laborInsuranceEndDate,
        voluntaryPensionRate: submitData.voluntaryPensionRate,
        voluntaryPensionStartDate: submitData.voluntaryPensionStartDate,
        voluntaryPensionEndDate: submitData.voluntaryPensionEndDate,
        tourismReportDate: submitData.tourismReportDate,

        // 薪轉資訊
        salaryBank: submitData.salaryBank,
        salaryBankBranch: submitData.salaryBankBranch,
        salaryAccountNumber: submitData.salaryAccountNumber,

        // 眷屬資訊
        dependentInsurance: submitData.dependentInsurance
      })

      // 發送請求
      await apiAuth.post('/user', submitData)
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
    emergencyRelationship.value.value = item.emergencyRelationship

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
    formStatus.value.value = item.formStatus

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
    tourismReportDate.value.value = formatToDate(item.tourismReportDate)

    // 薪資帳戶資訊
    salaryBank.value.value = item.salaryBank
    salaryBankBranch.value.value = item.salaryBankBranch
    salaryAccountNumber.value.value = item.salaryAccountNumber

    // 眷屬加保資料
    dependents.value = item.dependentInsurance || []
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
      emergencyRelationship: item.emergencyRelationship,

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
      formStatus: item.formStatus,

      // 系統帳號相關
      cowellAccount: item.cowellAccount,
      cowellPassword: item.cowellPassword,
      YSRCAccount: item.YSRCAccount,
      YSRCPassword: item.YSRCPassword,
      YS168Account: item.YS168Account,
      YS168Password: item.YS168Password,

      // 特殊身份與證照
      guideLicense: item.guideLicense ?? [],
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
      tourismReportDate: formatToDate(item.tourismReportDate),

      // 薪資帳戶資訊
      salaryBank: item.salaryBank,
      salaryBankBranch: item.salaryBankBranch,
      salaryAccountNumber: item.salaryAccountNumber,

      // 眷屬加保資料
      dependentInsurance: item.dependentInsurance || []
    }
    console.log('originalData:', originalData.value)
    // 保存當前頁碼
    localStorage.setItem('userTablePage', tablePage.value.toString())
  } else {
    // 新增模式
    isEditing.value = false
    dialog.value.id = ''
    originalData.value = null
    selectedCompany.value = null
    filteredDepartments.value = []
    dependents.value = []
    dependentInsurance.value.value = []
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
  dependents.value = []
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
    employmentStatus: '',
    dateType: '',
    dateRange: [],
    // 新增字段的重置
    indigenousStatus: '', // v-chip 的值重置為空
    tourManager: '', // v-chip 的值重置為空
    guideLicense: '',
    disabilityStatus: '',
    formStatus: ''
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

  // 定義當前值
  const currentValues = {
    // 基本資料
    email: email.value.value,
    personalEmail: personalEmail.value.value,
    name: name.value.value,
    englishName: englishName.value.value,
    gender: gender.value.value,
    IDNumber: IDNumber.value.value,
    permanentAddress: permanentAddress.value.value,
    contactAddress: contactAddress.value.value,
    phoneNumber: phoneNumber.value.value,
    cellphone: cellphone.value.value,

    // 緊急聯絡人
    emergencyName: emergencyName.value.value,
    emergencyPhoneNumber: emergencyPhoneNumber.value.value,
    emergencyCellphone: emergencyCellphone.value.value,
    emergencyRelationship: emergencyRelationship.value.value,

    // 日期相關
    birthDate: birthDate.value.value,
    hireDate: hireDate.value.value,
    resignationDate: resignationDate.value.value,
    healthInsuranceStartDate: healthInsuranceStartDate.value.value,
    healthInsuranceEndDate: healthInsuranceEndDate.value.value,
    laborInsuranceStartDate: laborInsuranceStartDate.value.value,
    laborInsuranceEndDate: laborInsuranceEndDate.value.value,
    voluntaryPensionStartDate: voluntaryPensionStartDate.value.value,
    voluntaryPensionEndDate: voluntaryPensionEndDate.value.value,
    tourismReportDate: tourismReportDate.value.value,

    // 其他資料
    company: selectedCompany.value,
    department: department.value.value,
    jobTitle: jobTitle.value.value,
    role: role.value.value,
    extNumber: extNumber.value.value,
    printNumber: printNumber.value.value,
    employmentStatus: employmentStatus.value.value,
    salary: salary.value.value,
    note: note.value.value ?? '',
    tourManager: tourManager.value.value,
    guideLicense: guideLicense.value.value,
    disabilityStatus: disabilityStatus.value.value,
    indigenousStatus: indigenousStatus.value.value,
    voluntaryPensionRate: voluntaryPensionRate.value.value,
    salaryBank: salaryBank.value.value,
    salaryBankBranch: salaryBankBranch.value.value,
    salaryAccountNumber: salaryAccountNumber.value.value,
    cowellAccount: cowellAccount.value.value,
    cowellPassword: cowellPassword.value.value,
    YSRCAccount: YSRCAccount.value.value,
    YSRCPassword: YSRCPassword.value.value,
    YS168Account: YS168Account.value.value,
    YS168Password: YS168Password.value.value,
    userId: userId.value.value,
    formStatus: formStatus.value.value
  }

  // 比較基本資料
  const basicInfoChanged = [
    'email', 'personalEmail', 'name', 'englishName', 'gender', 'IDNumber',
    'permanentAddress', 'contactAddress', 'phoneNumber', 'cellphone'
  ].some(key => originalData.value[key] !== currentValues[key])

  // 比較日期
  const datesChanged = [
    'birthDate', 'hireDate', 'resignationDate',
    'healthInsuranceStartDate', 'healthInsuranceEndDate',
    'laborInsuranceStartDate', 'laborInsuranceEndDate',
    'voluntaryPensionStartDate', 'voluntaryPensionEndDate', 'tourismReportDate'
  ].some(key => {
    const originalDate = originalData.value[key] ? new Date(originalData.value[key]).getTime() : null
    const currentDate = currentValues[key] ? new Date(currentValues[key]).getTime() : null
    return originalDate !== currentDate
  })

  // 更新眷屬資料比較邏輯
  const dependentsChanged = (() => {
    const original = originalData.value.dependentInsurance || []
    const current = dependents.value || []

    if (original.length !== current.length) {
      console.log('Dependents length changed')
      return true
    }

    return current.some((dep, index) => {
      const orig = original[index]
      if (!orig) return true

      const fieldsToCompare = [
        'dependentName',
        'dependentIDNumber',
        'dependentRelationship',
        'dependentBirthDate',
        'dependentInsuranceStartDate',
        'dependentInsuranceEndDate'
      ]

      return fieldsToCompare.some(field => {
        if (field.includes('Date')) {
          const origDate = orig[field] ? new Date(orig[field]).getTime() : null
          const currDate = dep[field] ? new Date(dep[field]).getTime() : null
          console.log(`Comparing ${field}:`, origDate, currDate)
          return origDate !== currDate
        } else {
          console.log(`Comparing ${field}:`, orig[field], dep[field])
          return orig[field] !== dep[field]
        }
      })
    })
  })()

  console.log('Dependents changed:', dependentsChanged)

  // 比較其他資料
  const otherFieldsChanged = [
    'company', 'department', 'jobTitle', 'role', 'extNumber', 'printNumber',
    'employmentStatus', 'salary', 'note', 'tourManager', 'guideLicense',
    'disabilityStatus', 'indigenousStatus', 'voluntaryPensionRate',
    'salaryBank', 'salaryBankBranch', 'salaryAccountNumber', 'emergencyName', 'emergencyPhoneNumber', 'emergencyCellphone', 'emergencyRelationship',
    'cowellAccount', 'cowellPassword', 'YSRCAccount', 'YSRCPassword', 'YS168Account', 'YS168Password', 'userId', 'formStatus'
  ].some(key => {
    if (Array.isArray(originalData.value[key])) {
      return JSON.stringify(originalData.value[key]) !== JSON.stringify(currentValues[key])
    }
    return originalData.value[key] !== currentValues[key]
  })

  // 添加偵錯日誌
  console.log('Changes detected:', {
    basicInfoChanged,
    datesChanged,
    dependentsChanged,
    otherFieldsChanged
  })

  // 只要任何部分有變更就返回 true
  return basicInfoChanged || datesChanged || dependentsChanged || otherFieldsChanged
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
  await tableLoadItems(true) // 改用這個直接載入所有資料
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
  font-size: 14px;
  color: #999;
}
.search-label {
  font-size: 13px;
  font-weight: 500;
}

@include sm {
  .tab-title {
  font-weight: 600;
  font-size: 15px;
  color: #999;
}
}
</style>
