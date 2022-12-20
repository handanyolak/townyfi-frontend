<template>
  <div class="dark:bg-gray-900">
    <TheHeader />
    <Nuxt />
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
import TheFooter from '~/components/layout/TheFooter.vue'
</script>
