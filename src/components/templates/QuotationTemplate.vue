<template>
  <div class="quotation-template">
    <div class="header">
      <div class="title-section">
        <h1 class="main-title">
          專案報價單
        </h1>
        <div class="quotation-info">
          <div class="info-row">
            <span class="label">No.</span>
            <span>{{ data.quotationNumber }}</span>
          </div>
          <div class="info-row">
            <span class="label">報價日期</span>
            <span>{{ formatDate(data.date) }}</span>
          </div>
        </div>
      </div>
      <div class="logo-section">
        <v-img
          src="/src/assets/image/鋭皇LOGO.png"
          alt="Company Logo"
          class="company-logo"
        />
        <div class="company-info">
          <p>台北市中山區松江路 220 號 9 樓 907 室</p>
          <p>統編 {{ companyInfo.taxId }}</p>
          <p>聯絡人 {{ companyInfo.contact }} {{ companyInfo.phone }}#2701</p>
          <p>{{ companyInfo.email }}</p>
        </div>
      </div>
    </div>

    <!-- 客戶資訊表格 -->
    <table class="customer-table">
      <tbody>
        <tr>
          <td class="label">
            客戶
          </td>
          <td>{{ data.customerName }}</td>
        </tr>
        <tr>
          <td class="label">
            地址
          </td>
          <td>{{ data.customerAddress }}</td>
        </tr>
        <tr>
          <td class="label">
            統編
          </td>
          <td>{{ data.customerTaxId }}</td>
        </tr>
        <tr>
          <td class="label">
            聯絡人
          </td>
          <td>{{ data.customerContact }}</td>
        </tr>
        <tr>
          <td class="label">
            部門
          </td>
          <td>{{ data.department }}</td>
        </tr>
        <tr>
          <td class="label">
            電話
          </td>
          <td>{{ data.customerPhone }}</td>
        </tr>
        <tr>
          <td class="label">
            郵件
          </td>
          <td>{{ data.customerEmail }}</td>
        </tr>
        <tr>
          <td class="label">
            手機
          </td>
          <td>{{ data.customerMobile }}</td>
        </tr>
        <tr>
          <td class="label">
            專案類別
          </td>
          <td>{{ data.projectType }}</td>
        </tr>
        <tr>
          <td class="label">
            專案名稱
          </td>
          <td>{{ data.projectName }}</td>
        </tr>
        <tr>
          <td class="label">
            工作天
          </td>
          <td>{{ data.workDays }} 天(不含例假日)</td>
        </tr>
      </tbody>
    </table>

    <!-- 報價項目表格 -->
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
      <tbody>
        <tr
          v-for="(item, index) in data.items"
          :key="index"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.workDays }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.unit }}</td>
          <td>{{ formatCurrency(item.price) }}</td>
          <td>$ {{ formatCurrency(item.quantity * item.price) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td
            colspan="7"
            class="total-label"
          >
            原價：{{ formatCurrency(originalTotal) }} 元，長期配合優惠價
          </td>
          <td class="total-amount">
            $ {{ formatCurrency(totalAmount) }}
          </td>
        </tr>
        <tr>
          <td
            colspan="7"
            class="total-label"
          >
            合計
          </td>
          <td class="total-amount">
            $ {{ formatCurrency(totalAmount) }}
          </td>
        </tr>
        <tr>
          <td
            colspan="7"
            class="total-label"
          >
            總計
          </td>
          <td class="total-amount">
            $ {{ formatCurrency(totalAmount) }}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- 注意事項 -->
    <div class="notes-section">
      <h3>注意事項</h3>
      <ol>
        <li>本報價單為合約附件，客戶用印簽名後生效。</li>
        <li>本報價單有效期為一個月，逾期後另行報價。</li>
        <li>本報價單本專案執行期最長為 {{ data.validityDays || '_' }} 日內，若因客戶確認時間延誤超出 {{ data.delayDays || '_' }} 日，客戶需將全額費用結清，銳皇數位行銷設計仍將擇期執行完畢。</li>
        <li>本報價單不含文案撰寫、商業攝影、翻譯、圖庫授權圖及印刷。</li>
      </ol>
    </div>

    <!-- 簽核欄位 -->
    <div class="signature-section">
      <div class="signature-box">
        <p>公司用印</p>
        <div class="signature-line" />
      </div>
      <div class="signature-box">
        <p>聯絡人簽名</p>
        <div class="signature-line" />
        <div class="date-line">
          <span>日期</span>
          <span class="date-separator">/</span>
          <span class="date-separator">/</span>
        </div>
      </div>
    </div>

    <!-- 底部備註 -->
    <div class="footer-note">
      報價單確認後，請 E-mail 予聯絡人，謝謝您的配合！
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  companyInfo: {
    type: Object,
    default: () => ({
      name: '銳皇數位行銷設計',
      address: '台北市中山區松江路 220 號 9 樓 907 室',
      taxId: '83213438',
      contact: '陳淑貞',
      phone: '02-2508-0789',
      email: 'poppy.grdesign@gmail.com'
    })
  }
})

// 計算總金額
const totalAmount = computed(() => {
  return props.data.items.reduce((sum, item) => {
    return sum + (item.quantity * item.price)
  }, 0)
})

// 計算原價總金額
const originalTotal = computed(() => {
  // 假設原價比優惠價高
  return Math.round(totalAmount.value * 1.07) // 這裡可以根據實際需求調整計算方式
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
}

// 格式化貨幣
const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
</script>

<style scoped>
.quotation-template {
  padding: 20px;
  font-family: 'Microsoft JhengHei', sans-serif;
  color: #333;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.title-section {
  flex: 1;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.quotation-info {
  font-size: 12px;
}

.info-row {
  margin: 5px 0;
}

.logo-section {
  text-align: right;
  max-width: 300px;
}

.company-logo {
  max-width: 200px;
  height: auto;
  margin-bottom: 10px;
}

.company-info {
  font-size: 11px;
  text-align: right;
}

.company-info p {
  margin: 3px 0;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 12px;
}

.customer-table td {
  padding: 5px;
  border: 1px solid #000;
}

.customer-table .label {
  width: 100px;
  background-color: #f8f9fa;
  font-weight: bold;
  letter-spacing: 1em;
  padding-right: 0;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  font-size: 12px;
}

.items-table th,
.items-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
}

.items-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.items-table tfoot td {
  font-weight: bold;
}

.total-label {
  text-align: right;
}

.total-amount {
  text-align: right;
}

.notes-section {
  margin: 30px 0;
  font-size: 12px;
}

.notes-section h3 {
  font-weight: bold;
  margin-bottom: 10px;
}

.notes-section ol {
  padding-left: 20px;
  margin: 10px 0;
}

.notes-section li {
  margin: 5px 0;
}

.signature-section {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.signature-box {
  text-align: center;
  flex: 0 0 200px;
}

.signature-line {
  margin: 20px 0;
  border-bottom: 1px solid #000;
  height: 40px;
}

.date-line {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.date-separator {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: -20px;
    right: -20px;
    border-bottom: 1px solid #000;
  }
}

.footer-note {
  margin-top: 30px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

/* 紫色邊框 */
.items-table th {
  border-top: 2px solid #663399;
}

.items-table tr:last-child td {
  border-bottom: 2px solid #663399;
}

@media print {
  .quotation-template {
    padding: 0;
  }

  @page {
    size: A4;
    margin: 1cm;
  }
}
</style>
