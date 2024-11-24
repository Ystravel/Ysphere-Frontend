<template>
  <v-col
    cols="12"
    class="px-0"
  >
    <div class="d-flex justify-space-between align-center mb-4">
      <h4 class="text-blue-grey-darken-2 ms-1">
        眷屬加保資料
      </h4>
      <v-btn
        v-if="dependents.length < 4"
        color="blue-grey-darken-2"
        variant="outlined"
        size="small"
        prepend-icon="mdi-account-plus"
        @click="addDependent"
      >
        新增眷屬
      </v-btn>
    </div>

    <v-expand-transition group>
      <v-card
        v-for="(dependent, index) in dependents"
        :key="index"
        class="px-4 mb-3"
        variant="outlined"
      >
        <div class="d-flex justify-space-between align-center mb-4 mt-2">
          <h5>眷屬 {{ index + 1 }}</h5>
          <v-btn
            icon
            color="red-lighten-1"
            variant="plain"
            size="small"
            @click="removeDependent(index)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-row class="mb-2">
          <v-col
            cols="12"
            sm="6"
            md="4"
            class="pb-0"
          >
            <v-text-field
              v-model="dependent.dependentName"
              :error-messages="getErrorMessage(index, 'dependentName')"
              label="*眷屬姓名"
              variant="outlined"
              density="compact"
              clearable
              @blur="handleBlur(index, 'dependentName')"
            />
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="4"
            class="pb-0"
          >
            <v-text-field
              v-model="dependent.dependentIDNumber"
              :error-messages="getErrorMessage(index, 'dependentIDNumber')"
              label="*眷屬身分證號"
              variant="outlined"
              density="compact"
              clearable
              maxlength="10"
              @blur="handleBlur(index, 'dependentIDNumber')"
            />
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="4"
            class="pb-0"
          >
            <v-date-input
              v-model="dependent.dependentBirthDate"
              :error-messages="getErrorMessage(index, 'dependentBirthDate')"
              label="*眷屬生日"
              prepend-icon
              variant="outlined"
              density="compact"
              clearable
              :hint="convertToROCDate(dependent.dependentBirthDate)"
              persistent-hint
              :cancel-text="'取消'"
              :ok-text="'確認'"
              @blur="handleBlur(index, 'dependentBirthDate')"
              @click:clear="dependent.dependentBirthDate = null"
            />
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="4"
            class="pb-0"
          >
            <v-text-field
              v-model="dependent.dependentRelationship"
              label="眷屬關係"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="4"
            class="pb-0"
          >
            <v-date-input
              v-model="dependent.dependentInsuranceStartDate"
              label="加保日期"
              prepend-icon
              variant="outlined"
              density="compact"
              clearable
              :hint="convertToROCDate(dependent.dependentInsuranceStartDate)"
              persistent-hint
              :cancel-text="'取消'"
              :ok-text="'確認'"
              @click:clear="dependent.dependentInsuranceStartDate= null"
            />
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="4"
            class="pb-0"
          >
            <v-date-input
              v-model="dependent.dependentInsuranceEndDate"
              label="退保日期"
              prepend-icon
              variant="outlined"
              density="compact"
              clearable
              :hint="convertToROCDate(dependent.dependentInsuranceEndDate)"
              persistent-hint
              :cancel-text="'取消'"
              :ok-text="'確認'"
              @click:clear="dependent.dependentInsuranceEndDate = null"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-expand-transition>
  </v-col>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useROCDate } from '@/composables/useROCDate'

const { convertToROCDate } = useROCDate()

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const dependents = ref(props.modelValue)
const touchedFields = ref({})

const getErrorMessage = (index, field) => {
  const fieldKey = `${index}-${field}`
  if (!touchedFields.value[fieldKey]) {
    return ''
  }

  // 根據欄位類型進行檢查
  const dependent = dependents.value[index]

  // 判斷各欄位的邏輯
  if (field === 'dependentName' && !dependent.dependentName?.trim()) {
    return '請輸入受保人姓名'
  }

  if (field === 'dependentIDNumber') {
    const idNumberRegex = /^[A-Za-z][12]\d{8}$/
    const value = dependent.dependentIDNumber

    if (!value?.trim()) {
      return '請輸入身分證號碼'
    }

    if (!idNumberRegex.test(value)) {
      return '身分證號碼格式錯誤'
    }
  }

  if (field === 'dependentBirthDate' && !dependent.dependentBirthDate) {
    return '請選擇出生日期'
  }

  return ''
}

const addDependent = () => {
  if (dependents.value.length < 4) {
    dependents.value.push({
      dependentName: '',
      dependentIDNumber: '',
      dependentRelationship: '',
      dependentBirthDate: null,
      dependentInsuranceStartDate: null,
      dependentInsuranceEndDate: null
    })
  }
}

const removeDependent = (index) => {
  dependents.value.splice(index, 1)
  // 清除被刪除項目的觸碰狀態
  Object.keys(touchedFields.value).forEach(key => {
    if (key.startsWith(`${index}-`)) {
      delete touchedFields.value[key]
    }
  })
}

// 處理欄位失焦事件
const handleBlur = (index, field) => {
  touchedFields.value[`${index}-${field}`] = true
}

watch(() => props.modelValue, (newVal) => {
  dependents.value = newVal
}, { deep: true })

watch(dependents, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
</style>
