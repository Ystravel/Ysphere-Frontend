<template>
  <v-app>
    <v-main>
      <router-view />
      <ScrollToTop />
    </v-main>
  </v-app>
</template>

<script setup>
import ScrollToTop from './components/ScrollToTop.vue'
</script>
<style lang="scss" scoped>

</style>
