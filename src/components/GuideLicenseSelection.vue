<template>
  <v-combobox
    v-model="selected"
    :items="licenseOptions"
    label="導遊領隊證"
    variant="outlined"
    density="compact"
    :error-messages="props.errorMessages"
    multiple
    :chips="!isNoneSelected"
    clearable
    @update:model-value="handleSelectionChange"
    @click:clear="handleClear"
  >
    <template #selection>
      <div class="d-flex align-center flex-wrap">
        <template v-if="isNoneSelected">
          {{ guideLicenseNames[0] }}
        </template>
        <template v-else>
          <v-chip
            v-for="item in selected"
            :key="item.value"
            class="ma-1"
            closable
            size="small"
            @click:close="removeItem(item)"
          >
            {{ guideLicenseNames[item.value] }}
          </v-chip>
        </template>
      </div>
    </template>
  </v-combobox>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { guideLicenseNames } from '@/enums/GuideLicense'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  errorMessages: {
    type: [String, Array],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// 將數字鍵值對轉換為combobox需要的格式，排除"無"選項
const licenseOptions = Object.entries(guideLicenseNames)
  .filter(([value]) => value !== '0')
  .map(([value, name]) => ({
    value: Number(value),
    title: name
  }))

// 初始化selected
const selected = ref(
  props.modelValue.length === 0 || (props.modelValue.length === 1 && props.modelValue[0] === 0)
    ? [{ value: 0, title: guideLicenseNames[0] }]
    : props.modelValue.filter(v => v !== 0).map(value => ({
      value,
      title: guideLicenseNames[value]
    }))
)

// 計算是否只選擇了"無"
const isNoneSelected = computed(() => {
  return selected.value.length === 1 && selected.value[0].value === 0
})

// 處理選擇變更
const handleSelectionChange = (newValue) => {
  if (!newValue || newValue.length === 0) {
    selected.value = [{ value: 0, title: guideLicenseNames[0] }]
    emit('update:modelValue', [0])
    return
  }

  // 過濾並轉換選項
  const values = newValue
    .filter(item => item && (typeof item.value === 'number' || typeof item === 'number'))
    .map(item => typeof item === 'number' ? item : item.value)
    .filter(value => value !== 0) // 排除"無"選項

  if (values.length === 0) {
    selected.value = [{ value: 0, title: guideLicenseNames[0] }]
    emit('update:modelValue', [0])
  } else {
    selected.value = values.map(value => ({
      value,
      title: guideLicenseNames[value]
    }))
    emit('update:modelValue', values)
  }
}

// 清空處理
const handleClear = () => {
  selected.value = [{ value: 0, title: guideLicenseNames[0] }]
  emit('update:modelValue', [0])
}

// 移除選項
const removeItem = (item) => {
  const newSelection = selected.value.filter(i => i.value !== item.value)
  if (newSelection.length === 0) {
    selected.value = [{ value: 0, title: guideLicenseNames[0] }]
    emit('update:modelValue', [0])
  } else {
    selected.value = newSelection
    emit('update:modelValue', newSelection.map(i => i.value))
  }
}

// 監聽外部modelValue變更
watch(() => props.modelValue, (newVal) => {
  if (newVal.length === 0 || (newVal.length === 1 && newVal[0] === 0)) {
    selected.value = [{ value: 0, title: guideLicenseNames[0] }]
  } else {
    selected.value = newVal.filter(v => v !== 0).map(value => ({
      value,
      title: guideLicenseNames[value]
    }))
  }
}, { deep: true })
</script>
