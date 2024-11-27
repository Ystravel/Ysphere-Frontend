<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex align-center mb-4">
      <v-icon
        icon="mdi-file-excel"
        size="26"
        class="me-2"
        color="success"
      />
      匯入員工資料
    </v-card-title>

    <v-card-text>
      <v-alert
        type="info"
        variant="outlined"
        border="start"
        density="compact"
        class="mb-4"
      >
        請使用 .xlsx 或 .xls 格式的 Excel 檔案
      </v-alert>

      <v-row class="mb-6">
        <v-col
          cols="12"
          sm="8"
        >
          <v-file-input
            v-model="file"
            :rules="[rules.required, rules.fileType]"
            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            label="選擇 Excel 檔案"
            :loading="loading"
            prepend-icon="mdi-file-excel"
            variant="outlined"
            show-size
            @update:model-value="handleFileChange"
          />
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <v-btn
            prepend-icon="mdi-cloud-download"
            variant="outlined"
            color="primary"
            :loading="loading"
            block
            @click="downloadTemplate"
          >
            下載範本
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="mb-4" />

      <!-- 上傳結果 -->
      <div
        v-if="results"
        class="results-section"
      >
        <div class="d-flex align-center mb-4">
          <v-chip
            :color="results.successCount ? 'success' : 'grey'"
            class="me-2"
          >
            成功：{{ results.successCount }} 筆
          </v-chip>
          <v-chip
            v-if="results.errorCount"
            color="error"
          >
            失敗：{{ results.errorCount }} 筆
          </v-chip>
        </div>

        <!-- 成功列表 -->
        <v-expand-transition>
          <div v-if="results.successData?.length">
            <v-expansion-panels variant="accordion">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  成功匯入的員工資料
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list lines="two">
                    <v-list-item
                      v-for="(user, index) in results.successData"
                      :key="index"
                      class="mb-2"
                    >
                      <div class="d-flex flex-column">
                        <div class="text-subtitle-2">
                          {{ user.name }} ({{ user.email }})
                        </div>
                        <div class="text-caption">
                          初始密碼：{{ user.initialPassword }}
                        </div>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-expand-transition>

        <!-- 錯誤列表 -->
        <v-expand-transition>
          <div
            v-if="results.errors?.length"
            class="mt-4"
          >
            <v-expansion-panels variant="accordion">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  錯誤詳情
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list>
                    <v-list-item
                      v-for="(error, index) in results.errors"
                      :key="index"
                      class="text-error"
                      density="compact"
                    >
                      <template #prepend>
                        <v-icon
                          icon="mdi-alert-circle"
                          color="error"
                          size="small"
                        />
                      </template>
                      {{ error.row }}: {{ error.error }}
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-expand-transition>
      </div>
    </v-card-text>

    <!-- 載入中遮罩 -->
    <v-overlay
      v-model="loading"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </v-overlay>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const loading = ref(false)
const file = ref(null)
const results = ref(null)

// 檔案驗證規則
const rules = {
  required: value => !!value || '請選擇檔案',
  fileType: value => {
    if (!value) return true
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
    const allowedExtensions = ['.xlsx', '.xls']

    const extension = value.name.toLowerCase().slice((value.name.lastIndexOf('.') - 1 >>> 0) + 2)
    return (allowedTypes.includes(value.type) || allowedExtensions.includes(`.${extension}`)) ||
      '請上傳 Excel 檔案 (.xlsx 或 .xls)'
  }
}

// 檔案變更處理
const handleFileChange = async (newFile) => {
  if (!newFile) return

  if (!rules.fileType(newFile)) {
    createSnackbar({
      text: '請上傳 Excel 檔案 (.xlsx 或 .xls)',
      snackbarProps: { color: 'error' }
    })
    file.value = null
    return
  }

  try {
    loading.value = true
    const formData = new FormData()
    formData.append('file', newFile)

    const { data } = await apiAuth.post('/excelImport/import', formData)

    results.value = data.result

    createSnackbar({
      text: `匯入完成：成功 ${data.result.successCount} 筆，失敗 ${data.result.errorCount} 筆`,
      snackbarProps: {
        color: data.result.errorCount === 0 ? 'success' : 'warning',
        timeout: 5000
      }
    })

    // 如果完全成功，清除檔案選擇
    if (data.result.errorCount === 0) {
      file.value = null
    }
  } catch (error) {
    console.error('匯入失敗:', error)
    createSnackbar({
      text: error.response?.data?.message || '匯入失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    loading.value = false
  }
}

// 下載範本
const downloadTemplate = () => {
  try {
    const link = document.createElement('a')
    link.href = '/templates/employee_import_template.xlsx'
    link.download = '員工資料匯入範本.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    createSnackbar({
      text: '下載範本失敗',
      snackbarProps: { color: 'error' }
    })
  }
}
</script>

<style scoped>
.results-section {
  min-height: 200px;
}
</style>
