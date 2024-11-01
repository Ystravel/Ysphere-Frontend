import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole.js'
import { useApi } from '@/composables/axios'

export const useUserStore = defineStore('user', () => {
  const { api, apiAuth } = useApi()

  const token = ref('')
  const email = ref('')
  const name = ref('')
  const department = ref('')
  const avatar = ref('')
  const role = ref(UserRole.USER)
  const userId = ref('')

  const isLogin = computed(() => token.value.length > 0)
  const isUser = computed(() => role.value === UserRole.USER)
  const isAdmin = computed(() => role.value === UserRole.ADMIN)
  const isSuperAdmin = computed(() => role.value === UserRole.SUPER_ADMIN)
  const isHR = computed(() => role.value === UserRole.HR)
  const isManager = computed(() => role.value === UserRole.MANAGER)
  const isAccountant = computed(() => role.value === UserRole.ACCOUNTANT)
  const isIT = computed(() => role.value === UserRole.IT)

  const login = async (values) => {
    console.log(values)
    try {
      const { data } = await api.post('/user/login', values)
      token.value = data.result.token
      email.value = data.result.email
      role.value = data.result.role
      userId.value = data.result.userId
      console.log(data.result)
      return '登入成功'
    } catch (error) {
      console.log(error)
      return error?.response?.data?.message || '登入失敗，請稍後再試'
    }
  }

  // 新增 Google 登入邏輯
  const googleLogin = async (code) => {
    console.log('授權碼:', code)
    try {
      const response = await api.post('/user/google-login', {
        code // 改為發送 code
      })

      if (response.data.success) {
        token.value = response.data.result.token
        email.value = response.data.result.email
        role.value = response.data.result.role
        userId.value = response.data.result.userId
        return '登入成功'
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.log('Google登入失敗:', error.message)
      return '此Email尚未註冊，請聯絡人資'
    }
  }

  const profile = async () => {
    if (!isLogin.value) return

    try {
      const { data } = await apiAuth.get('/user/profile')
      role.value = data.result.role
      avatar.value = data.result.avatar
      name.value = data.result.name
      department.value = data.result.department
      userId.value = data.result.userId
      email.value = data.result.email
    } catch (error) {
      console.log(error)
      token.value = ''
      role.value = UserRole.USER
      avatar.value = ''
      name.value = ''
      userId.value = ''
      email.value = ''
    }
  }

  const logout = async () => {
    try {
      await apiAuth.delete('/user/logout')
    } catch (error) {
      console.log(error)
    }
    token.value = ''
    email.value = ''
    avatar.value = ''
    role.value = UserRole.USER
    userId.value = ''
  }

  return {
    token,
    email,
    name,
    department,
    avatar,
    role,
    userId,
    isLogin,
    isUser,
    isAdmin,
    isSuperAdmin,
    isHR,
    isManager,
    isAccountant,
    isIT,
    login,
    logout,
    profile,
    googleLogin
  }
}, {
  persist: {
    key: 'hrms',
    paths: ['token']
  }
})
