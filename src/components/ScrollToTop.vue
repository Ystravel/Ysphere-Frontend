<template>
  <Transition name="fade">
    <v-btn
      v-show="showButton"
      icon="mdi-arrow-up"
      color="blue-grey-darken-1"
      class="scroll-to-top"
      @click="scrollToTop"
    />
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

const checkScroll = () => {
  showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style lang="scss" scoped>
@import '/src/styles/settings.scss';

.scroll-to-top {
  height: 36px;
  width: 36px;
  position: fixed;
  bottom: 60px;
  right: 10px;
  z-index: 99;
  @include sm {
    height: 40px;
    width: 40px;
  }
  @include lg {
    height: 48px;
    width: 48px;
    bottom: 80px;
    right: 30px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
