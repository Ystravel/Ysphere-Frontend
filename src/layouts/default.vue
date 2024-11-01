<template>
  <v-app>
    <v-navigation-drawer permanent>
      <v-list class="h-100 d-flex flex-column justify-space-between">
        <div>
          <v-card
            elevation="0"
          >
            <v-card-text>
              <router-link
                to="/"
                class="d-flex"
              >
                <v-img
                  src="/src/assets/image/永信旅遊LOGO.png"
                  height="32"
                />
              </router-link>
            </v-card-text>
          </v-card>

          <!-- <v-list-item
            v-for="navItem in navItems"
            :key="navItem.to"
            :to="navItem.to"
            :prepend-icon="navItem.icon"
          >
            {{ navItem.text }}
          </v-list-item>
          <v-divider class="my-3" /> -->
          <template v-if="!user.isUser">
            <v-list-item
              v-for="item in adminItems"
              :key="item.to"
              :to="item.to"
              :prepend-icon="item.icon"
            >
              {{ item.text }}
            </v-list-item>
          </template>
        </div>
        <div>
          <v-list-item
            v-if="!user.isLogin"
            to="/login"
            prepend-icon="mdi-account-arrow-left"
          >
            登入
          </v-list-item>
          <v-list-item
            v-if="user.isLogin"
            prepend-icon="mdi-account-arrow-right"
            @click="logout"
          >
            登出
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
// import { useDisplay } from 'vuetify'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'

// const { mdAndUp } = useDisplay()
const user = useUserStore()
const createSnackbar = useSnackbar()
const router = useRouter()

// const navItems = [
//   { to: '/minutes', text: '會議記錄', icon: 'mdi-note-edit-outline' },
//   { to: '/meetingRoom', text: '會議室', icon: 'mdi-office-building-outline' }
// ]

const adminItems = [
  { to: '/user', text: '員工管理', icon: 'mdi-account-cog' },
  { to: '/companyAndDepartment', text: '公司部門管理', icon: 'mdi-office-building-cog' }
]

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
