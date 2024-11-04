import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole.js'
import { useApi } from '@/composables/axios'

export const useUserStore = defineStore('user', () => {
  const { api, apiAuth } = useApi()

  const token = ref('')
  const email = ref('')
  const name = ref('')
  const englishName = ref('')
  const department = ref('')
  const avatar = ref('')
  const role = ref(UserRole.USER)
  const userId = ref('')
  const jobTitle = ref('')
  const birthDate = ref('')
  const cellphone = ref('')
  const address = ref('')

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
      jobTitle.value = data.result.jobTitle
      name.value = data.result.name
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
        name.value = response.data.result.name
        jobTitle.value = response.data.result.jobTitle
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
      name.value = data.result.name
      englishName.value = data.result.englishName
      cellphone.value = data.result.cellphone
      department.value = data.result.department
      userId.value = data.result.userId
      jobTitle.value = data.result.jobTitle
      birthDate.value = data.result.birthDate
      address.value = data.result.address
    } catch (error) {
      console.log(error)
      token.value = ''
      role.value = UserRole.USER
      department.value = ''
      jobTitle.value = ''
      name.value = ''
      englishName.value = ''
      cellphone.value = ''
      userId.value = ''
      birthDate.value = ''
      address.value = ''
    }
  }

  const updateProfile = async (profile) => {
    try {
      const { data } = await apiAuth.patch('/user/profile', profile)
      name.value = data.result.name
      englishName.value = data.result.englishName
      role.value = data.result.role
      userId.value = data.result.userId
      address.value = data.result.address
      cellphone.value = data.result.cellphone
      birthDate.value = data.result.birthDate
      // 返回更新後的數據以便在 Vue 組件中使用
      return data.result
    } catch (error) {
      console.log(error)
      throw error // 拋出錯誤以便在組件中處理
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const { data } = await apiAuth.patch('/user/change-password', {
        currentPassword,
        newPassword
      })

      if (!data.success) {
        throw new Error(data.message || '密碼更新失敗')
      }

      return {
        success: true,
        message: data.message || '密碼更新成功'
      }
    } catch (error) {
      // 統一錯誤格式
      const errorMessage = error.response?.data?.message || error.message || '密碼更新失敗'
      throw new Error(errorMessage)
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
    jobTitle.value = ''
    name.value = ''
    role.value = ''
    userId.value = ''
  }

  return {
    token,
    email,
    name,
    englishName,
    cellphone,
    department,
    avatar,
    role,
    jobTitle,
    userId,
    birthDate,
    address,
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
    googleLogin,
    updateProfile,
    changePassword
  }
}, {
  persist: {
    key: 'hrms',
    paths: ['token']
  }
})
