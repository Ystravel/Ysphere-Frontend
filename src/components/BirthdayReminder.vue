<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          class="mx-auto pa-8 pb-9"
          elevation="4"
          rounded="xl"
          min-height="392"
        >
          <h6
            style="font-size: 16px;"
            class="ps-1 mb-5 d-flex align-center"
          >
            近期壽星
          </h6>

          <v-card-text class="pt-0 px-1 birthday-container">
            <template v-if="isLoading">
              <div class="loading-overlay d-flex justify-center align-center">
                <v-progress-circular
                  indeterminate
                  color="blue-grey-darken-1"
                />
              </div>
            </template>

            <template v-else>
              <div
                v-if="birthdays.length > 0"
                class="birthday-list"
              >
                <v-list>
                  <v-list-item
                    v-for="birthday in birthdays"
                    :key="birthday._id"
                    class="mb-2 rounded-lg"
                    variant="outlined"
                  >
                    <template #prepend>
                      <v-avatar
                        size="36"
                        color="blue-grey-darken-1"
                      >
                        <v-img
                          v-if="birthday.avatar"
                          :src="birthday.avatar"
                          cover
                        />
                        <v-icon
                          v-else
                          icon="mdi-account"
                          color="blue-grey-darken-1"
                          size="20"
                        />
                      </v-avatar>
                    </template>

                    <v-list-item-title class="d-flex justify-space-between align-center">
                      <div>
                        <span
                          class="font-weight-medium"
                          style="font-size: 14px;"
                        >{{ birthday.name }}</span>
                        <div class="text-caption text-grey-darken-1">
                          {{ birthday.department?.name || '未分配部門' }}({{ birthday.departmentData?.departmentId }})
                        </div>
                      </div>
                      <v-chip
                        size="small"
                        :color="getDaysUntilBirthday(birthday.birthDate) === 0 ? 'pink-lighten-1' : 'teal-lighten-2'"
                        variant="flat"
                        class="ms-2 font-weight-medium"
                      >
                        {{ formatBirthday(birthday.birthDate) }}
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>

                <div
                  class="text-center mt-4 text-grey-darken-1"
                  style="font-size: 14px;"
                >
                  未來兩週共 <span class="text-pink-lighten-1 font-weight-bold">{{ birthdays.length }}</span> 位壽星
                </div>
              </div>

              <v-alert
                v-else
                type="info"
                variant="tonal"
                class="mb-0 mt-4"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-information"
                    color="info"
                  />
                </template>
                未來兩週內無壽星
              </v-alert>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const birthdays = ref([])
const isLoading = ref(false)

// 計算距離生日還有幾天
const getDaysUntilBirthday = (birthDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const birthday = new Date(birthDate)
  const currentYear = today.getFullYear()

  // 設定成今年的生日
  birthday.setFullYear(currentYear)

  // 如果今年的生日已過，就要看明年的生日
  if (birthday < today) {
    birthday.setFullYear(currentYear + 1)
  }

  const timeDiff = birthday - today
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
}

// 格式化生日顯示
const formatBirthday = (birthDate) => {
  const date = new Date(birthDate)
  const daysUntil = getDaysUntilBirthday(birthDate)

  if (daysUntil === 0) {
    return `${date.getMonth() + 1}/${date.getDate()} (今天)`
  }

  return `${date.getMonth() + 1}/${date.getDate()} (${daysUntil}天後)`
}

// 檢查日期是否在未來兩週內
const isInNextTwoWeeks = (birthDate) => {
  const daysUntil = getDaysUntilBirthday(birthDate)
  return daysUntil >= 0 && daysUntil <= 13 // 0-13天內
}

// 載入生日資料
const loadBirthdays = async () => {
  isLoading.value = true
  try {
    const { data } = await apiAuth.get('/user/all', {
      params: {
        page: 1,
        itemsPerPage: 999999,
        fields: 'name birthDate department employmentStatus avatar' // 加入 avatar
      }
    })

    if (data.success) {
      console.log('Birthday data:', data.result.data)
      birthdays.value = data.result.data
        .filter(user =>
          user.employmentStatus === '在職' &&
          user.birthDate &&
          isInNextTwoWeeks(user.birthDate)
        )
        .sort((a, b) =>
          getDaysUntilBirthday(a.birthDate) - getDaysUntilBirthday(b.birthDate)
        )
    }
  } catch (error) {
    console.error('載入壽星資料失敗:', error)
    createSnackbar({
      text: '載入壽星資料失敗',
      snackbarProps: { color: 'error' }
    })
  } finally {
    isLoading.value = false
  }
}

// 暴露刷新方法給父組件
defineExpose({
  refreshData: loadBirthdays
})

// 監聽路由變化自動更新數據
watch(() => window.location.href, () => {
  loadBirthdays()
})

// 組件掛載時載入數據
onMounted(() => {
  loadBirthdays()
})
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 0 20px rgba(0,0,0,0.3) !important;
}

.birthday-container {
  max-height: 280px;
  overflow-y: auto;
  position: relative;
  min-height: 280px; /* 添加最小高度確保 loading 狀態時的顯示 */
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

.birthday-list {
  padding-right: 8px;
}

/* 自定義滾動條樣式 */
.birthday-container::-webkit-scrollbar {
  width: 6px;
}

.birthday-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.birthday-container::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.birthday-container::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
</style>
