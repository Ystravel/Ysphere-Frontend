<template>
  <v-container
    max-width="1920"
    height="100%"
    class="overflow-x-scroll"
  >
    <v-row>
      <v-col
        cols="12"
        md="5"
        class="pe-7 pe-md-2"
      >
        <v-row class="elevation-4 rounded-lg py-4 py-sm-6  px-1 px-sm-6 mt-2 mt-sm-6 mx-0 ms-sm-4 mb-4 bg-white">
          <v-col
            cols="12"
            class="pa-0 mb-4"
          >
            <div class="d-flex align-center justify-space-between mb-4 px-4 pt-4">
              <v-row>
                <v-col
                  cols="6"
                  class="d-flex align-center"
                >
                  <h3 class="d-inline me-2">
                    表單產生器
                  </h3><v-icon
                    v-if="smAndUp"
                    v-tooltip:top="'選擇後將出現該表單資料欄位'"
                    icon="mdi-information"
                    size="small"
                    class="me-3"
                    color="blue-grey-darken-2"
                  />
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                  class="d-flex align-center justify-end gap-2"
                >
                  <v-btn
                    v-if="user.isAdmin || user.isSuperAdmin"
                    color="blue-grey-darken-2"
                    variant="outlined"
                    prepend-icon="mdi-file-cog"
                    :size="buttonSize"
                    @click="openTemplateDialog"
                  >
                    表單模板管理
                  </v-btn>
                  <v-btn
                    color="blue-grey-darken-2"
                    variant="outlined"
                    prepend-icon="mdi-history"
                    :size="buttonSize"
                    class="ms-2"
                    @click="openHistoryDialog"
                  >
                    表單歷史紀錄
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-row class="mt-2">
                    <v-col
                      cols="6"
                    >
                      <!-- 公司選擇 -->
                      <v-select
                        v-model="selectedCompany"
                        :items="companyOptions"
                        label="選擇公司"
                        item-title="title"
                        item-value="value"
                        variant="outlined"
                        density="compact"
                        clearable
                        hide-details
                        class="me-2"
                      />
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center ps-0"
                    >
                      <v-select
                        v-model="selectedTemplate"
                        :items="templateOptions"
                        label="選擇表單模板"
                        item-title="title"
                        item-value="value"
                        variant="outlined"
                        density="compact"
                        clearable
                        hide-details
                        :disabled="!selectedCompany"
                        :loading="false"
                        :hint="templateOptions.length === 0 ? '無可用的表單模板' : ''"
                        persistent-hint
                        @update:model-value="handleTemplateChange"
                      />
                    </v-col>
                  </v-row>

                  <!-- 模板選擇 -->
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col
            v-if="currentTemplate && selectedTemplate"
            cols="12"
          >
            <v-row>
              <v-col
                cols="12"
              >
                <!-- 報價單表單 -->
                <v-card
                  elevation="0"
                >
                  <v-card-text>
                    <v-form
                      ref="form"
                      v-model="valid"
                    >
                      <v-row>
                        <!-- 基本資訊 -->
                        <v-col
                          cols="12"
                          class="pa-0"
                        >
                          <v-row>
                            <v-col cols="12">
                              <div class="sub-title text-blue-grey-darken-2">
                                基本資訊
                              </div>
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-text-field
                                v-model="formData.quotationNumber"
                                label="單號"
                                variant="outlined"
                                density="compact"
                                clearable
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-date-input
                                v-model="formData.date"
                                label="報價日期"
                                variant="outlined"
                                density="compact"
                                prepend-icon
                                clearable
                              />
                            </v-col>
                          </v-row>
                        </v-col>

                        <!-- 客戶資訊 -->
                        <v-col
                          cols="12"
                          class="pa-0 mt-4"
                        >
                          <v-row>
                            <v-col cols="12">
                              <div class="sub-title text-blue-grey-darken-2">
                                客戶資訊
                              </div>
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-text-field
                                v-model="formData.customerName"
                                label="客戶名稱"
                                variant="outlined"
                                density="compact"
                                class="mb-2"
                                clearable
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-text-field
                                v-model="formData.customerAddress"
                                label="地址"
                                variant="outlined"
                                density="compact"
                                class="mb-2"
                                clearable
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-text-field
                                v-model="formData.customerTaxId"
                                label="統編"
                                variant="outlined"
                                density="compact"
                                class="mb-2"
                                clearable
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-text-field
                                v-model="formData.customerContact"
                                label="聯絡人"
                                variant="outlined"
                                density="compact"
                                class="mb-2"
                                clearable
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-text-field
                                v-model="formData.department"
                                label="部門"
                                variant="outlined"
                                density="compact"
                                class="mb-2"
                                clearable
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-text-field
                                v-model="formData.customerPhone"
                                label="電話"
                                variant="outlined"
                                density="compact"
                                class="mb-2"
                                clearable
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-text-field
                                v-model="formData.customerEmail"
                                label="郵件"
                                variant="outlined"
                                density="compact"
                                class="mb-2"
                                clearable
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              lg="6"
                              class="pb-0"
                            >
                              <v-text-field
                                v-model="formData.customerMobile"
                                label="手機"
                                variant="outlined"
                                density="compact"
                                class="mb-2"
                                clearable
                              />
                            </v-col>
                          </v-row>
                        </v-col>

                        <!-- 案資訊 -->
                        <v-col
                          cols="12"
                          class="pa-0 mt-4"
                        >
                          <v-row>
                            <v-col cols="12">
                              <v-row>
                                <v-col cols="12">
                                  <div class="sub-title text-blue-grey-darken-2">
                                    專案資訊
                                  </div>
                                </v-col>
                                <v-col
                                  cols="12"
                                  lg="6"
                                  class="pb-0"
                                >
                                  <v-text-field
                                    v-model="formData.projectType"
                                    label="專案類別"
                                    variant="outlined"
                                    density="compact"
                                    class="mb-2"
                                    clearable
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  lg="6"
                                  class="pb-0"
                                >
                                  <v-text-field
                                    v-model="formData.projectName"
                                    label="專案名稱"
                                    variant="outlined"
                                    density="compact"
                                    class="mb-2"
                                    clearable
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  lg="6"
                                  class="pb-0"
                                >
                                  <v-text-field
                                    v-model="formData.workDays"
                                    label="工作天"
                                    variant="outlined"
                                    density="compact"
                                    class="mb-2"
                                    clearable
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  lg="6"
                                  class="pb-0"
                                >
                                  <v-text-field
                                    v-model="formData.specialNote"
                                    label="特殊備註"
                                    variant="outlined"
                                    density="compact"
                                    class="mb-2"
                                    clearable
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  lg="6"
                                  class="pb-0"
                                >
                                  <v-text-field
                                    v-model="formData.validityDays"
                                    label="執行期天數"
                                    variant="outlined"
                                    density="compact"
                                    class="mb-2"
                                    clearable
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  lg="6"
                                  class="pb-0"
                                >
                                  <v-text-field
                                    v-model="formData.delayDays"
                                    label="延誤天"
                                    variant="outlined"
                                    density="compact"
                                    class="mb-2"
                                    clearable
                                  />
                                </v-col>
                              </v-row>
                            </v-col>

                            <!-- 報價項目 -->
                            <v-col cols="12">
                              <v-row>
                                <v-col cols="12">
                                  <div class="sub-title text-blue-grey-darken-2 d-flex justify-space-between">
                                    報價項目
                                    <v-btn
                                      color="blue-grey-darken-2"
                                      variant="outlined"
                                      prepend-icon="mdi-plus"
                                      size="small"
                                      @click="addItem"
                                    >
                                      新增項目
                                    </v-btn>
                                  </div>
                                </v-col>
                                <v-col cols="12">
                                  <v-expand-transition group>
                                    <div
                                      v-for="(item, index) in formData.items"
                                      :key="index"
                                      class="mb-4 px-3 border rounded-lg"
                                    >
                                      <v-row>
                                        <v-col
                                          cols="12"
                                          class="pb-0"
                                        >
                                          <div
                                            class="d-flex justify-space-between align-center mt-2"
                                            style="height: 40px;"
                                          >
                                            <span class="text-subtitle-2 text-grey-darken-1">項目 {{ index + 1 }}</span>
                                            <v-btn
                                              v-if="index > 0"
                                              icon="mdi-close"
                                              color="red-darken-1"
                                              size="small"
                                              variant="plain"
                                              @click="removeItem(index)"
                                            />
                                          </div>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          lg="6"
                                          class="pb-0"
                                        >
                                          <v-text-field
                                            v-model="item.name"
                                            label="項目名稱"
                                            variant="outlined"
                                            density="compact"
                                            class="mb-2"
                                            clearable
                                          />
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          lg="6"
                                          class="pb-0"
                                        >
                                          <v-text-field
                                            v-model="item.description"
                                            label="說明"
                                            variant="outlined"
                                            density="compact"
                                            class="mb-2"
                                            clearable
                                          />
                                        </v-col>

                                        <v-col cols="12">
                                          <v-row>
                                            <v-col cols="3">
                                              <v-text-field
                                                v-model="item.workDays"
                                                label="工作天"
                                                variant="outlined"
                                                density="compact"
                                                class="mb-2"
                                                clearable
                                              />
                                            </v-col>
                                            <v-col cols="3">
                                              <v-text-field
                                                v-model.number="item.quantity"
                                                label="數量"
                                                type="number"
                                                variant="outlined"
                                                density="compact"
                                                clearable
                                              />
                                            </v-col>
                                            <v-col cols="3">
                                              <v-text-field
                                                v-model="item.unit"
                                                label="單位"
                                                variant="outlined"
                                                density="compact"
                                                clearable
                                              />
                                            </v-col>
                                            <v-col cols="3">
                                              <v-text-field
                                                v-model.number="item.price"
                                                label="單價"
                                                type="number"
                                                variant="outlined"
                                                density="compact"
                                                clearable
                                              />
                                            </v-col>
                                          </v-row>
                                        </v-col>
                                      </v-row>
                                    </div>
                                  </v-expand-transition>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 側預覽區域 -->
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        clos="12"
        md="7"
        class="ps-md-4"
      >
        <v-row
          class="elevation-4 rounded-lg py-4 py-sm-4 px-1 px-sm-10 mt-2 mt-sm-6 mx-0 mx-sm-3 mb-4 bg-white"
          style="min-width: 900px;"
        >
          <v-col cols="12">
            <div class="card-title px-6 pt-6 text-blue-grey-darken-2 d-flex justify-space-between">
              《 預覽及下載 》
              <v-btn
                color="teal-lighten-1"
                :disabled="!previewReady || isDownloading"
                :loading="isDownloading"
                @click="downloadPDF"
              >
                下載 PDF
              </v-btn>
            </div>
            <v-divider class="mt-8 mx-6" />
            <v-card
              elevation="0"
              min-width="681"
            >
              <v-card-text
                v-if="!previewReady"
                class="text-center text-grey text-subtitle-2 font-weight-medium pa-0 pt-9 pb-3"
              >
                ( 請 先 選 擇 模 板 表 單 )
              </v-card-text>
              <v-card-text v-if="previewReady">
                <component
                  :is="currentTemplate"
                  ref="templateRef"
                  :form-data="formData"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 頁面標題 -->

    <!-- 主要內容區 -->

    <!-- 表單模板管理話框 -->
    <v-dialog
      v-model="templateDialog.open"
      persistent
      max-width="800"
    >
      <v-card class="rounded-lg pa-4">
        <div class="card-title ps-6 pt-3 pb-2 d-flex justify-space-between align-center">
          表單模板管理
          <v-btn
            icon="mdi-close"
            color="red-lighten-1"
            variant="plain"
            :size="buttonSize"
            @click="closeTemplateDialog"
          />
        </div>
        <v-card-text class="px-4 ">
          <v-row>
            <v-col
              cols="8"
              class="px-5"
            >
              <v-row>
                <v-col class="card-subtitle text-blue-grey-darken-2">
                  現有表單
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="dialogSelectedCompany"
                    :items="companyOptions"
                    label="選擇公司"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                    class="mb-4"
                    @update:model-value="loadDialogTemplates"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="dialogSelectedType"
                    :items="templateTypeOptions"
                    label="表單類型"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                    clearable
                    class="mb-4"
                  />
                </v-col>
              </v-row>

              <div class="mb-8">
                <v-chip
                  v-for="template in filteredTemplates"
                  :key="template._id"
                  class="me-4 mb-2 pa-4 pe-1"
                  color="blue-grey-darken-2"
                  label
                >
                  {{ template.name }}
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn
                        icon
                        size="x-small"
                        variant="text"
                        class="ms-2"
                        :ripple="false"
                        color="white"
                        v-bind="props"
                      >
                        <v-icon color="cyan-darken-3">
                          mdi-dots-vertical
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list density="compact">
                      <v-list-item
                        density="compact"
                        class="ps-2 pe-3 py-0"
                        @click="openEditTemplate(template)"
                      >
                        <v-icon
                          icon="mdi-pencil"
                          size="16"
                          color="light-blue-darken-4"
                        />
                        <span
                          style="font-size: 14px;"
                          class="ps-2 text-blue-grey-darken-2"
                        >編輯</span>
                      </v-list-item>
                      <v-list-item
                        density="compact"
                        class="ps-2 pe-3 py-0"
                        color="red-lighten-1"
                        @click="confirmDeleteTemplate(template)"
                      >
                        <v-icon
                          icon="mdi-delete"
                          size="16"
                          color="red-lighten-1"
                        />
                        <span
                          style="font-size: 14px;"
                          class="ps-2 text-blue-grey-darken-2"
                        >刪除</span>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-chip>
              </div>
            </v-col>
            <v-col
              cols="4"
              class="border rounded-lg px-4 pt-4"
            >
              <v-row>
                <v-col
                  cols="12"
                  class="card-subtitle text-blue-grey-darken-2 pb-6"
                >
                  新增表單模板
                </v-col>
              </v-row>
              <v-form @submit.prevent="submitTemplate">
                <v-row>
                  <v-col
                    cols="12"
                    class="pb-2"
                  >
                    <v-select
                      v-model="templateForm.company"
                      :items="companyOptions"
                      label="選擇公司*"
                      item-title="title"
                      item-value="value"
                      :error-messages="templateErrors.company"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-2"
                  >
                    <v-select
                      v-model="templateForm.type"
                      :items="templateTypeOptions"
                      label="表單類型*"
                      item-title="title"
                      item-value="value"
                      :error-messages="templateErrors.type"
                      variant="outlined"
                      clearable
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="templateForm.name"
                      :error-messages="templateErrors.name"
                      label="表單報名*"
                      variant="outlined"
                      density="compact"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="templateForm.componentName"
                      :error-messages="templateErrors.componentName"
                      label="組件名稱*"
                      placeholder="例如: RayHuangQuotationTemplate"
                      variant="outlined"
                      density="compact"
                      clearable
                    />
                  </v-col>
                </v-row>
                <v-card-actions class="pa-0 mt-2">
                  <v-spacer />

                  <v-btn
                    color="teal-darken-1"
                    variant="outlined"
                    type="submit"
                    :size="buttonSize"
                    :loading="isSubmitting"
                    class="ms-2"
                  >
                    新增
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 編輯表單表模板對話框 -->
    <v-dialog
      v-model="editTemplateDialog.open"
      persistent
      width="360"
    >
      <v-card class="rounded-lg pa-4">
        <v-card-title class="text-h6 ps-5 py-3">
          編輯表單模板
        </v-card-title>
        <v-card-text class="px-5 pb-2">
          <v-form @submit.prevent="submitEditTemplate">
            <v-text-field
              v-model="editTemplateDialog.name"
              :error-messages="editTemplateErrors"
              label="表單名稱"
              required
              variant="outlined"
              density="compact"
            />
            <v-card-actions class="pa-0 mt-4">
              <v-spacer />
              <v-btn
                color="red-lighten-1"
                variant="outlined"
                @click="closeEditTemplateDialog"
              >
                取消
              </v-btn>
              <v-btn
                color="teal-darken-1"
                variant="outlined"
                type="submit"
                :loading="isSubmitting"
                class="ms-2"
              >
                修改
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 刪除確認對話框 -->
    <ConfirmDeleteDialogWithTextField
      v-model="deleteTemplateDialog.open"
      title="確認刪除表單模板"
      :message="`確定要刪除表單模板「<span class='text-pink-lighten-1' style='font-weight: 800;'>${deleteTemplateDialog.name}</span>」嗎？此操作無法復原。`"
      :expected-name="deleteTemplateDialog.name"
      input-label="表單模板名稱"
      @confirm="deleteTemplate"
    />

    <!-- 表單歷史紀錄對話框 -->
    <v-dialog
      v-model="historyDialog.open"
      max-width="1200"
    >
      <v-card
        class="rounded-lg pa-4"
        min-height="891"
      >
        <div class="d-flex justify-space-between align-center ps-6 pt-3 pb-2">
          <div class="card-title">
            表單歷史紀錄
          </div>
          <v-btn
            icon
            color="red-lighten-1"
            variant="plain"
            @click="closeHistoryDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-card-text>
          <!-- 搜尋條件 -->
          <v-row>
            <v-col
              cols="3"
              class="pb-0"
            >
              <v-select
                v-model="historySearch.company"
                :items="companyOptions"
                label="選擇公司"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="loadTemplateOptions"
              />
            </v-col>
            <v-col
              cols="3"
              class="pb-0"
            >
              <v-select
                v-model="historySearch.type"
                :items="templateTypeOptions"
                label="表單類型"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="loadTemplateOptions"
              />
            </v-col>
            <v-col
              cols="3"
              class="pb-0"
            >
              <v-select
                v-model="historySearch.formTemplate"
                :items="historyTemplateOptions"
                label="表單模板"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                clearable
                :disabled="!historySearch.company && !historySearch.type"
              />
            </v-col>
            <v-col
              cols="3"
              class="pb-0"
            >
              <v-date-input
                v-model="historySearch.date"
                label="日期區間"
                variant="outlined"
                density="compact"
                prepend-icon
                clearable
                multiple="range"
                :ok-text="'確認'"
                :cancel-text="'取消'"
              />
            </v-col>
          </v-row>

          <!-- 按鈕 -->
          <v-row class="mt-0">
            <v-col class="d-flex justify-end gap-2">
              <v-btn
                color="blue-grey-darken-1"
                class="me-3"
                @click="resetHistorySearch"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                width="80"
                color="cyan-darken-2"
                :loading="isSearching"
                :disabled="isSearching"
                @click="searchHistory"
              >
                搜尋
              </v-btn>
            </v-col>
          </v-row>

          <!-- 歷紀錄列表 -->
          <v-table class="rounded-lg mt-6">
            <thead
              class="bg-blue-grey-darken-2"
            >
              <tr>
                <th
                  style="height: 36px;"
                >
                  表單模板名稱
                </th>
                <th
                  style="height: 36px;"
                >
                  單號
                </th>
                <th
                  style="height: 36px;"
                >
                  創建日期
                </th>
                <th
                  style="height: 36px;"
                >
                  創建者
                </th>
                <th
                  class="text-center"
                  style="height: 36px;"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="history in histories"
                :key="history._id"
              >
                <td>{{ history?.formTemplate?.name || '未知模板' }}</td>
                <td>{{ history?.formNumber || '-' }}</td>
                <td>{{ formatDate(history?.createdAt) }}</td>
                <td>{{ history?.creator?.name || '未知' }} {{ history?.creator?.userId ? `(${history?.creator?.userId})` : '' }}</td>
                <td class="text-center">
                  <v-btn
                    icon
                    variant="plain"
                    color="teal-lighten-1"
                    class="me-2"
                    @click="downloadHistoryPDF(history)"
                  >
                    <v-icon>mdi-file-pdf-box</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="plain"
                    color="red-lighten-1"
                    @click="deleteHistory(history)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr v-if="!histories.length">
                <td
                  colspan="5"
                  class="text-center"
                >
                  沒有資料
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- 添加分頁控制 -->
          <div class="d-flex justify-center mt-4">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="7"
              size="32"
              rounded="circle"
              @update:model-value="handlePageChange"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 確認刪除對話框 -->
    <ConfirmDeleteDialog
      v-model="confirmDeleteDialog.open"
      title="確認刪除表單"
      :message="`確定要刪除表單「${confirmDeleteDialog.templateName} ${confirmDeleteDialog.formNumber}」嗎？此操作無法恢復。`"
      @confirm="confirmDelete"
    />

    <!-- 在 template 最後面加入這個確認對話框 -->
    <v-dialog
      v-model="confirmDownloadDialog.open"
      max-width="340"
    >
      <v-card class="rounded-lg pa-4">
        <div class="card-title ps-3 py-3">
          確認下載
        </div>
        <v-card-text class="ps-3 pb-2 ">
          確定要下載 「{{ confirmDownloadDialog.templateName }} {{ confirmDownloadDialog.formNumber }}」 的 PDF 檔嗎？
        </v-card-text>
        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn
            color="red-lighten-1"
            variant="outlined"
            size="small"
            @click="confirmDownloadDialog.open = false"
          >
            取消
          </v-btn>
          <v-btn
            color="teal-darken-1"
            variant="outlined"
            :loading="isDownloading"
            class="ms-2"
            size="small"
            @click="confirmDownloadPDF"
          >
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, shallowRef, computed, watch, onMounted } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import { useApi } from '@/composables/axios'
import html2pdf from 'html2pdf.js'
import UserRole from '@/enums/UserRole'
import { definePage } from 'vue-router/auto'
import { useUserStore } from '@/stores/user'
import { useDisplay } from 'vuetify'
import RayHuangQuotationTemplate from '@/components/templates/RayHuangQuotationTemplate.vue'
import ConfirmDeleteDialogWithTextField from '@/components/ConfirmDeleteDialogWithTextField.vue'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'

definePage({
  meta: {
    title: '表單產生器 | ysphere',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.IT]
  }
})

const { smAndUp } = useDisplay()
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const user = useUserStore()

// 基本響應式變數
const buttonSize = computed(() => smAndUp.value ? 'default' : 'small')
const selectedCompany = ref(null)
const selectedTemplate = ref(null)
const templateOptions = ref([])
const templateRef = ref(null)
const companies = ref([])
const form = ref(null)
const valid = ref(false)

// 模板相關
const currentTemplate = shallowRef(null)
const previewReady = ref(false)

// 模板組映射
const templateComponents = {
  RayHuangQuotationTemplate
  // 未來可以繼續添加其他模板
  // HiMaxQuotationTemplate: HiMaxQuotationTemplate
}

// 表單類型選項
const templateTypeOptions = [
  { title: '報價單', value: 'quotation' },
  { title: '請購單', value: 'purchase' },
  { title: '請假單', value: 'leave' }
]

// 表單資料
const formData = ref({
  quotationNumber: '',
  date: new Date(),
  customerName: '',
  customerAddress: '',
  customerTaxId: '',
  customerContact: '',
  department: '',
  customerPhone: '',
  customerEmail: '',
  customerMobile: '',
  projectType: '',
  projectName: '',
  workDays: '',
  specialNote: '',
  validityDays: '0',
  delayDays: '0',
  items: [
    {
      name: '',
      description: '',
      workDays: '',
      quantity: 1,
      unit: '份',
      price: 0
    }
  ]
})

// 表單模板管理相關
const templateDialog = ref({
  open: false
})

const editTemplateDialog = ref({
  open: false,
  id: '',
  name: ''
})

const deleteTemplateDialog = ref({
  open: false,
  id: '',
  name: ''
})

const templateForm = ref({
  company: '',
  name: '',
  type: '',
  componentName: ''
})

const templateErrors = ref({
  company: '',
  type: '',
  name: '',
  componentName: ''
})

const editTemplateErrors = ref([])
const isSubmitting = ref(false)
const formTemplates = ref([])

// 修改公司選項計算屬性
const companyOptions = computed(() => {
  return [...companies.value]
    .sort((a, b) => a.companyId.localeCompare(b.companyId))
    .map(company => ({
      title: `${company.name} (${company.companyId})`,
      value: company._id
    }))
})

// 添加新的響應式變數
const dialogSelectedCompany = ref(null)
const dialogSelectedType = ref(null)

// 修改 filteredTemplates 計算屬性
const filteredTemplates = computed(() => {
  // 如果都沒有選擇，返回空陣列
  if (!dialogSelectedCompany.value && !dialogSelectedType.value) return []

  return formTemplates.value.filter(template => {
    // 如果只選擇了公司
    if (dialogSelectedCompany.value && !dialogSelectedType.value) {
      return template.company._id === dialogSelectedCompany.value
    }
    // 如果只選擇了類型
    if (!dialogSelectedCompany.value && dialogSelectedType.value) {
      return template.type === dialogSelectedType.value
    }
    // 如果兩者都選擇了
    if (dialogSelectedCompany.value && dialogSelectedType.value) {
      return template.company._id === dialogSelectedCompany.value && template.type === dialogSelectedType.value
    }
    return false
  })
})

// 方法
const handleTemplateChange = async (templateId) => {
  if (!templateId) {
    currentTemplate.value = null
    previewReady.value = false
    return
  }

  try {
    // 獲取模板資訊
    const { data } = await apiAuth.get(`/formTemplates/${templateId}`)
    if (data.success) {
      const template = data.result
      console.log('選擇的模板:', template)
      const Component = templateComponents[template.componentName]
      if (Component) {
        currentTemplate.value = Component
        previewReady.value = true

        // 獲取下一個單號
        try {
          const { data: numberData } = await apiAuth.get('/forms/next-number')
          if (numberData.success) {
            formData.value.quotationNumber = numberData.result
          }
        } catch (error) {
          console.error('取得單號失敗:', error)
          createSnackbar({
            text: '取得單號失敗',
            snackbarProps: { color: 'red-lighten-1' }
          })
        }
      } else {
        console.error('找不到對應的組件:', template.componentName)
        currentTemplate.value = null
        previewReady.value = false
        createSnackbar({
          text: '找不到對應的組件',
          snackbarProps: { color: 'red-lighten-1' }
        })
      }
    }
  } catch (error) {
    console.error('載入模板失敗:', error)
    currentTemplate.value = null
    previewReady.value = false
  }
}

const addItem = () => {
  formData.value.items.push({
    name: '',
    description: '',
    workDays: '',
    quantity: 1,
    unit: '份',
    price: 0
  })
}

const removeItem = (index) => {
  formData.value.items.splice(index, 1)
}

// 添加新的狀態
const isSearching = ref(false)
const isDownloading = ref(false)

// 添加分頁相關的響應式變數
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// 修改尋方法
const searchHistory = async () => {
  if (isSearching.value) return
  isSearching.value = true

  try {
    const params = {
      page: currentPage.value,
      itemsPerPage: itemsPerPage.value
    }

    if (historySearch.value.company) {
      params.company = historySearch.value.company
    }
    if (historySearch.value.type) {
      params.type = historySearch.value.type
    }
    if (historySearch.value.formTemplate) {
      params.formTemplate = historySearch.value.formTemplate
    }
    if (historySearch.value.date?.length) {
      params.date = historySearch.value.date
    }

    const { data } = await apiAuth.get('/forms', { params })
    if (data.success) {
      histories.value = data.result.data
      totalItems.value = data.result.totalItems
      currentPage.value = data.result.currentPage
    }
  } catch (error) {
    console.error('搜尋敗，完整錯:', error)
    createSnackbar({
      text: '載入歷史紀錄失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    isSearching.value = false
  }
}

// 處理頁碼變更
const handlePageChange = () => {
  searchHistory()
}

// 修改重置方法
const resetHistorySearch = async () => {
  // 清空所有搜尋條件
  historySearch.value = {
    company: '',
    type: '',
    formTemplate: '',
    date: []
  }
  // 清空模板選項
  historyTemplateOptions.value = []
  // 重置頁碼
  currentPage.value = 1
  // 重新搜尋
  await searchHistory()
}

// 修改 downloadPDF 方法
const downloadPDF = async () => {
  if (isDownloading.value) return
  isDownloading.value = true

  try {
    const element = templateRef.value?.$el
    if (!element) return

    // 1. 生成 PDF 並下載
    console.log('開始生成 PDF')
    const pdfBlob = await generatePDF(element)
    console.log('PDF 生成成功:', pdfBlob)

    // 2. 傳到 Cloudinary
    console.log('準備上傳到 Cloudinary')
    const formDataForUpload = new FormData()
    formDataForUpload.append('pdf', new File([pdfBlob], 'document.pdf', { type: 'application/pdf' }))
    console.log('FormData 準備完成:', formDataForUpload)
    const { data: uploadData } = await apiAuth.post('/forms/upload/pdf', formDataForUpload)
    console.log('上傳成功，回應:', uploadData)

    // 3. 儲存到資料庫
    console.log('準備儲存到資料庫')
    const { data } = await apiAuth.post('/forms', {
      formNumber: formData.value.quotationNumber,
      formTemplate: selectedTemplate.value,
      pdfUrl: uploadData.result.url,
      cloudinaryPublicId: uploadData.result.filename
    })
    console.log('儲存成功，回應:', data)

    if (data.success) {
      createSnackbar({
        text: 'PDF 下載並儲存成功',
        snackbarProps: {
          color: 'teal-lighten-1'
        }
      })

      // 下載 PDF
      const link = document.createElement('a')
      link.href = URL.createObjectURL(pdfBlob)
      link.download = `報價單_${formData.value.quotationNumber}_${new Date().getTime()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (error) {
    console.error('PDF 處理失敗，詳細錯誤:', error)
    console.error('錯誤回應:', error.response?.data)
    createSnackbar({
      text: error.response?.data?.message || 'PDF 處理失敗',
      snackbarProps: {
        color: 'red-lighten-1'
      }
    })
  } finally {
    isDownloading.value = false
  }
}

// API 相關方法
const loadCompanies = async () => {
  try {
    const { data } = await apiAuth.get('/company/all')
    if (data.success) {
      companies.value = data.result
      // 根據公司編號排序
      companies.value.sort((a, b) => a.companyId.localeCompare(b.companyId))
    }
  } catch (error) {
    console.error('載入公司列表失敗:', error)
    createSnackbar({
      text: '載入公司列表失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

const loadTemplatesByCompany = async (companyId) => {
  try {
    const { data } = await apiAuth.get(`/formTemplates/company/${companyId}`)
    if (data.success) {
      formTemplates.value = data.result
      templateOptions.value = data.result.map(template => ({
        title: template.name,
        value: template._id
      }))

      // 如果沒有模板，顯示提示訊息
      if (templateOptions.value.length === 0) {
        createSnackbar({
          text: '此公司目前沒有任何表單模板',
          snackbarProps: {
            color: 'warning'
          }
        })
      }
    }
  } catch (error) {
    console.error('載入表單模板失敗:', error)
    createSnackbar({
      text: '載入表單模板失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    // 確保無論如何都清空 loading 狀態
    templateOptions.value = templateOptions.value || []
  }
}

// 表單模板管理相關方法
const openTemplateDialog = async () => {
  try {
    templateDialog.value.open = true
    // 重置分頁
    templateCurrentPage.value = 1
    // 重置選擇
    dialogSelectedCompany.value = null
    dialogSelectedType.value = null
    // 重置表單
    templateForm.value = {
      company: '',
      name: '',
      type: '',
      componentName: ''
    }
    templateErrors.value = {
      company: '',
      type: '',
      name: '',
      componentName: ''
    }

    // 載入第一頁資料
    await loadDialogTemplates()
  } catch (error) {
    console.error('開啟模板管理對話框失敗:', error)
    createSnackbar({
      text: '載入模板資料失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

const closeTemplateDialog = () => {
  templateDialog.value.open = false
  templateForm.value = {
    company: '',
    name: '',
    type: '',
    componentName: ''
  }
  templateErrors.value = {
    company: '',
    type: '',
    name: '',
    componentName: ''
  }
}

const openEditTemplate = (template) => {
  editTemplateDialog.value = {
    open: true,
    id: template._id,
    name: template.name
  }
  editTemplateErrors.value = []
}

const closeEditTemplateDialog = () => {
  editTemplateDialog.value = {
    open: false,
    id: '',
    name: ''
  }
  editTemplateErrors.value = []
}

const confirmDeleteTemplate = (template) => {
  deleteTemplateDialog.value = {
    open: true,
    id: template._id,
    name: template.name
  }
}

const submitTemplate = async () => {
  // 重錯誤訊息
  templateErrors.value = {
    company: '',
    type: '',
    name: '',
    componentName: ''
  }

  // 檢查每個欄位
  let hasError = false
  if (!templateForm.value.company) {
    templateErrors.value.company = '請選擇公司'
    hasError = true
  }
  if (!templateForm.value.type) {
    templateErrors.value.type = '請選擇表單類型'
    hasError = true
  }
  if (!templateForm.value.name) {
    templateErrors.value.name = '請輸入表單名稱'
    hasError = true
  }
  if (!templateForm.value.componentName) {
    templateErrors.value.componentName = '請輸入組件名稱'
    hasError = true
  }

  if (hasError) return

  isSubmitting.value = true
  try {
    const { data } = await apiAuth.post('/formTemplates', templateForm.value)
    if (data.success) {
      createSnackbar({
        text: '新增表單模板成功',
        snackbarProps: { color: 'teal-lighten-1' }
      })
      // 重置表單
      templateForm.value = {
        company: dialogSelectedCompany.value || '',
        name: '',
        type: '',
        componentName: ''
      }
      templateErrors.value = {
        company: '',
        type: '',
        name: '',
        componentName: ''
      }
      await loadDialogTemplates()
    }
  } catch (error) {
    console.error('新增失敗:', error.response?.data)
    // 如果是後端回傳的特定欄位錯誤
    if (error.response?.data?.validationError) {
      const validationErrors = error.response.data.validationError
      Object.keys(validationErrors).forEach(key => {
        templateErrors.value[key] = validationErrors[key].message
      })
    } else {
      // 一般錯誤訊息
      createSnackbar({
        text: error.response?.data?.message || '新增失敗',
        snackbarProps: { color: 'red-lighten-1' }
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const submitEditTemplate = async () => {
  if (!editTemplateDialog.value.name) {
    editTemplateErrors.value = ['請輸入表單模板名稱']
    return
  }

  isSubmitting.value = true
  try {
    const { data } = await apiAuth.patch(`/formTemplates/${editTemplateDialog.value.id}`, {
      name: editTemplateDialog.value.name
    })
    if (data.success) {
      createSnackbar({
        text: '修改表單模板成功',
        snackbarProps: { color: 'teal-lighten-1' }
      })
      closeEditTemplateDialog()
      if (dialogSelectedCompany.value) {
        await loadDialogTemplates()
      }
    }
  } catch (error) {
    editTemplateErrors.value = [error.response?.data?.message || '修改失敗']
  } finally {
    isSubmitting.value = false
  }
}

const deleteTemplate = async () => {
  try {
    const { data } = await apiAuth.delete(`/formTemplates/${deleteTemplateDialog.value.id}`)
    if (data.success) {
      createSnackbar({
        text: '刪除表單模板成功',
        snackbarProps: { color: 'teal-lighten-1' }
      })
      // 從本地列表中移除被刪除的模板
      formTemplates.value = formTemplates.value.filter(
        template => template._id !== deleteTemplateDialog.value.id
      )
      // 如果當前選中的模板被刪除，清空選擇
      if (selectedTemplate.value === deleteTemplateDialog.value.id) {
        selectedTemplate.value = null
      }
      // 如果有選擇公司，重新載入該公司的模板列表
      if (selectedCompany.value) {
        await loadTemplatesByCompany(selectedCompany.value)
      }
      // 關閉刪除對話框
      deleteTemplateDialog.value = {
        open: false,
        id: '',
        name: ''
      }
    }
  } catch (error) {
    createSnackbar({
      text: error.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 加模板列表頁相關的響應式變數
const templateCurrentPage = ref(1)
const templateItemsPerPage = ref(10)
const templateTotalItems = ref(0)

// 修改 loadDialogTemplates 方法
const loadDialogTemplates = async () => {
  try {
    const params = {
      page: templateCurrentPage.value,
      itemsPerPage: templateItemsPerPage.value
    }

    // 載入所有表單板
    const { data } = await apiAuth.get('/formTemplates/all', { params })
    if (data.success) {
      formTemplates.value = data.result.data
      templateTotalItems.value = data.result.totalItems
      templateCurrentPage.value = data.result.currentPage
    }
  } catch (error) {
    console.error('載入表單模板失敗:', error)
    createSnackbar({
      text: '載入表單模板失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
    formTemplates.value = []
  }
}

// 監聽
watch(selectedCompany, async (newVal) => {
  selectedTemplate.value = null
  // 清空預覽相關的狀態
  currentTemplate.value = null
  previewReady.value = false

  if (newVal) {
    await loadTemplatesByCompany(newVal)
  } else {
    templateOptions.value = []
    // 重置表單資料
    formData.value = {
      quotationNumber: '',
      date: new Date(),
      customerName: '',
      customerAddress: '',
      customerTaxId: '',
      customerContact: '',
      department: '',
      customerPhone: '',
      customerEmail: '',
      customerMobile: '',
      projectType: '',
      projectName: '',
      workDays: '',
      specialNote: '',
      validityDays: '0',
      delayDays: '0',
      items: [
        {
          name: '',
          description: '',
          workDays: '',
          quantity: 1,
          unit: '份',
          price: 0
        }
      ]
    }
  }
})

// 監聽表單值的變化
watch(() => templateForm.value.company, (newVal) => {
  if (newVal) {
    templateErrors.value.company = ''
  }
})

watch(() => templateForm.value.type, (newVal) => {
  if (newVal) {
    templateErrors.value.type = ''
  }
})

watch(() => templateForm.value.name, (newVal) => {
  if (newVal) {
    templateErrors.value.name = ''
  }
})

watch(() => templateForm.value.componentName, (newVal) => {
  if (newVal) {
    templateErrors.value.componentName = ''
  }
})

// 或者使用一個組合的 watch
watch(templateForm, (newVal) => {
  // 公司
  if (newVal.company) {
    templateErrors.value.company = ''
  }
  // 類型
  if (newVal.type) {
    templateErrors.value.type = ''
  }
  // 名稱
  if (newVal.name) {
    templateErrors.value.name = ''
  }
  // 組件名稱
  if (newVal.componentName) {
    templateErrors.value.componentName = ''
  }
}, { deep: true })

// 生命週期鉤子
onMounted(async () => {
  await loadCompanies()
})

// 添加 generatePDF 函數
const generatePDF = async (element) => {
  const style = document.createElement('style')
  style.textContent = `
    @page {
      size: A4;
      margin: 0;
    }
  `
  document.head.appendChild(style)

  const opt = {
    margin: 0,
    filename: `報價單_${formData.value.quotationNumber}_${new Date().getTime()}.pdf`,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: {
      scale: 6,
      useCORS: true,
      letterRendering: true,
      width: 795,
      height: 1123,
      windowWidth: 795,
      windowHeight: 1123
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    }
  }

  try {
    // 使用 html2pdf 生成 PDF 並返回 Blob
    const pdf = await html2pdf().set(opt).from(element).output('blob')
    return pdf
  } catch (error) {
    console.error('PDF 成失敗:', error)
    throw error
  } finally {
    document.head.removeChild(style)
  }
}

// 歷史紀錄相關
const historyDialog = ref({
  open: false
})

const historySearch = ref({
  company: '',
  type: '',
  formTemplate: '',
  date: []
})

const histories = ref([])

const historyTemplateOptions = ref([])

const loadTemplateOptions = async () => {
  try {
    console.log('開始載入模板選項')
    console.log('當前搜尋條件:', {
      company: historySearch.value.company,
      type: historySearch.value.type
    })

    // 清空現有選項
    historyTemplateOptions.value = []
    historySearch.value.formTemplate = ''

    // 只有當公司和類型都有選擇時載入模板
    if (historySearch.value.company && historySearch.value.type) {
      const params = {
        company: historySearch.value.company,
        type: historySearch.value.type
      }

      console.log('準備發送請求，參數:', params)
      const { data } = await apiAuth.get('/formTemplates/search', { params })
      console.log('收到回應:', data)

      if (data.success) {
        historyTemplateOptions.value = data.result.map(template => ({
          title: template.name,
          value: template._id
        }))
        console.log('處理後的選項:', historyTemplateOptions.value)
      }
    }
  } catch (error) {
    console.error('載入模板選項失敗:', error)
    createSnackbar({
      text: '載入模板選項失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

const closeHistoryDialog = () => {
  historyDialog.value.open = false
  resetHistorySearch()
}

// 修改 openHistoryDialog
const openHistoryDialog = async () => {
  try {
    historyDialog.value.open = true
    // 清空所有搜尋條件
    historySearch.value = {
      company: '',
      type: '',
      formTemplate: '',
      date: []
    }
    historyTemplateOptions.value = []
    currentPage.value = 1

    // 載入第一頁資料
    await searchHistory()
  } catch (error) {
    console.error('開啟歷史紀錄對話框失敗:', error)
    createSnackbar({
      text: '載入歷史紀錄失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

const formToDelete = ref(null)
const confirmDeleteDialog = ref({
  open: false,
  templateName: '',
  formNumber: ''
})

const deleteHistory = async (history) => {
  formToDelete.value = history
  confirmDeleteDialog.value = {
    open: true,
    templateName: history.formTemplate?.name || '未知模板',
    formNumber: history.formNumber || ''
  }
}

const confirmDelete = async () => {
  try {
    const { data } = await apiAuth.delete(`/forms/${formToDelete.value._id}`)
    if (data.success) {
      createSnackbar({
        text: '刪除歷史紀錄成功',
        snackbarProps: { color: 'teal-lighten-1' }
      })
      await searchHistory()
    }
  } catch (error) {
    createSnackbar({
      text: error.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
  formToDelete.value = null
}

// 日期格式化
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 監聽公司和類型變化
watch(
  [
    () => historySearch.value.company,
    () => historySearch.value.type
  ],
  () => {
    // 當公司或類型變化時，清空模板選項和選擇的模板
    historySearch.value.formTemplate = ''
    historyTemplateOptions.value = []
  }
)

// 添加下載歷史 PDF 的方法
const downloadHistoryPDF = async (history) => {
  try {
    if (!history.pdfUrl) {
      createSnackbar({
        text: '找不到 PDF 檔案',
        snackbarProps: { color: 'red-lighten-1' }
      })
      return
    }

    // 開啟確認對話框
    confirmDownloadDialog.value = {
      open: true,
      templateName: history.formTemplate?.name || '未知模板',
      formNumber: history.formNumber || '',
      url: history.pdfUrl
    }
  } catch (error) {
    console.error('下載 PDF 失敗:', error)
    createSnackbar({
      text: '下載 PDF 失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  }
}

// 確認下載對話框的狀態
const confirmDownloadDialog = ref({
  open: false,
  templateName: '',
  formNumber: ''
})

// 確認下載 PDF
const confirmDownloadPDF = async () => {
  try {
    // 如果是歷史記錄的 PDF 下載
    if (confirmDownloadDialog.value.url) {
      window.open(confirmDownloadDialog.value.url, '_blank')
      createSnackbar({
        text: 'PDF 開啟成功',
        snackbarProps: {
          color: 'teal-lighten-1',
          timeout: 2000
        }
      })
    } else {
      // 如果是新生成的 PDF 下載
      await downloadPDF()
    }
  } catch (error) {
    console.error('PDF 下載失敗:', error)
    createSnackbar({
      text: 'PDF 下載失敗',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    confirmDownloadDialog.value.open = false
  }
}
</script>
<style lang="scss" scoped>
// .preview-content {
//   background: white;
//   width: 210mm;
//   min-height: 297mm;
//   margin: 0 auto;
//   padding: 15mm;
//   box-sizing: border-box;
// }

// .text-right {
//   text-align: right;
// }
.v-select :deep(.v-field__input) {
  .v-select__selection-text {
    padding-bottom: 6px;
  }
}
</style>
