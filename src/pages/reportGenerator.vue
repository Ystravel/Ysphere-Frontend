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
      >
        <v-row class="elevation-4 rounded-lg py-4 py-sm-8 px-1 px-sm-6 mt-2 mt-sm-6 mx-0 ms-sm-4 mb-4 bg-white">
          <v-col
            cols="12"
            class="pa-0"
          >
            <div class="d-flex align-center justify-space-between mb-4 px-4 pt-4">
              <v-row>
                <v-col
                  cols="6"
                >
                  <h3>報表產生器</h3>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                >
                  <v-select
                    v-model="selectedTemplate"
                    :items="templateOptions"
                    label="選擇報表模板"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    clearable
                    hide-details
                    @update:model-value="handleTemplateChange"
                  />
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col
                cols="12"
              >
                <div
                  v-if="!selectedTemplate"
                  style="min-height: 72.75px;"
                />
                <!-- 報價單表單 -->
                <v-card
                  v-if="selectedTemplate === 'quotation'"
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
                              <div class="card-title text-blue-grey-darken-2">
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
                                label="報價單號"
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
                              <div class="card-title text-blue-grey-darken-2">
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

                        <!-- 專案資訊 -->
                        <v-col
                          cols="12"
                          class="pa-0 mt-4"
                        >
                          <v-row>
                            <v-col cols="12">
                              <v-row>
                                <v-col cols="12">
                                  <div class="card-title text-blue-grey-darken-2">
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
                                    label="延誤天數"
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
                                  <div class="card-title text-blue-grey-darken-2 d-flex justify-space-between">
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
                                  <div
                                    v-for="(item, index) in formData.items"
                                    :key="index"
                                    class="mb-4 px-3 pt-3 border rounded-lg"
                                  >
                                    <v-row>
                                      <v-col
                                        cols="12"
                                        class="pb-0"
                                      >
                                        <div class="d-flex justify-space-between align-center mb-2">
                                          <span class="text-subtitle-2">項目 {{ index + 1 }}</span>
                                          <v-btn
                                            v-if="index > 0"
                                            icon="mdi-delete"
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
      >
        <v-row
          class="elevation-4 rounded-lg py-4 py-sm-8 px-1 px-sm-10 mt-2 mt-sm-6 mx-0 mx-sm-3 mb-4 bg-white"
          style="min-width: 900px;"
        >
          <v-col cols="12">
            <div class="card-title px-6 pt-6 text-blue-grey-darken-2 d-flex justify-space-between">
              《 預覽報表 》
              <v-btn
                color="teal-lighten-1"
                :disabled="!previewReady"
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
                class="text-center text-grey text-subtitle-2 font-weight-medium pa-0 pt-8"
              >
                ( 請 先 選 擇 報 表 模 板 )
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
  </v-container>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import html2pdf from 'html2pdf.js'
import UserRole from '@/enums/UserRole'
import { definePage } from 'vue-router/auto'
import RayHuangQuotationTemplate from '@/components/templates/RayHuangQuotationTemplate.vue'

definePage({
  meta: {
    title: '報表產生器 | ysphere',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.IT]
  }
})

const createSnackbar = useSnackbar()
const templateRef = ref(null)

// 模板相關
const currentTemplate = shallowRef(null)
const templateMap = {
  quotation: RayHuangQuotationTemplate
}

// 表單相關
const form = ref(null)
const valid = ref(false)
const previewReady = ref(false)
const selectedTemplate = ref(null)

// 模板選項
const templateOptions = [
  { title: '銳皇專案報價單', value: 'quotation' },
  { title: '收據', value: 'receipt' }
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

// 處理模板變更
const handleTemplateChange = () => {
  if (selectedTemplate.value) {
    currentTemplate.value = templateMap[selectedTemplate.value]
    previewReady.value = true
  } else {
    currentTemplate.value = null
    previewReady.value = false
  }
}

// 新增項目
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

// 移除項目
const removeItem = (index) => {
  formData.value.items.splice(index, 1)
}

// 下載 PDF
const downloadPDF = async () => {
  const element = templateRef.value?.$el
  if (!element) return

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
    image: {
      type: 'jpeg',
      quality: 1.0
    },
    html2canvas: {
      scale: 6,
      useCORS: true,
      letterRendering: true,
      width: 795, // A4 寬度
      height: 1123, // A4 高度
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
    await html2pdf().set(opt).from(element).save()
    createSnackbar({
      text: 'PDF 下載成功',
      snackbarProps: {
        color: 'teal-lighten-1',
        timeout: 2000
      }
    })
  } catch (error) {
    console.error('PDF 生成失敗:', error)
    createSnackbar({
      text: 'PDF 生成失敗',
      snackbarProps: {
        color: 'error',
        timeout: 3000
      }
    })
  } finally {
    document.head.removeChild(style)
  }
}
</script>

<style lang="scss" scoped>
.preview-content {
  background: white;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 13mm 15mm;
  box-sizing: border-box;
}

.quotation-template {
  font-size: 12px;
  line-height: 1.4;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title {
  width: 100%;
  text-align: left;
}

.title-content {
  border-bottom: 4px solid #663399;
}

.title h2 {
  font-size: 20px;
  margin-bottom: 10px;
  letter-spacing: 6px;
  color: #000;
}

.company-info {
  width: 480px;
  text-align: right;
  img {
    margin-bottom: 12px;
  }
  p {
    line-height: 2;
    font-size: 14px;
  }
}

.company-logo {
  height: 124px !important;
  width: auto !important;
  object-fit: contain !important;
  margin-bottom: 5px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  tr {
    display: flex;
  }
  .content {
    padding-left: 24px;
    font-size: 13px;
  }
}

.info-table td {
  padding: 4px 6px;
  height: 24px;
}

.info-table .label {
  width: 72px;
  height: 26px;
  border-bottom: 2px solid #663399;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
}

.items-table-container {
  height: 320px;
  overflow-y: visible;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  font-size: 13px;
}

.items-table th {
  padding: 6px;
  text-align: center;
}

.items-table  {
  td {
    padding: 6px;
    text-align: center;
  }

  tfoot td {
    border-bottom: none;
  }
}

.items-table .special-note {
  text-align: left;
  text-align: center;
}

.data-tbody {
  border-top: 4px solid #663399 !important;
  border-bottom: 4px solid #663399 !important;
  tr:not(:last-child) {
    border-bottom: 1px solid #000;
  }
}

.items-table tfoot tr {
  height: 32px;
}

.total-amount {
  display: inline-block;
  border-bottom: 1px solid #000;
  font-weight: 600;

}

.notes {
  margin: 8px 0;
  .work-days {
    margin: 0 4px;
    width: 32px;
    display: inline-block;
    text-align: center;
    border-bottom: 1px solid #000;
    font-weight: 600;
  }
}

.notes h3 {
  font-size: 14px;
  margin-bottom: 8px;
}

.notes ol {
  padding-left: 20px;
  margin: 0;
}

.notes li {
  padding-left: 12px;
  margin-bottom: 4px;
  line-height: 1.6;
  font-size: 14px;
}

.signature {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 600;
}

.stamp-box,
.signature-box {
  border: 1px solid #000;
  width: 150px;
  height: 80px;
  margin: 5px 0;
}

.footer {
  text-align: center;
  margin-top: 15px;
  color: #000080;
  font-size: 14px;
}

.text-right {
  text-align: right;
}

.items-table th:nth-child(1),
.items-table td:nth-child(1) {
  width: 40px;
}

.items-table th:nth-child(2),
.items-table td:nth-child(2) {
  width: 120px;
}

.items-table th:nth-child(3),
.items-table td:nth-child(3) {
  width: 120px;
}

.items-table th:nth-child(4),
.items-table td:nth-child(4) {
  width: 70px;
}

.items-table th:nth-child(5),
.items-table td:nth-child(5) {
  width: 50px;
}

.items-table th:nth-child(6),
.items-table td:nth-child(6) {
  width: 50px;
}

.items-table th:nth-child(7),
.items-table td:nth-child(7) {
  width: 36px;
}

.items-table th:nth-child(8)
.items-table td:nth-child(8) {
  width: 36px;
}
</style>
