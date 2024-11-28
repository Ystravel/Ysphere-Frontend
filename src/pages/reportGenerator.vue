<template>
  <v-container max-width="1400">
    <!-- 頁面標題 -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2>報表產生器</h2>
          <v-btn
            color="primary"
            :disabled="!previewReady"
            @click="downloadPDF"
          >
            下載 PDF
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 主要內容區 -->
    <v-row>
      <!-- 左側表單區域 -->
      <v-col
        cols="12"
        md="5"
        lg="4"
      >
        <v-card class="mb-4">
          <v-card-title>選擇報表類型</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedTemplate"
              :items="templateOptions"
              label="選擇報表模板"
              item-title="title"
              item-value="value"
              variant="outlined"
              @update:model-value="handleTemplateChange"
            />
          </v-card-text>
        </v-card>

        <!-- 報價單表單 -->
        <v-card v-if="selectedTemplate === 'quotation'">
          <v-card-title>填寫報價單</v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              @submit.prevent="generatePreview"
            >
              <v-row>
                <!-- 基本資訊 -->
                <v-col cols="12">
                  <h3 class="text-subtitle-1 mb-4">
                    基本資訊
                  </h3>
                  <v-text-field
                    v-model="formData.quotationNumber"
                    label="報價單號"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.date"
                    label="報價日期"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                </v-col>

                <!-- 客戶資訊 -->
                <v-col cols="12">
                  <h3 class="text-subtitle-1 mb-4">
                    客戶資訊
                  </h3>
                  <v-text-field
                    v-model="formData.customerName"
                    label="客戶名稱"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.customerAddress"
                    label="地址"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.customerTaxId"
                    label="統編"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.customerContact"
                    label="聯絡人"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.department"
                    label="部門"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.customerPhone"
                    label="電話"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.customerEmail"
                    label="郵件"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.customerMobile"
                    label="手機"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                </v-col>

                <!-- 專案資訊 -->
                <v-col cols="12">
                  <h3 class="text-subtitle-1 mb-4">
                    專案資訊
                  </h3>
                  <v-text-field
                    v-model="formData.projectType"
                    label="專案類別"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.projectName"
                    label="專案名稱"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.workDays"
                    label="工作天"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.specialNote"
                    label="特殊備註"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.validityDays"
                    label="執行期天數"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="formData.delayDays"
                    label="延誤天數"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  />
                </v-col>

                <!-- 報價項目 -->
                <v-col cols="12">
                  <h3 class="text-subtitle-1 mb-4">
                    報價項目
                  </h3>
                  <div
                    v-for="(item, index) in formData.items"
                    :key="index"
                    class="mb-4 pa-4 bg-grey-lighten-4 rounded-lg"
                  >
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-subtitle-2">項目 {{ index + 1 }}</span>
                      <v-btn
                        v-if="index > 0"
                        icon="mdi-delete"
                        color="error"
                        size="small"
                        variant="text"
                        @click="removeItem(index)"
                      />
                    </div>
                    <v-text-field
                      v-model="item.name"
                      label="項目名稱"
                      variant="outlined"
                      density="comfortable"
                      class="mb-2"
                    />
                    <v-text-field
                      v-model="item.description"
                      label="說明"
                      variant="outlined"
                      density="comfortable"
                      class="mb-2"
                    />
                    <v-text-field
                      v-model="item.workDays"
                      label="工作天"
                      variant="outlined"
                      density="comfortable"
                      class="mb-2"
                    />
                    <v-row>
                      <v-col cols="4">
                        <v-text-field
                          v-model.number="item.quantity"
                          label="數量"
                          type="number"
                          variant="outlined"
                          density="comfortable"
                        />
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          v-model="item.unit"
                          label="單位"
                          variant="outlined"
                          density="comfortable"
                        />
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          v-model.number="item.price"
                          label="單價"
                          type="number"
                          variant="outlined"
                          density="comfortable"
                        />
                      </v-col>
                    </v-row>
                    <v-text-field
                      v-model="item.remark"
                      label="備註"
                      variant="outlined"
                      density="comfortable"
                    />
                  </div>
                  <v-btn
                    color="primary"
                    variant="text"
                    prepend-icon="mdi-plus"
                    @click="addItem"
                  >
                    新增項目
                  </v-btn>
                </v-col>

                <!-- 按鈕區 -->
                <v-col
                  cols="12"
                  class="d-flex justify-end"
                >
                  <v-btn
                    color="primary"
                    @click="generatePreview"
                  >
                    預覽報表
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 右側預覽區域 -->
      <v-col
        cols="12"
        md="7"
        lg="8"
      >
        <v-card>
          <div class="card-title ps-6 pt-6 text-blue-grey-darken-2">
            《 預覽報表 》
          </div>
          <v-card-text
            v-if="!previewReady"
            class="text-center text-grey-lighten-1 text-subtitle-2 font-weight-medium"
          >
            ( 請先選擇報表類型並填寫表單 )
          </v-card-text>
          <v-card-text
            v-if="previewReady"
          >
            <div
              ref="previewContent"
              class="preview-content"
            >
              <div class="quotation-template">
                <!-- 頁首 -->
                <div class="header">
                  <div class="title">
                    <div class="d-flex justify-space-between pe-4 title-content">
                      <h2>專案報價單</h2>
                      <div>
                        <p><span style="font-weight: bold;">No.</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ formData.quotationNumber }}</p>
                        <p><span style="font-weight: bold;">報價日期：</span>{{ formData.date }}</p>
                      </div>
                    </div>
                    <table class="info-table">
                      <tbody>
                        <tr>
                          <td class="label">
                            <span>客</span><span>戶</span>
                          </td>
                          <td class="content">
                            {{ formData.customerName }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>地</span><span>址</span>
                          </td>
                          <td class="content">
                            {{ formData.customerAddress }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>統</span><span>編</span>
                          </td>
                          <td class="content">
                            {{ formData.customerTaxId }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>聯</span><span>絡</span><span>人</span>
                          </td>
                          <td class="content">
                            {{ formData.customerContact }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>部</span><span>門</span>
                          </td>
                          <td class="content">
                            {{ formData.department }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>電</span><span>話</span>
                          </td>
                          <td class="content">
                            {{ formData.customerPhone }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>郵</span><span>件</span>
                          </td>
                          <td class="content">
                            {{ formData.customerEmail }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>手</span><span>機</span>
                          </td>
                          <td class="content">
                            {{ formData.customerMobile }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>專</span><span>案</span><span>類</span><span>別</span>
                          </td>
                          <td class="content">
                            {{ formData.projectType }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>專</span><span>案</span><span>名</span><span>稱</span>
                          </td>
                          <td class="content">
                            {{ formData.projectName }}
                          </td>
                        </tr>
                        <tr>
                          <td class="label">
                            <span>工</span><span>作</span><span>天</span>
                          </td>
                          <td class="content">
                            {{ formData.workDays }}&nbsp;&nbsp;&nbsp;天 ( 不含例假日 )
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="company-info">
                    <img
                      src="@/assets/image/鋭皇LOGO.png"
                      alt="Company Logo"
                      class="company-logo"
                    >
                    <p>台北市中山區松江路 220 號 9 樓 907 室</p>
                    <p><span style="font-weight: bold;">統編</span> 83213438</p>
                    <p><span style="font-weight: bold;">聯絡人</span> 陳淑貞 02-2508-0789#2701</p>
                    <p>poppy.grdesign@gmail.com</p>
                  </div>
                </div>

                <!-- 客戶資訊表格 -->

                <!-- 報價項目表格 -->
                <div class="items-table-container">
                  <table class="items-table">
                    <thead>
                      <tr>
                        <th>項次</th>
                        <th>項目名稱</th>
                        <th>說明</th>
                        <th>工作天</th>
                        <th>數量</th>
                        <th>單位</th>
                        <th>單價</th>
                        <th>小計</th>
                      </tr>
                    </thead>
                    <tbody class="data-tbody">
                      <tr
                        v-for="(item, index) in formData.items"
                        :key="index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.description }}</td>
                        <td>{{ item.workDays }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.unit }}</td>
                        <td>$ {{ formatAmount(item.price) }}</td>
                        <td>$ {{ formatAmount(item.quantity * item.price) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colspan="6"
                          class="special-note"
                        >
                          {{ formData.specialNote }}
                        </td>
                        <td
                          colspan="1"
                          class="text-right pe-0"
                        >
                          <div class="total-amount ps-4 pb-1">
                            合計
                          </div>
                        </td>
                        <td
                          colspan="4"
                          class="px-0"
                        >
                          <div class="total-amount w-100 pb-1">
                            $ {{ formatAmount(totalAmount) }}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="1" />
                        <td
                          colspan="6"
                          class="text-right pe-0"
                        >
                          <div class="total-amount ps-4 pb-1">
                            稅後
                          </div>
                        </td>
                        <td class="px-0">
                          <div class="total-amount pb-1 w-100">
                            $ {{ formatAmount(Math.round(totalAmount * 1.05)) }}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="7"
                          class=" text-right pe-0"
                        >
                          <div class="total-amount ps-4 pb-1">
                            總計
                          </div>
                        </td>
                        <td class="px-0">
                          <div class="total-amount pb-1 w-100">
                            $ {{ formatAmount(Math.round(totalAmount * 1.05)) }}
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <!-- 注意事項 -->
                <div class="notes">
                  <h3>注意事項</h3>
                  <ol>
                    <li>本報價單為合約附件，客戶用印簽名後生效。</li>
                    <li>本報價單有效期限為一個月，逾期後另行報價。</li>
                    <li>
                      本報價本專案執行期最長為<div class="work-days">
                        {{ formData.validityDays }}
                      </div>日內，若因客戶確認時間延誤超出<div class="work-days">
                        {{ formData.delayDays }}
                      </div>日，客戶需將全額費用結清，銳皇數位行銷設計仍須將專案執行完畢。
                    </li>
                    <li>本報價單不含文案撰寫、商業攝影、翻譯、國際授權圖及印刷。</li>
                  </ol>
                </div>

                <!-- 名欄 -->
                <div class="signature">
                  <div class="company-stamp">
                    <p>公司用印</p>
                    <div class="stamp-box" />
                  </div>
                  <div class="contact-signature">
                    <p>聯絡人簽名</p>
                    <div class="signature-box" />
                    <p class="mt-2">
                      日期 ：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
                    </p>
                  </div>
                </div>

                <div class="footer">
                  <p>報價單確認後，請 E-mail 予聯絡人，謝謝您的配合！</p>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import html2pdf from 'html2pdf.js'

const createSnackbar = useSnackbar()

// 表單相關
const form = ref(null)
const valid = ref(false)
const previewReady = ref(false)
const selectedTemplate = ref(null)

// 模板選項
const templateOptions = [
  { title: '報價單', value: 'quotation' },
  { title: '收據', value: 'receipt' }
]

// 表單資料
const formData = ref({
  quotationNumber: '',
  date: new Date().toISOString().split('T')[0],
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
  validityDays: '5',
  delayDays: '1',
  items: [
    {
      name: '',
      description: '',
      workDays: '',
      quantity: 1,
      unit: '份',
      price: 0,
      remark: ''
    }
  ]
})

// 格式化金額
const formatAmount = (amount) => {
  return amount.toLocaleString('zh-TW')
}

// 計算總金額
const totalAmount = computed(() => {
  return formData.value.items.reduce((total, item) => {
    return total + (item.quantity * item.price)
  }, 0)
})

// 處理模板變更
const handleTemplateChange = () => {
  previewReady.value = false
}

// 新增項目
const addItem = () => {
  formData.value.items.push({
    name: '',
    description: '',
    workDays: '',
    quantity: 1,
    unit: '份',
    price: 0,
    remark: ''
  })
}

// 移除項目
const removeItem = (index) => {
  formData.value.items.splice(index, 1)
}

// 生成預覽
const generatePreview = () => {
  previewReady.value = true
}

// 下載 PDF
const downloadPDF = async () => {
  const element = document.querySelector('.preview-content')
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
        color: 'success',
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
  height: 130px !important;
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
  width: 48px;
}

.items-table th:nth-child(2),
.items-table td:nth-child(2) {
  width: 150px;
}

.items-table th:nth-child(3),
.items-table td:nth-child(3) {
  width: 200px;
}

.items-table th:nth-child(4),
.items-table td:nth-child(4) {
  width: 68px;
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
  width: 72px;
}

.items-table th:nth-child(8),
.items-table td:nth-child(8) {
  width: 80px;
}
</style>
