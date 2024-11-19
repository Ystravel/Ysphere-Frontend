<template>
  <v-container
    max-width="2200"
  >
    <v-row>
      <v-col
        v-if="isLgmUp"
        md="3"
      >
        <v-row class="elevation-4 rounded-xl pt-8 pb-10 px-1 px-sm-10 mt-2 mt-sm-10 mx-10 bg-white">
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
                    :src="user.avatar"
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
                  style="font-size: 15px; font-weight: 600;"
                  class="opacity-90 mb-12"
                >
                  {{ user.jobTitle }}
                </div>
                <FileUploadButton />
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </v-col>
      <v-col
        xl="9"
      >
        <v-row class="elevation-4 rounded-xl pt-8 pb-6 px-1 px-sm-10 mt-2 mt-sm-10 mx-0 mx-sm-4 ms-xl-0 me-xl-10 mb-4 bg-white">
          <v-col
            cols="12"
            class="d-flex justify-space-between"
          >
            <h3>
              個人資料管理&nbsp;&nbsp;&nbsp;<span
                v-if="mdAndUp"
                class="text-subtitle-2 opacity-80 font-weight-regular"
              ><span class="text-red-darken-2">* </span>若有需要修改 請聯絡人資 ( 密碼可自行修改 )</span>
            </h3>
            <div>
              <v-row>
                <v-col>
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
                </v-col>
                <v-col
                  v-if="!mdAndUp"
                >
                  <v-btn
                    color="blue-grey-darken-2"
                    prepend-icon="mdi-pencil"
                    variant="outlined"
                    size="small"
                    height="32"
                    @click="showPasswordDialog = true"
                  >
                    修改密碼
                  </v-btn>
                </v-col>
                <v-col
                  v-if="!isLgmUp"
                  class="d-flex align-center"
                >
                  <FileUploadButton />
                  <v-btn
                    v-tooltip:top="'查看科威帳號密碼'"
                    icon=""
                    color="blue-grey-darken-2"
                    size="24"
                    elevation="0"
                    style="margin-top: 1px;"
                    class="ms-4"
                    @click="showCowellDialog = true"
                  >
                    <v-icon
                      icon="mdi-eye-outline"
                      size="14"
                    />
                  </v-btn>
                </v-col>
                <v-col
                  v-if="isLgmUp"
                  class="d-flex align-center"
                >
                  <v-btn
                    v-tooltip:top="'查看科威帳號密碼'"
                    icon=""
                    color="blue-grey-darken-2"
                    size="24"
                    elevation="0"
                    style="margin-top: 1px;"
                    @click="showCowellDialog = true"
                  >
                    <v-icon
                      icon="mdi-eye-outline"
                      size="14"
                    />
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col
            v-if="!mdAndUp"
            cols="12"
          >
            <span
              class="text-subtitle-2 opacity-80 font-weight-regular"
            ><span class="text-red-darken-2">* </span>若有需要修改 請聯絡人資 ( 密碼可自行修改 )</span>
          </v-col>
          <v-col>
            <v-divider />
          </v-col>
          <v-col
            cols="12"
            class="mt-3 mb-6 text-center text-blue-grey-darken-3"
          >
            <div class="profile-subtitle">
              《 基本資料 》
            </div>
          </v-col>
          <v-col cols="12">
            <v-row
              class="text-blue-grey-darken-3"
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
                md="6"
                lg="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    戶籍地址 :
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
                      class="address-style"
                    >
                      {{ user.permanentAddress }}
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="py-0 mb-6"
                cols="12"
                md="6"
                lg="4"
              >
                <v-row>
                  <v-col
                    cols="3"
                    sm="12"
                    class="align-self-center py-0"
                  >
                    聯絡地址 :
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
                      class="address-style"
                    >
                      {{ user.contactAddress }}
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
                    class="align-self-center py-0 pe-0"
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
            <v-col
              cols="12"
              class="mt-3 mb-6 text-center text-blue-grey-darken-3"
            >
              <div class="profile-subtitle">
                《 任職資料 》
              </div>
            </v-col>
            <v-col cols="12" />
            <v-row
              class="text-blue-grey-darken-3"
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
                      :value="user.company?.name || ''"
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
                      :value="user.department?.name || ''"
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
                    科威帳號 :
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
                      :value="isCowellRevealed ? user.cowellAccount : '******'"
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
                    科威密碼 :
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
                      :value="isCowellRevealed ? user.cowellPassword : '******'"
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
                      {{ user.extNumber }}
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
                    領隊證 :
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
                      :value="guideLicenseDisplay"
                    />
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
      <div class="card-title ps-6 py-6">
        修改密碼
      </div>
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
          :size="buttonSize"
          @click="closePasswordDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="red-darken-1"
          variant="outlined"
          :size="buttonSize"
          :loading="isChangingPassword"
          @click="handlePasswordChange"
        >
          確認修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 查看科威帳號與密碼對話框 -->
  <v-dialog
    v-model="showCowellDialog"
    max-width="360"
  >
    <v-card>
      <div class="card-title ps-6 py-6">
        輸入密碼以查看
      </div>
      <v-card-text class="pb-0">
        <v-text-field
          v-model="cowellPassword"
          :error-messages="cowellPasswordError"
          label="輸入密碼"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-4"
          @update:model-value="cowellPasswordError = ''"
        />
      </v-card-text>
      <v-card-actions class="me-4 mb-3">
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          @click="closeCowellDialog"
        >
          取消
        </v-btn>
        <v-btn
          color="red-darken-1"
          variant="outlined"
          :loading="isVerifyingCowell"
          @click="verifyCowellPassword"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { definePage } from 'vue-router/auto'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'
import { useDisplay } from 'vuetify'
import FileUploadButton from '@/components/FileUploadButton.vue'

const { mdAndUp, width, smAndUp } = useDisplay()
const isLgmUp = computed(() => width.value >= 1500)
const guideLicenseDisplay = computed(() => {
  return user.guideLicense ? '有' : '無'
})

const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})

definePage({
  meta: {
    title: '個人資料管理 | ysphere',
    login: true
  }
})

const showCowellDialog = ref(false)
const cowellPassword = ref('')
const cowellPasswordError = ref('')
const isCowellRevealed = ref(false)
const isVerifyingCowell = ref(false)

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
      snackbarProps: { color: 'teal-lighten-1' }
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

const verifyCowellPassword = async () => {
  if (!cowellPassword.value) {
    cowellPasswordError.value = '請輸入密碼'
    return
  }

  try {
    isVerifyingCowell.value = true

    // 調用新 API
    const response = await fetch(`${import.meta.env.VITE_API}/user/reveal-cowell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}` // 加入 JWT token
      },
      body: JSON.stringify({ password: cowellPassword.value })
    })

    const data = await response.json()

    if (!response.ok) {
      cowellPasswordError.value = data.message || '驗證失敗，請稍後重試'
      return
    }

    // 成功後更新顯示的科威帳號和密碼
    isCowellRevealed.value = true
    user.cowellAccount = data.result.cowellAccount
    user.cowellPassword = data.result.cowellPassword

    createSnackbar({
      text: '密碼驗證成功，科威帳號與密碼已解鎖',
      snackbarProps: { color: 'teal-lighten-1' }
    })

    closeCowellDialog()
  } catch (error) {
    console.error('驗證科威密碼錯誤:', error)
    createSnackbar({
      text: '驗證失敗，請稍後重試',
      snackbarProps: { color: 'red-lighten-1' }
    })
  } finally {
    isVerifyingCowell.value = false
  }
}

const closeCowellDialog = () => {
  showCowellDialog.value = false
  cowellPassword.value = ''
  cowellPasswordError.value = ''
}

</script>

<style lang="scss" scoped>
@import '../styles/settings.scss';

.address-style :deep(.v-field .v-field__input) {
  font-size: 10.5px;
  @include sm {
    font-size: 14px;
  }
}

.v-col-sm-12 {
  font-size: 13px;
  @media (min-width: 600px) {
    font-size: 15px;
  }
}

.profile-subtitle {
  font-size: 14px;
  font-weight: 600;
  @include sm {
    font-size: 15px;
  }
}
</style>
