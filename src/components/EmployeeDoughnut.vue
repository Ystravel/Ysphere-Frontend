<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          class="mx-auto pa-8 pb-4 d-flex flex-column justify-center align-center"
          elevation="4"
          rounded="xl"
        >
          <h6 style="font-size: 16px;">
            全公司人數分布
          </h6>
          <v-card-text class="chart-container pb-0">
            <div class="chart-wrapper">
              <canvas ref="companyChartRef" />
              <div
                v-if="isLoading"
                class="loading-overlay d-flex justify-center align-center"
              >
                <v-progress-circular
                  indeterminate
                  color="blue-grey-darken-1"
                />
              </div>
              <div
                class="center-text"
                :class="{ 'invisible': isLoading }"
              >
                <div
                  class="text-grey-darken-1 mb-1"
                  style="font-size: 12px; font-weight: 600;"
                >
                  總在職人數
                </div>
                <div class="text-h6 font-weight-medium">
                  {{ totalEmployees }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import { companyNames } from '@/enums/Company'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const companyChartRef = ref(null)
const companyChart = ref(null)
const totalEmployees = ref(0)
const isLoading = ref(false)

const fetchEmployeeStats = async () => {
  isLoading.value = true
  try {
    const response = await apiAuth.get('/user/all', {
      params: {
        page: 1,
        itemsPerPage: 999999,
        fields: 'department employmentStatus'
      }
    })

    const allEmployees = response.data.result.data
    const activeEmployees = allEmployees.filter(emp => emp.employmentStatus === '在職')

    totalEmployees.value = activeEmployees.length

    const companyStats = activeEmployees.reduce((acc, curr) => {
      const companyId = curr.department?.companyId
      const companyName = companyNames[companyId] || '未分類'
      acc[companyName] = (acc[companyName] || 0) + 1
      return acc
    }, {})

    initChart({
      labels: Object.keys(companyStats),
      data: Object.values(companyStats)
    })
  } catch (error) {
    console.error('獲取員工統計失敗:', error)
    createSnackbar({
      text: '獲取員工統計資料失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  refreshChart: fetchEmployeeStats
})

const initChart = (companyData) => {
  if (!companyChartRef.value) return

  if (companyChart.value) {
    companyChart.value.destroy()
  }

  companyChart.value = new Chart(companyChartRef.value, {
    type: 'doughnut',
    data: {
      labels: companyData.labels,
      datasets: [{
        data: companyData.data,
        backgroundColor: [
          '#36A2EB',
          '#4BC0C0',
          '#FF5252',
          '#FFCE56',
          '#9966FF',
          '#FF9F40',
          '#5C6BC0',
          '#FF6384'
        ],
        borderWidth: 0,
        hoverOffset: 15,
        offset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '80%',
      layout: {
        padding: {
          top: 20
        }

      },
      plugins: {
        legend: {
          position: 'bottom',
          boxHeight: 80,
          labels: {
            padding: 12, // 增加標籤之間的間距
            font: {
              family: '微軟正黑體',
              size: 12,
              weight: 500
            },
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 6,
            boxHeight: 6
          }
        },
        tooltip: {
          titleFont: {
            family: '微軟正黑體',
            size: 14,
            weight: '500'
          },
          bodyFont: {
            family: '微軟正黑體',
            size: 13,
            weight: '400'
          },
          callbacks: {
            label: (context) => {
              const label = context.label || ''
              const value = context.raw || 0
              const percentage = ((value / totalEmployees.value) * 100).toFixed(1)
              return `${label}: ${value}人 (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  fetchEmployeeStats()
})

onUnmounted(() => {
  if (companyChart.value) {
    companyChart.value.destroy()
  }
})
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 0 20px rgba(0,0,0,0.3) !important;
}

.chart-container {
  width: 280px;
  height: 320px;
}

.chart-wrapper {
  height: calc(100% - 30px);
  position: relative;
}

.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -66%);
  text-align: center;
  z-index: 1;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 2;
}

.invisible {
  visibility: hidden;
}
</style>
