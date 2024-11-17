<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          class="mx-auto pt-8 pb-4 px-4 d-flex flex-column justify-center align-center"
          elevation="4"
          rounded="xl"
        >
          <h6 style="font-size: 16px;">
            員工流動趨勢
          </h6>
          <v-card-text class="chart-container pb-0">
            <div class="chart-wrapper">
              <canvas ref="turnoverChartRef" />
              <div
                v-if="isLoading"
                class="loading-overlay d-flex justify-center align-center"
              >
                <v-progress-circular
                  indeterminate
                  color="blue-grey-darken-1"
                />
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
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const turnoverChartRef = ref(null)
const turnoverChart = ref(null)
const isLoading = ref(false)

const fetchTurnoverStats = async () => {
  isLoading.value = true
  try {
    const currentYear = new Date().getFullYear()
    const response = await apiAuth.get('/user/all', {
      params: {
        page: 1,
        itemsPerPage: 999999,
        fields: 'hireDate resignationDate employmentStatus'
      }
    })

    const allEmployees = response.data.result.data
    const monthlyStats = Array(12).fill().map(() => ({
      hired: 0,
      resigned: 0
    }))

    allEmployees.forEach(emp => {
      const hireDate = new Date(emp.hireDate)
      if (hireDate.getFullYear() === currentYear) {
        monthlyStats[hireDate.getMonth()].hired++
      }

      if (emp.resignationDate) {
        const resignDate = new Date(emp.resignationDate)
        if (resignDate.getFullYear() === currentYear) {
          monthlyStats[resignDate.getMonth()].resigned++
        }
      }
    })

    // 確保在 DOM 更新後再初始化圖表
    await new Promise(resolve => setTimeout(resolve, 0))

    if (turnoverChart.value) {
      turnoverChart.value.destroy()
      turnoverChart.value = null
    }

    const ctx = turnoverChartRef.value?.getContext('2d')
    if (!ctx) return

    turnoverChart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        datasets: [
          {
            label: '入職人數',
            data: monthlyStats.map(stat => stat.hired),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: '離職人數',
            data: monthlyStats.map(stat => stat.resigned),
            borderColor: '#F44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 12,
              font: {
                family: '微軟正黑體',
                size: 12,
                weight: 500
              },
              usePointStyle: true,
              pointStyle: 'circle'
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
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('獲取流動統計失敗:', error)
    createSnackbar({
      text: '獲取流動統計資料失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  refreshChart: fetchTurnoverStats
})

onMounted(() => {
  fetchTurnoverStats()
})

onUnmounted(() => {
  if (turnoverChart.value) {
    turnoverChart.value.destroy()
    turnoverChart.value = null
  }
})
</script>

<style lang="scss" scoped>
@import '/src/styles/settings.scss';

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 0 20px rgba(0,0,0,0.3) !important;
}

.chart-container {
  width: 326px;
  height: 320px;
  @include lg {
    width: 480px;
  }
  @include xl {
    width: 360px;
  }
}

.chart-wrapper {
  position: relative;
  height: 100%;
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
</style>
