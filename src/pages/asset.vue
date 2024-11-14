<template>
  <h2>設備管理</h2>
</template>
<script setup>
import { definePage } from 'vue-router/auto'
import UserRole from '../enums/UserRole'

definePage({
  meta: {
    title: '設備管理 | ysphere',
    login: true,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  }
})

</script>
