<!-- default layout -->
<template>
  <v-app>
    <v-app-bar
      elevation="0"
      border="b-sm"
      height="100"
      class="position-fixed"
    >
      <v-app-bar-nav-icon
        class="ms-4"
        color="blue-grey-darken-3"
        @click.stop="toggleDrawer"
      />
      <router-link
        to="/"
        class="d-flex"
      >
        <v-img
          src="/src/assets/image/logo_horizontal.png"
          width="170"
          class="ms-2 ms-sm-4"
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
      :expand-on-hover="rail"
      class="position-fixed"
    >
      <v-list class="h-100 d-flex flex-column pa-0">
        <div>
          <v-card
            v-show="!rail"
            v-tooltip="'個人資料管理'"
            elevation="0"
            rounded="0"
            height="172"
            width="260"
            class="pa-0 card-bg position-relative"
            :class="{ 'loaded': isBackgroundLoaded }"
            to="/profile"
          >
            <!-- 添加 skeleton -->
            <v-skeleton-loader
              v-if="!isBackgroundLoaded"
              class="position-absolute w-100 h-100 pa-0 ma-0"
            />

            <!-- 添加隱藏的圖片用於預加載 -->
            <img
              src="/src/assets/image/bg_profile_robot.png"
              alt="background"
              style="display: none;"
              @load="handleImageLoad"
            >
            <div class="card-blur pt-2 pb-4 px-2">
              <v-card-title
                class="ps-5 pb-3 d-flex justify-space-between pe-2"
              >
                <v-avatar
                  size="48"
                  style="box-shadow: 0 0 10px rgba(255,255,255,1);"
                >
                  <v-skeleton-loader
                    v-if="!isAvatarLoaded"
                    type="avatar"
                  />
                  <v-img
                    v-show="isAvatarLoaded"
                    :src="user.avatar"
                    @load="handleAvatarLoad"
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
              color="blue-grey-darken-3"
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
            <template
              v-for="item in filteredAdminItems"
              :key="item.text"
            >
              <!-- 有子選單的項目 -->
              <v-list-group
                v-if="item.children"
                :value="openedGroups.includes(item.text)"
                @click="toggleGroup(item.text)"
              >
                <template #activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    color="blue-grey-darken-3"
                  >
                    <template #prepend>
                      <v-icon>{{ item.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item>
                </template>

                <v-list-item
                  v-for="child in item.children"
                  :key="child.to"
                  :to="child.to"
                  color="blue-grey-darken-3"
                >
                  <template #prepend>
                    <v-icon>{{ child.icon }}</v-icon>
                  </template>
                  <v-list-item-title>{{ child.text }}</v-list-item-title>
                </v-list-item>
              </v-list-group>

              <!-- 沒有子選單的項目 -->
              <v-list-item
                v-else
                :to="item.to"
                color="blue-grey-darken-3"
                class="mt-2"
              >
                <template #prepend>
                  <v-icon>{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </template>
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
      class=" rounded-be-xl position-fixed"
    >
      <v-list class="h-100 pa-0 overflow-auto">
        <div>
          <v-card
            v-tooltip="'個人資料管理'"
            elevation="0"
            rounded="0"
            height="172"
            class="pa-0 card-bg"
            :class="{ 'loaded': isBackgroundLoaded }"
            to="/profile"
          >
            <!-- 添加 skeleton
            <v-skeleton-loader
              v-if="!isBackgroundLoaded"
              class="position-absolute w-100 h-100 pa-0 ma-0"
            /> -->

            <div class="card-blur pt-2 pb-4 px-2">
              <v-card-title class="ps-5 pb-3">
                <v-avatar
                  size="48"
                  style="box-shadow: 0 0 10px rgba(255,255,255,1);"
                >
                  <v-skeleton-loader
                    v-if="!isAvatarLoaded"
                    type="avatar"
                  />
                  <v-img
                    v-show="isAvatarLoaded"
                    :src="user.avatar"
                    @load="handleAvatarLoad"
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
              color="blue-grey-darken-3"
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
            <template
              v-for="item in filteredAdminItems"
              :key="item.text"
            >
              <!-- 有子選單的項目 -->
              <v-list-group v-if="item.children">
                <template #activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    color="blue-grey-darken-3"
                  >
                    <template #prepend>
                      <v-icon>{{ item.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item>
                </template>

                <v-list-item
                  v-for="child in item.children"
                  :key="child.to"
                  :to="child.to"
                  color="blue-grey-darken-3"
                >
                  <template #prepend>
                    <v-icon>{{ child.icon }}</v-icon>
                  </template>
                  <v-list-item-title>{{ child.text }}</v-list-item-title>
                </v-list-item>
              </v-list-group>

              <!-- 沒有子選單的項目 -->
              <v-list-item
                v-else
                :to="item.to"
                color="blue-grey-darken-3"
                class="mt-2"
              >
                <template #prepend>
                  <v-icon>{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </template>
          </template>
        </div>
        <v-divider class="mt-4" />
        <div>
          <v-list-item
            v-if="user.isLogin"
            class="mt-4"
            color="blue-grey-darken-3"
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
import { useRouter, useRoute } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { useDisplay } from 'vuetify'

const { mdAndUp, xlAndUp, name: breakpoint } = useDisplay()

const drawer = ref(true)
const mdDrawer = ref(false)
const rail = ref(false)
const user = useUserStore()
const createSnackbar = useSnackbar()
const router = useRouter()
const route = useRoute()

const openedGroups = ref([])
const isBackgroundLoaded = ref(false)
const isAvatarLoaded = ref(false)
const handleImageLoad = () => {
  isBackgroundLoaded.value = true
}

const handleAvatarLoad = () => {
  setTimeout(() => {
    isAvatarLoaded.value = true
  }, 100)
}

const toggleGroup = (group) => {
  if (openedGroups.value.includes(group)) {
    openedGroups.value = openedGroups.value.filter(g => g !== group)
  } else {
    openedGroups.value.push(group)
  }
}

const userItems = [
  { to: '/announcement', text: '所有公告', icon: 'mdi-bullhorn' },
  { to: '/ITService', text: 'IT 維修服務', icon: 'mdi-wrench' }
]

const adminItems = [
  {
    text: '人事管理',
    icon: 'mdi-account-group',
    roles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTANT'],
    children: [
      {
        to: '/user',
        text: '員工管理',
        icon: 'mdi-account-cog',
        roles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTANT']
      },
      {
        to: '/tempUser',
        text: '招聘資料管理',
        icon: 'mdi-account-clock',
        roles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTANT']
      }
    ]
  },
  {
    to: '/department',
    text: '公司部門管理',
    icon: 'mdi-office-building-cog',
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    to: '/ITServiceAdmin',
    text: 'IT 維修服務管理',
    icon: 'mdi-wrench-cog',
    roles: ['SUPER_ADMIN', 'ADMIN', 'IT']
  },
  {
    to: '/formGenerator',
    text: '表單產生器',
    icon: 'mdi-chart-box-outline',
    roles: ['SUPER_ADMIN', 'ADMIN', 'IT', 'MANAGER']
  },
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
    const hasPermission = item.roles.some(role => {
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

    // 如果有子項目，也需要檢查子項目的權限
    if (item.children) {
      item.children = item.children.filter(child => {
        return child.roles.some(role => {
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
      // 只有當子項目不為空時才顯示父項目
      return hasPermission && item.children.length > 0
    }

    return hasPermission
  })
})

// 監聽路由變化，當路由改變時收合所有子選單
watch(() => route.path, () => {
  openedGroups.value = []
})

// 監聽螢幕尺寸變化
watch(() => breakpoint.value, () => {
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

// 監聽 avatar 變化時重置 loading 狀態
watch(() => user.avatar, (newAvatar) => {
  if (newAvatar) {
    isAvatarLoaded.value = false
    const img = new Image()
    img.onload = () => {
      handleAvatarLoad()
    }
    img.src = newAvatar
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.card-bg {
  background: url(/src/assets/image/bg_profile_robot.png);
  background-size: cover;
  transition: opacity 0.3s ease;

}
.card-blur {
  background: linear-gradient(135deg, #37474F 20%, rgba(255,255,255,0));
}
</style>
