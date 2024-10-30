<template>
  <v-dialog
    v-model="isOpen"
    max-width="360"
    persistent
  >
    <v-card class="rounded-lg">
      <v-card-title class="headline mt-4 ms-2">
        {{ title }}
      </v-card-title>
      <v-card-text class="ms-1">
        {{ message }}
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
  confirmButtonColor: {
    type: String,
    default: 'red-lighten-1' // 確認按鈕預設顏色
  },
  cancelButtonColor: {
    type: String,
    default: 'grey-darken-1' // 取消按鈕預設顏色
  },
  confirmButtonText: {
    type: String,
    default: '確認' // 確認按鈕預設文字
  },
  cancelButtonText: {
    type: String,
    default: '取消' // 取消按鈕預設文字
  },
  cancelButtonSize: {
    type: String,
    default: 'small' // 取消按紐預設大小
  },
  confirmButtonSize: {
    type: String,
    default: 'small' // 確認按紐預設大小
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})

const cancel = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* 根據需要定義樣式 */
</style>
