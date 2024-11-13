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
      <v-icon
        icon="mdi-email-outline"
        size="22"
        color="blue-grey-darken-3"
        class="me-6"
      />
      <v-icon
        icon="mdi-bell-outline"
        size="22"
        color="blue-grey-darken-3"
        class="me-8"
      />
      <v-btn
        v-if="user.isLogin && mdAndUp"
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
      v-if="mdAndUp"
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
            width="260"
            class="pa-0 card-bg"
            to="/profile"
          >
            <div class="card-blur pt-2 pb-4 px-2">
              <v-card-title class="ps-5 pb-3">
                <v-avatar
                  size="48"
                  style="box-shadow: 0 0 10px rgba(255,255,255,1);"
                >
                  <v-img
                    :src="user.avatar"
                  />
                </v-avatar>
              </v-card-title>
              <v-card-text style="letter-spacing: 2px; color: white; line-height: 24px;">
                <v-row>
                  <v-col
                    cols="12"
                    class="ps-4 pb-0 pt-4"
                  >
                    <span style="font-size: 17px; font-weight: 600;">{{ user.name }}</span>
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
              class="mt-2"
              :to="userItem.to"
            >
              <template #prepend>
                <v-icon>{{ userItem.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ userItem.text }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-divider
            v-if="!user.isUser"
            color="blue-grey-darken-4"
            opacity="0.3"
            class="my-2"
          />
          <template v-if="!user.isUser">
            <v-list-item
              v-for="item in filteredAdminItems"
              :key="item.to"
              :to="item.to"
              class="mb-2"
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
      v-if="!mdAndUp"
      v-model="mdDrawer"
      border="0"
      class=" rounded-be-xl"
    >
      <v-list class="h-100 pa-0">
        <div>
          <v-card
            elevation="0"
            rounded="0"
            height="172"
            class="pa-0 card-bg"
            to="/profile"
          >
            <div class="card-blur pt-2 pb-4 px-2">
              <v-card-title class="ps-5 pb-3">
                <v-avatar
                  size="48"
                  style="box-shadow: 0 0 10px rgba(255,255,255,1);"
                >
                  <v-img
                    :src="user.avatar"
                  />
                </v-avatar>
              </v-card-title>
              <v-card-text style="letter-spacing: 2px; color: white; line-height: 24px;">
                <v-row>
                  <v-col
                    cols="12"
                    class="ps-4 pb-0 pt-4"
                  >
                    <span style="font-size: 17px; font-weight: 600;">{{ user.name }}</span>
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
              class="mt-4"
            >
              <template #prepend>
                <v-icon>{{ userItem.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ userItem.text }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-divider
            v-if="!user.isUser"
            class="mt-4"
          />
          <template v-if="!user.isUser">
            <v-list-item
              v-for="item in filteredAdminItems"
              :key="item.to"
              :to="item.to"
              class="mt-4"
            >
              <template #prepend>
                <v-icon>{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </template>
        </div>
        <v-divider class="mt-4" />
        <div>
          <v-list-item
            v-if="!user.isLogin"
            to="/login"
            class="mt-4"
          >
            <template #prepend>
              <v-icon>mdi-account-arrow-left</v-icon>
            </template>
            <v-list-item-title>登入</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="user.isLogin"
            class="mt-4"
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

const { mdAndUp, xlAndUp, name: breakpoint } = useDisplay()

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
  {
    to: '/user',
    text: '員工管理',
    icon: 'mdi-account-cog',
    roles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTANT'] // 只有最高管理者和人資可以看到
  },
  {
    to: '/department',
    text: '公司部門管理',
    icon: 'mdi-office-building-cog',
    roles: ['SUPER_ADMIN', 'ADMIN'] // 最高管理者、人資和經理可以看到
  },
  // {
  //   to: '/asset',
  //   text: '設備管理',
  //   icon: 'mdi-desktop-tower-monitor',
  //   roles: ['SUPER_ADMIN', 'ADMIN', 'IT'] // 最高管理者和 IT 人員可以看到
  // },
  {
    to: '/auditLog',
    text: '異動紀錄',
    icon: 'mdi-history',
    roles: ['SUPER_ADMIN', 'ADMIN', 'IT']
  }
]

// 新增一個計算屬性來過濾可見的選單項目
const filteredAdminItems = computed(() => {
  return adminItems.filter(item => {
    return item.roles.some(role => {
      switch (role) {
        case 'SUPER_ADMIN':
          return user.isSuperAdmin
        case 'HR':
          return user.isHR
        case 'MANAGER':
          return user.isManager
        case 'IT':
          return user.isIT
        case 'ACCOUNTANT':
          return user.isAccountant
        case 'ADMIN':
          return user.isAdmin
        default:
          return false
      }
    })
  })
})

// 監聽螢幕尺寸變化
watch(() => breakpoint.value, (newBreakpoint) => {
  if (xlAndUp.value) {
    // XL 以上，預設展開
    rail.value = false
  } else if (mdAndUp.value) {
    // SM 到 XL 之間，預設收合（只顯示圖示）
    rail.value = true
  }
}, { immediate: true })

// 控制抽屜展開的函數
// 改進的 toggleDrawer 函數
const toggleDrawer = () => {
  if (!mdAndUp.value) {
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
  } else if (mdAndUp.value) {
    rail.value = true // SM 到 XL 之間，預設收合
  }
})

const logout = async () => {
  await user.logout()
  createSnackbar({
    text: '登出成功',
    snackbarProps: {
      color: 'teal-lighten-1'
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
  background: linear-gradient(135deg, #37474F 32%, rgba(255,255,255,0));
}
</style>
