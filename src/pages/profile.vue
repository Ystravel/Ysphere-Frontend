<template>
  <v-container max-width="2200">
    <v-row>
      <v-col
        v-if="isLgmUp"
        md="3"
      >
        <v-row class="elevation-4 rounded-xl py-8 px-1 px-sm-10 mt-2 mt-sm-10 mx-10">
          <v-card
            width="100%"
            elevation="0"
          >
            <v-row class="text-center">
              <v-col cols="12">
                <v-avatar
                  size="100"
                >
                  <v-img
                    :src="avatar"
                  />
                </v-avatar>
              </v-col>
              <v-col>
                <div
                  class="text-h6 mb-3 opacity-90"
                >
                  {{ user.name }}
                </div>
                <div
                  class="text-subtitle-2 mb-4 opacity-70"
                >
                  {{ user.userId }}
                </div>
                <div
                  style="font-size: 15px; font-weight: 500;"
                  class="opacity-90 mb-12"
                >
                  {{ user.jobTitle }}
                </div>
                <v-btn
                  prepend-icon="mdi-camera-outline"
                  color="blue-grey-darken-2"
                  variant="outlined"
                >
                  更換大頭貼
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </v-col>
      <v-col
        xl="9"
      >
        <v-row class="elevation-4 rounded-xl pt-8 pb-0 px-1 px-sm-10 mt-2 mt-sm-10 mx-0 mx-sm-4 ms-xl-0 me-xl-10">
          <v-col
            cols="12"
            class="d-flex justify-space-between"
          >
            <h3>
              個人資料管理&nbsp;&nbsp;&nbsp;<span
                v-if="mdAndUp"
                class="text-subtitle-2 opacity-80"
              ><span class="text-red-darken-2">* </span>若有需要修改 請聯絡人資 ( 密碼可自行修改 )</span>
            </h3>
            <div>
              <v-btn
                v-if="mdAndUp"

                color="blue-grey-darken-2"
                prepend-icon="mdi-pencil"
                variant="outlined"
                height="36"
                @click="showPasswordDialog = true"
              >
                修改密碼
              </v-btn>
              <v-btn
                v-if="!mdAndUp"
                color="blue-grey-darken-2"
                prepend-icon="mdi-pencil"
                variant="outlined"
                size="small"
                height="32"
                @click="showPasswordDialog = true"
              >
                修改密碼
              </v-btn>
              <v-btn
                v-if="!mdAndUp"
                color="blue-grey-darken-2"
                class="ms-4"
                size="24"
                elevation="0"
                rounded="xl"
              >
                <v-icon
                  icon="mdi-camera-outline"
                  size="14"
                />
              </v-btn>
              <v-btn
                v-if="!isLgmUp && mdAndUp"
                color="blue-grey-darken-2"
                class="ms-4"
                size="28"
                elevation="0"
                rounded="xl"
              >
                <v-icon
                  icon="mdi-camera-outline"
                  size="16"
                />
              </v-btn>
            </div>
          </v-col>
          <v-col
            v-if="!mdAndUp"
            cols="12"
          >
            <span
              class="text-subtitle-2 opacity-80"
            ><span class="text-red-darken-2">* </span>若有需要修改 請聯絡人資 ( 密碼可自行修改 )</span>
          </v-col>
          <v-col>
            <v-divider class="mb-8" />
          </v-col>
          <v-col cols="12">
            <v-row
              class="text-blue-grey-darken-3 mb-10"
            >
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    姓名 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.name }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    英文名 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.englishName }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    生日 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ formatToDate(user.birthDate) }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    Email :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.email }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    手機號碼 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.cellphone }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    員工編號 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.userId }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    所屬公司 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                      :value="getCompanyName(user.department.companyId)"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    部門 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.department.name }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    分機號碼 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.extension.extension }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    性別 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.gender }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    住址 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.address }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    入職日期 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ formatToDate(user.hireDate) }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    列印編號 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.printNumber }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    緊急聯絡人 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.emergencyName }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                sm="6"
                md="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0 "
                  >
                    緊急連絡人電話 :
                  </v-col>
                  <v-col
                    cols="9"
                    sm="12"
                  >
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      hide-details
                      readonly
                    >
                      {{ user.emergencyCellphone }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <!-- 修改密碼對話框 -->
  <v-dialog
    v-model="showPasswordDialog"
    max-width="360"
  >
    <v-card>
      <v-card-title class="text-h6 ps-6 pt-6">
        修改密碼
      </v-card-title>
      <v-card-text class="pb-0">
        <v-form @submit.prevent="handlePasswordChange">
          <v-text-field
            v-model="passwordForm.currentPassword"
            :error-messages="currentPasswordError"
            label="當前密碼"
            type="password"
            variant="outlined"
            density="compact"
            class="mb-4"
            @update:model-value="currentPasswordError = ''"
          />
          <v-text-field
            v-model="passwordForm.newPassword"
            :error-messages="newPasswordError"
            label="新密碼"
            type="password"
            variant="outlined"
            density="compact"
            class="mb-4"
            @update:model-value="newPasswordError = ''"
          />
          <v-text-field
            v-model="passwordForm.confirmPassword"
            :error-messages="confirmPasswordError"
            label="確認新密碼"
            type="password"
            variant="outlined"
            density="compact"
            class="mb-4"
            @update:model-value="confirmPasswordError = ''"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="me-4 mb-3">
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          height="32"
          @click="closePasswordDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="red-darken-1"
          variant="outlined"
          height="32"
          :loading="isChangingPassword"
          @click="handlePasswordChange"
        >
          確認修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { onMounted, computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'
import { useDisplay } from 'vuetify'
import { companyNames } from '@/enums/Company'

const { mdAndUp, width } = useDisplay()
const isLgmUp = computed(() => width.value >= 1500)

definePage({
  meta: {
    title: '個人資料管理 | ystravel',
    login: true,
    admin: false
  }
})

const getCompanyName = (companyId) => {
  return companyNames[companyId] || '未知公司'
}

const avatar = computed(() => {
  return `https://api.multiavatar.com/${user.userId}.png`
})

const showPasswordDialog = ref(false)
const isChangingPassword = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const currentPasswordError = ref('')
const newPasswordError = ref('')
const confirmPasswordError = ref('')

const user = useUserStore()
const createSnackbar = useSnackbar()
const originalData = ref(null)

const formatToDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const validatePasswordForm = () => {
  let isValid = true

  if (!passwordForm.value.currentPassword) {
    currentPasswordError.value = '請輸入當前密碼'
    isValid = false
  }

  if (!passwordForm.value.newPassword) {
    newPasswordError.value = '請輸入新密碼'
    isValid = false
  } else if (passwordForm.value.newPassword.length < 8) {
    newPasswordError.value = '新密碼長度至少需要8個字元'
    isValid = false
  }

  if (!passwordForm.value.confirmPassword) {
    confirmPasswordError.value = '請確認新密碼'
    isValid = false
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    confirmPasswordError.value = '兩次輸入的密碼不相符'
    isValid = false
  }

  return isValid
}

const handlePasswordChange = async () => {
  if (!validatePasswordForm()) return

  try {
    isChangingPassword.value = true
    const result = await user.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )

    // 使用回傳的訊息
    createSnackbar({
      text: result.message,
      snackbarProps: { color: 'teal-darken-1' }
    })

    closePasswordDialog()
  } catch (error) {
    // 錯誤訊息已經在 store 中處理過，直接使用
    createSnackbar({
      text: error.message,
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    isChangingPassword.value = false
  }
}
const closePasswordDialog = () => {
  showPasswordDialog.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  currentPasswordError.value = ''
  newPasswordError.value = ''
  confirmPasswordError.value = ''
}

const loadProfile = async () => {
  await user.profile()
  originalData.value = {
    name: user.name,
    englishName: user.englishName,
    birthDate: user.birthDate,
    cellphone: user.cellphone,
    address: user.address
  }
}

onMounted(loadProfile)

</script>

<style lang="scss" scoped>
.v-col-sm-12 {
  font-size: 14px;
  @media (min-width: 600px) {
    font-size: 16px;
  }
}
</style>
