<template>
  <v-app>
    <v-app-bar
      elevation="3"
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
    </v-app-bar>

    <v-navigation-drawer
      v-if="smAndUp"
      v-model="drawer"
      :rail="rail"
      permanent
    >
      <v-list class="h-100 d-flex flex-column justify-space-between">
        <div>
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
    <v-navigation-drawer
      v-if="!smAndUp"
      v-model="mdDrawer"
      class=" rounded-be-xl"
    >
      <v-list class="h-100 d-flex flex-column justify-space-between">
        <div>
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
import { ref, watch, onMounted } from 'vue'
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

const adminItems = [
  { to: '/user', text: '員工管理', icon: 'mdi-account-cog' },
  { to: '/department', text: '公司部門管理', icon: 'mdi-office-building-cog' }
]

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
