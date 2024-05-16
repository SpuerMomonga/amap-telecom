<script setup lang="ts">
import Map from './views/Map.vue';
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <Map />
  </n-config-provider>
</template>

<style scoped>
</style>
