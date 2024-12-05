<template>
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
              <p><span style="font-weight: bold;">報價日期：</span>{{ formatDate(formData.date) }}</p>
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
                  {{ formData.workDays }}&nbsp;天 ( 不含例假日 )
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
          <p><span style="font-weight: bold;">聯絡人</span> 陳淑貞 0937-826735</p>
          <p>poppy.grdesign@gmail.com</p>
        </div>
      </div>

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
                  稅金
                </div>
              </td>
              <td class="px-0">
                <div class="total-amount pb-1 w-100">
                  $ {{ formatAmount(Math.round(totalAmount * 1.05) - totalAmount) }}
                </div>
              </td>
            </tr>
            <tr>
              <td
                colspan="7"
                class="text-right pe-0"
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

      <!-- 簽名欄 -->
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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const pad = (num) => String(num).padStart(2, '0')
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  return `${year}/${month}/${day}`
}

// 格式化金額
const formatAmount = (amount) => {
  return amount.toLocaleString('zh-TW')
}

// 計算總金額
const totalAmount = computed(() => {
  return props.formData.items.reduce((total, item) => {
    return total + (item.quantity * item.price)
  }, 0)
})
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
  border-bottom: 3px solid #663399;
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
  border-top: 3px solid #663399 !important;
  border-bottom: 3px solid #663399 !important;
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
