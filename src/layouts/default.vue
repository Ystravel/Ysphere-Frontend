<template>
  <v-app>
    <v-app-bar
      elevation="0"
      border="b-sm"
      height="100"
    >
      <v-app-bar-nav-icon
        class="ms-4"
        @click.stop="toggleDrawer"
      />
      <router-link
        to="/"
        class="d-flex"
      >
        <v-img
          src="/src/assets/image/永信旅遊LOGO.png"
          width="150"
          class="ms-2"
        />
      </router-link>
      <v-spacer />
      <v-btn
        v-if="user.isLogin && smAndUp"
        prepend-icon="mdi-account-arrow-right"
        variant="outlined"
        rounded="0"
        color="blue-grey-darken-2"
        class="me-6"
        @click="logout"
      >
        登出
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="smAndUp"
      v-model="drawer"
      :rail="rail"
      permanent
    >
      <v-list class="h-100 d-flex flex-column pa-0">
        <div>
          <v-card
            v-show="!rail"
            elevation="0"
            rounded="0"
            height="172"
            class="pa-0 mb-2 card-bg"
            to="/profile"
          >
            <div class="card-blur pt-2 pb-4 px-2">
              <v-card-title class="ps-5 pb-3">
                <v-avatar
                  size="48"
                  style="box-shadow: 0 0 10px rgba(255,255,255,1);"
                >
                  <v-img
                    :src="avatar"
                  />
                </v-avatar>
              </v-card-title>
              <v-card-text style="letter-spacing: 2px; color: white; line-height: 24px;">
                <v-row>
                  <v-col
                    cols="12"
                    class="ps-4 pb-0 pt-4"
                  >
                    <span style="font-size: 18px; font-weight: 600;">{{ user.name }}</span>
                  </v-col>
                  <v-col
                    cols="12"
                    class="ps-4 pb-0 pt-0"
                  >
                    {{ user.userId }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="ps-4 pb-0 pt-0"
                  >
                    {{ user.jobTitle }}
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-card>
          <template v-if="user.isLogin">
            <v-list-item
              v-for="userItem in userItems"
              :key="userItem.to"
              :to="userItem.to"
            >
              <template #prepend>
                <v-icon>{{ userItem.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ userItem.text }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-divider class="my-3" />
          <template v-if="!user.isUser">
            <v-list-item
              v-for="item in adminItems"
              :key="item.to"
              :to="item.to"
            >
              <template #prepend>
                <v-icon>{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </template>
        </div>
        <div>
          <v-list-item
            v-if="!user.isLogin"
            to="/login"
          >
            <template #prepend>
              <v-icon>mdi-account-arrow-left</v-icon>
            </template>
            <v-list-item-title>登入</v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-if="!smAndUp"
      v-model="mdDrawer"
      border="0"
      class=" rounded-be-xl"
    >
      <v-list class="h-100 d-flex flex-column justify-space-between pa-0">
        <div>
          <v-card
            elevation="0"
            rounded="0"
            height="172"
            class="pa-0 card-bg"
          >
            <div class="card-blur pt-2 pb-4 px-2">
              <v-card-title class="ps-5 pb-3">
                <v-avatar
                  size="48"
                  style="box-shadow: 0 0 10px rgba(255,255,255,1);"
                >
                  <v-img
                    :src="avatar"
                  />
                </v-avatar>
              </v-card-title>
              <v-card-text style="letter-spacing: 2px; color: white; line-height: 24px;">
                <v-row>
                  <v-col
                    cols="12"
                    class="ps-4 pb-0 pt-4"
                  >
                    <span style="font-size: 18px; font-weight: 600;">{{ user.name }}</span>
                  </v-col>
                  <v-col
                    cols="12"
                    class="ps-4 pb-0 pt-0"
                  >
                    {{ user.userId }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="ps-4 pb-0 pt-0"
                  >
                    {{ user.jobTitle }}
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-card>
          <template v-if="user.isLogin">
            <v-list-item
              v-for="userItem in userItems"
              :key="userItem.to"
              :to="userItem.to"
            >
              <template #prepend>
                <v-icon>{{ userItem.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ userItem.text }}</v-list-item-title>
            </v-list-item>
          </template>
          <template v-if="!user.isUser">
            <v-list-item
              v-for="item in adminItems"
              :key="item.to"
              :to="item.to"
            >
              <template #prepend>
                <v-icon>{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </template>
        </div>
        <div>
          <v-list-item
            v-if="!user.isLogin"
            to="/login"
          >
            <template #prepend>
              <v-icon>mdi-account-arrow-left</v-icon>
            </template>
            <v-list-item-title>登入</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="user.isLogin"
            @click="logout"
          >
            <template #prepend>
              <v-icon>mdi-account-arrow-right</v-icon>
            </template>
            <v-list-item-title>登出</v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { useDisplay } from 'vuetify'

const { smAndUp, xlAndUp, name: breakpoint } = useDisplay()

const drawer = ref(true)
const mdDrawer = ref(false)
const rail = ref(false)
const user = useUserStore()
const createSnackbar = useSnackbar()
const router = useRouter()

const userItems = [
  { to: '/profile', text: '個人資料管理', icon: 'mdi-account' }
]

const adminItems = [
  { to: '/user', text: '員工管理', icon: 'mdi-account-cog' },
  { to: '/department', text: '公司部門管理', icon: 'mdi-office-building-cog' }
]

const avatar = computed(() => {
  return `https://api.multiavatar.com/${user.userId}.png`
})

// 監聽螢幕尺寸變化
watch(() => breakpoint.value, (newBreakpoint) => {
  if (xlAndUp.value) {
    // XL 以上，預設展開
    rail.value = false
  } else if (smAndUp.value) {
    // SM 到 XL 之間，預設收合（只顯示圖示）
    rail.value = true
  }
}, { immediate: true })

// 控制抽屜展開的函數
// 改進的 toggleDrawer 函數
const toggleDrawer = () => {
  if (!smAndUp.value) {
    // SM 以下，切換 mdDrawer
    mdDrawer.value = !mdDrawer.value
  } else {
    // SM 以上，切換 rail 狀態
    rail.value = !rail.value
  }
}

// 組件掛載時設置初始狀態
onMounted(() => {
  if (xlAndUp.value) {
    rail.value = false // XL 以上，預設展開
  } else if (smAndUp.value) {
    rail.value = true // SM 到 XL 之間，預設收合
  }
})

const logout = async () => {
  await user.logout()
  createSnackbar({
    text: '登出成功',
    snackbarProps: {
      color: 'teal-darken-1'
    }
  })

  router.push('/login')
}
</script>

<style lang="scss" scoped>
.card-bg {
  // background: linear-gradient(135deg, #37474F 15%, #90aabe);
  background: url(/src/assets/image/bg_profile.webp);
  background-size: cover;
}
.card-blur {
  background: linear-gradient(135deg, #37474F 30%, rgba(255,255,255,0));
}
</style>
