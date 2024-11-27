<template>
  <v-container max-width="2200">
    <v-row class="py-0 ma-sm-1 ma-md-3">
      <v-col
        cols="3"
      >
        <v-row>
          <v-col
            v-if="lgAndUp"
            class="px-2 px-xl-3"
          >
            <v-card
              class="d-flex px-4 py-8 justify-center flex-column align-center"
              elevation="4"
              rounded="lg"
              height="100%"
            >
              <div class="d-flex flex-column align-center justify-space-between h-100 pb-5">
                <span class="time-display text-blue-grey-darken-2 mb-1">{{ currentTime }}</span>
                <span class="date-display text-grey-darken-1">{{ currentDate }}</span>
              </div>
              <div>
                <v-btn
                  class="me-6"
                  height="34"
                  color="orange-darken-2"
                  size="default"
                >
                  測試
                </v-btn>
                <v-btn
                  color="blue-grey-lighten-1"
                  size="default"
                  height="34"
                >
                  測試
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        lg="5"
        class="px-4 px-xl-6"
      >
        <v-card
          class="d-flex px-6 pt-2 pt-sm-3 pb-4 pb-sm-5 "
          elevation="4"
          rounded="lg"
          height="180"
        >
          <v-col
            cols="12"
            class="ps-3 pb-6"
          >
            <h6>最新公告</h6>
            <v-list>
              <v-list-item class="bg-grey-lighten-4">
                <v-chip
                  size="small"
                  color="teal"
                  variant="outlined"
                >
                  系統
                </v-chip>
                <router-link
                  to="/"
                  class="ms-2 text-decoration-none text-blue-grey-darken-3"
                >
                  系統將於12/12大改版
                </router-link>

                STEVEN

                IT部 (A1IT)

                <span style="font-size: 12px;">2024-11-27 22:46發布</span>
              </v-list-item>
            </v-list>
          </v-col>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="4"
        class="px-2 px-xl-3"
      >
        <BirthdayReminder />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { definePage } from 'vue-router/auto'
import { useDisplay } from 'vuetify'
import BirthdayReminder from '@/components/BirthdayReminder.vue'

definePage({
  meta: {
    title: '永信星球 | ysphere',
    login: true
  }
})

const { lgAndUp } = useDisplay()

const currentTime = ref('')
const currentDate = ref('')

// 取得當前時間
const updateTime = () => {
  const date = new Date()

  // 時間：HH:mm:ss
  currentTime.value = date.toLocaleTimeString('zh-TW', {
    hour12: false
  })

  // 日期：YYYY/MM/DD 星期幾
  currentDate.value = date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long'
  })
}

onMounted(() => {
  updateTime() // 初始化時更新
  const interval = setInterval(updateTime, 1000) // 每秒更新
  onUnmounted(() => clearInterval(interval)) // 卸載元件時清除計時器
})
</script>

<style lang="scss" scoped>
.time-display {
  font-size: 28px;
  font-weight: 600;
}

.date-display {
  font-size: 13px;
  font-weight: 600;
}
</style>
