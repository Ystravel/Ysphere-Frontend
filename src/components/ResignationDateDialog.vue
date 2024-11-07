<template>
  <v-dialog
    v-model="localOpen"
    max-width="360px"
    persistent
  >
    <v-card rounded="lg">
      <v-card-title class="pt-6 ps-6">
        選擇離職日期
      </v-card-title>
      <v-card-text class="pb-0">
        <v-date-input
          v-model="date"
          label="離職日期"
          prepend-icon
          variant="outlined"
          density="compact"
          clearable
          :error-messages="dateError"
        />
      </v-card-text>
      <v-card-actions class="pe-6 pb-6">
        <v-spacer />
        <v-btn
          color="red-lighten-1"
          variant="outlined"
          :height="buttonHeight"
          :size="buttonSize"
          @click="cancel"
        >
          取消
        </v-btn>
        <v-btn
          color="teal-darken-1"
          variant="outlined"
          :height="buttonHeight"
          :size="buttonSize"
          @click="confirm"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const { smAndUp } = useDisplay()

const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})
const buttonHeight = computed(() => {
  return smAndUp.value ? '35' : '32'
})

const localOpen = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const date = ref(null)
const dateError = ref('') // 用於顯示錯誤訊息

const cancel = () => {
  date.value = null
  dateError.value = '' // 清除錯誤訊息
  emit('update:modelValue', false)
  emit('cancel') // 用於通知父組件取消操作
}

const confirm = () => {
  if (!date.value) {
    dateError.value = ['請選擇離職日期'] // 顯示錯誤訊息
  } else {
    dateError.value = []
    emit('confirm', date.value)
    emit('update:modelValue', false) // 關閉對話框
    date.value = null // 重設日期，避免下次開啟時保留值
  }
}
</script>
