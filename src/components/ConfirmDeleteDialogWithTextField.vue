<!-- eslint-disable vue/no-v-html -->
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
        <div v-html="message" />
        <v-text-field
          v-model="inputName"
          :error-messages="errorMessage"
          class="mt-8"
          :label="`請輸入${labelText}`"
          variant="outlined"
          dense
          clearable
        />
      </v-card-text>
      <v-card-actions class="me-4 mb-2">
        <v-spacer />
        <v-btn
          :size="buttonSize"
          :color="cancelButtonColor"
          variant="outlined"
          @click="cancel"
        >
          {{ cancelButtonText }}
        </v-btn>
        <v-btn
          :size="buttonSize"
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
import { ref, watch, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndUp } = useDisplay()
const buttonSize = computed(() => {
  return smAndUp.value ? 'default' : 'small'
})

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
    default: ''
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
  inputLabel: {
    type: String,
    default: '名稱'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const isOpen = ref(props.modelValue)
const inputName = ref('')
const errorMessage = ref('')

const labelText = computed(() => `欲刪除${props.inputLabel}`)

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
  inputName.value = ''
  errorMessage.value = ''
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
    errorMessage.value = '輸入的名稱不正確'
  }
}
</script>

<style lang="scss" scoped>
:deep(.v-card-text) {
  .text-red {
    color: #ef5350 !important;
  }
}
</style>
