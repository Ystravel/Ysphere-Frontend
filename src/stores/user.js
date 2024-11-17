import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole.js'
import { useApi } from '@/composables/axios'

export const useUserStore = defineStore('user', () => {
  const { api, apiAuth } = useApi()

  const token = ref('')
  const email = ref('')
  const IDNumber = ref('')
  const gender = ref('')
  const name = ref('')
  const englishName = ref('')
  const cellphone = ref('')
  const salary = ref('')
  const extNumber = ref('')
  const birthDate = ref('')
  const permanentAddress = ref('')
  const contactAddress = ref('')
  const department = ref('')
  const jobTitle = ref('')
  const role = ref(UserRole.USER)
  const userId = ref('')
  const hireDate = ref('')
  const emergencyName = ref('')
  const emergencyCellphone = ref('')
  const printNumber = ref('')
  const guideLicense = ref('')
  const avatar = ref('')

  const isLogin = computed(() => token.value.length > 0)
  const isUser = computed(() => role.value === UserRole.USER)
  const isAdmin = computed(() => role.value === UserRole.ADMIN)
  const isSuperAdmin = computed(() => role.value === UserRole.SUPER_ADMIN)
  const isHR = computed(() => role.value === UserRole.HR)
  const isManager = computed(() => role.value === UserRole.MANAGER)
  const isAccountant = computed(() => role.value === UserRole.ACCOUNTANT)
  const isIT = computed(() => role.value === UserRole.IT)

  const login = async (values) => {
    try {
      const { data } = await api.post('/user/login', values)
      token.value = data.result.token
      name.value = data.result.name
      englishName.value = data.result.englishName
      birthDate.value = data.result.birthDate
      gender.value = data.result.gender
      cellphone.value = data.result.cellphone
      email.value = data.result.email
      permanentAddress.value = data.result.permanentAddress
      contactAddress.value = data.result.contactAddress
      emergencyName.value = data.result.emergencyName
      emergencyCellphone.value = data.result.emergencyCellphone
      userId.value = data.result.userId
      department.value = {
        _id: data.result.department._id,
        name: data.result.department.name,
        companyId: data.result.department.companyId
      }
      hireDate.value = data.result.hireDate
      extNumber.value = data.result.extNumber
      printNumber.value = data.result.printNumber
      guideLicense.value = data.result.guideLicense
      role.value = data.result.role
      jobTitle.value = data.result.jobTitle
      avatar.value = data.result.avatar
      await profile()
      return '登入成功'
    } catch (error) {
      console.log(error)
      return error?.response?.data?.message || '登入失敗，請稍後再試'
    }
  }

  // 新增 Google 登入邏輯
  const googleLogin = async (code) => {
    try {
      const response = await api.post('/user/google-login', {
        code // 改為發送 code
      })

      if (response.data.success) {
        token.value = response.data.result.token
        name.value = response.data.result.name
        englishName.value = response.data.result.englishName
        birthDate.value = response.data.result.birthDate
        gender.value = response.data.result.gender
        cellphone.value = response.data.result.cellphone
        email.value = response.data.result.email
        permanentAddress.value = response.data.result.permanentAddress
        contactAddress.value = response.data.result.contactAddress
        emergencyName.value = response.data.result.emergencyName
        emergencyCellphone.value = response.data.result.emergencyCellphone
        userId.value = response.data.result.userId
        department.value = {
          _id: response.data.result.department._id,
          name: response.data.result.department.name,
          companyId: response.data.result.department.companyId
        }
        hireDate.value = response.data.result.hireDate
        extNumber.value = response.data.result.extNumber
        printNumber.value = response.data.result.printNumber
        guideLicense.value = response.data.result.guideLicense
        role.value = response.data.result.role
        jobTitle.value = response.data.result.jobTitle
        avatar.value = response.data.result.avatar
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
      email.value = data.result.email
      IDNumber.value = data.result.idNumber
      gender.value = data.result.gender
      name.value = data.result.name
      englishName.value = data.result.englishName
      cellphone.value = data.result.cellphone
      salary.value = data.result.salary
      extNumber.value = data.result.extNumber
      birthDate.value = data.result.birthDate
      permanentAddress.value = data.result.permanentAddress
      contactAddress.value = data.result.contactAddress
      department.value = {
        _id: data.result.department._id,
        name: data.result.department.name,
        companyId: data.result.department.companyId
      }
      jobTitle.value = data.result.jobTitle
      role.value = data.result.role
      userId.value = data.result.userId
      hireDate.value = data.result.hireDate
      emergencyName.value = data.result.emergencyName
      emergencyCellphone.value = data.result.emergencyCellphone
      printNumber.value = data.result.printNumber
      guideLicense.value = data.result.guideLicense
      avatar.value = data.result.avatar
    } catch (error) {
      console.log(error)
      token.value = ''
      email.value = ''
      IDNumber.value = ''
      gender.value = ''
      name.value = ''
      englishName.value = ''
      cellphone.value = ''
      salary.value = ''
      extNumber.value = ''
      birthDate.value = ''
      permanentAddress.value = ''
      contactAddress.value = ''
      department.value = ''
      jobTitle.value = ''
      role.value = UserRole.USER
      userId.value = ''
      hireDate.value = ''
      emergencyName.value = ''
      emergencyCellphone.value = ''
      printNumber.value = ''
      guideLicense.value = ''
      avatar.value = ''
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

  // 添加更新頭像的方法
  const updateAvatar = async (formData) => {
    try {
      const { data } = await apiAuth.patch('/user/avatar', formData)
      if (!data.success) {
        throw new Error(data.message || '頭像更新失敗')
      }
      avatar.value = data.result
      return {
        success: true,
        message: '頭像更新成功'
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '頭像更新失敗'
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
    IDNumber.value = ''
    gender.value = ''
    name.value = ''
    englishName.value = ''
    cellphone.value = ''
    salary.value = ''
    extNumber.value = ''
    birthDate.value = ''
    permanentAddress.value = ''
    contactAddress.value = ''
    department.value = ''
    jobTitle.value = ''
    role.value = ''
    userId.value = ''
    hireDate.value = ''
    emergencyName.value = ''
    emergencyCellphone.value = ''
    printNumber.value = ''
    guideLicense.value = ''
    avatar.value = ''
  }

  return {
    token,
    email,
    IDNumber,
    gender,
    name,
    englishName,
    cellphone,
    salary,
    extNumber,
    birthDate,
    permanentAddress,
    contactAddress,
    department,
    jobTitle,
    role,
    userId,
    hireDate,
    emergencyName,
    emergencyCellphone,
    printNumber,
    guideLicense,
    avatar,
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
    changePassword,
    updateAvatar

  }
}, {
  persist: {
    key: 'erp',
    paths: ['token']
  }
})
