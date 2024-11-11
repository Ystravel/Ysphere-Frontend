<template>
  <v-dialog
    v-model="isOpen"
    max-width="360"
    persistent
  >
    <v-card class="rounded-lg">
      <v-card-title class="font-weight-bold mt-4 ms-2">
        {{ title }}
      </v-card-title>
      <v-card-text class="ms-1 pb-0">
        {{ message }}
        <v-text-field
          v-model="inputName"
          :error-messages="errorMessage"
          class="mt-8"
          label="請輸入欲刪除員工姓名"
          variant="outlined"
          dense
          clearable
        />
      </v-card-text>
      <v-card-actions class="me-4 mb-2">
        <v-spacer />
        <v-btn
          :size="cancelButtonSize"
          :color="cancelButtonColor"
          variant="outlined"
          @click="cancel"
        >
          {{ cancelButtonText }}
        </v-btn>
        <v-btn
          :size="confirmButtonSize"
          :color="confirmButtonColor"
          variant="outlined"
          :disabled="!props.expectedName || inputName !== props.expectedName || inputName === ''"
          @click="confirm"
        >
          {{ confirmButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '確認刪除'
  },
  message: {
    type: String,
    default: '你確定要刪除這個項目嗎？此操作無法恢復。'
  },
  modelValue: Boolean,
  expectedName: {
    type: String,
    default: '' // 將 required: true 改為提供預設值
  },
  confirmButtonColor: {
    type: String,
    default: 'red-lighten-1'
  },
  cancelButtonColor: {
    type: String,
    default: 'grey-darken-1'
  },
  confirmButtonText: {
    type: String,
    default: '確認'
  },
  cancelButtonText: {
    type: String,
    default: '取消'
  },
  cancelButtonSize: {
    type: String,
    default: 'small'
  },
  confirmButtonSize: {
    type: String,
    default: 'small'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const isOpen = ref(props.modelValue)
const inputName = ref('') // 儲存輸入的姓名
const errorMessage = ref('')

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
  inputName.value = '' // 重置輸入框
  errorMessage.value = '' // 清除錯誤訊息
})

const cancel = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  if (!props.expectedName) {
    emit('confirm')
    emit('update:modelValue', false)
    return
  }

  if (inputName.value === props.expectedName) {
    emit('confirm')
    emit('update:modelValue', false)
  } else {
    errorMessage.value = '輸入的姓名不正確'
  }
}
</script>

<style scoped>
/* 根據需要定義樣式 */
</style>
