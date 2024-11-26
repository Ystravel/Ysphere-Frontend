<template>
  <v-col
    cols="12"
    class="px-0"
  >
    <div class="d-flex justify-space-between align-center mb-4">
      <div
        class="text-blue-grey-darken-2 ms-1 info-title"
        style="font-size: 15px;"
      >
        眷屬加保資料
      </div>
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
        elevation="0"
        style="border: 1px solid #aaa;"
      >
        <div class="d-flex justify-space-between align-center mb-2 mt-1">
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

        <v-row class="mb-3">
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
              label="*眷屬身分證號碼"
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
              :hint="toROCDate(dependent.dependentBirthDate)"
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

// 添加日期格式化函數
const formatDate = (date) => {
  if (!date) return null
  if (date instanceof Date) return date
  try {
    const parsedDate = new Date(date)
    return isNaN(parsedDate.getTime()) ? null : parsedDate
  } catch {
    return null
  }
}

// 初始化時確保日期格式正確
const initializeDependents = (deps) => {
  return (deps || []).map(dep => ({
    ...dep,
    dependentBirthDate: formatDate(dep.dependentBirthDate),
    dependentInsuranceStartDate: formatDate(dep.dependentInsuranceStartDate),
    dependentInsuranceEndDate: formatDate(dep.dependentInsuranceEndDate)
  }))
}

const dependents = ref(initializeDependents(props.modelValue))
const touchedFields = ref({})

const getErrorMessage = (index, field) => {
  const fieldKey = `${index}-${field}`
  if (!touchedFields.value[fieldKey]) {
    return ''
  }

  const dependent = dependents.value[index]

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
    emit('update:modelValue', dependents.value)
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
  emit('update:modelValue', dependents.value)
}

const handleBlur = (index, field) => {
  touchedFields.value[`${index}-${field}`] = true
}

// 監聽 props 的變化
watch(() => props.modelValue, (newVal) => {
  // 避免不必要的更新
  const formattedNewVal = newVal.map(dep => ({
    ...dep,
    dependentBirthDate: dep.dependentBirthDate instanceof Date
      ? dep.dependentBirthDate
      : formatDate(dep.dependentBirthDate),
    dependentInsuranceStartDate: dep.dependentInsuranceStartDate instanceof Date
      ? dep.dependentInsuranceStartDate
      : formatDate(dep.dependentInsuranceStartDate),
    dependentInsuranceEndDate: dep.dependentInsuranceEndDate instanceof Date
      ? dep.dependentInsuranceEndDate
      : formatDate(dep.dependentInsuranceEndDate)
  }))

  const currentJson = JSON.stringify(formattedNewVal)
  const previousJson = JSON.stringify(dependents.value)

  if (currentJson !== previousJson) {
    dependents.value = formattedNewVal
  }
}, { deep: true })
// 監聽內部狀態的變化
// 監聽內部狀態的變化（修改這部分）
watch(dependents, (newVal) => {
  // 避免遞迴更新
  const formattedDependents = newVal.map(dep => ({
    ...dep,
    dependentBirthDate: dep.dependentBirthDate instanceof Date
      ? dep.dependentBirthDate
      : formatDate(dep.dependentBirthDate),
    dependentInsuranceStartDate: dep.dependentInsuranceStartDate instanceof Date
      ? dep.dependentInsuranceStartDate
      : formatDate(dep.dependentInsuranceStartDate),
    dependentInsuranceEndDate: dep.dependentInsuranceEndDate instanceof Date
      ? dep.dependentInsuranceEndDate
      : formatDate(dep.dependentInsuranceEndDate)
  }))

  // 只有在真正有變化時才發出更新
  const currentJson = JSON.stringify(formattedDependents)
  const previousJson = JSON.stringify(dependents.value)

  if (currentJson !== previousJson) {
    emit('update:modelValue', formattedDependents)
  }
}, { deep: true })

watch(dependents, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

// 提供更好的日期轉換方法給模板使用
const toROCDate = (date) => {
  if (!date) return ''
  if (date instanceof Date) return convertToROCDate(date)
  try {
    const parsedDate = new Date(date)
    return isNaN(parsedDate.getTime()) ? '' : convertToROCDate(parsedDate)
  } catch {
    return ''
  }
}
</script>

<style lang="scss" scoped>
@import '/src/styles/settings.scss';

.v-card {
  transition: all 0.3s ease;
}
</style>
