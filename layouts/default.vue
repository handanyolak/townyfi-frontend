<template>
  <div class="h-screen dark:bg-gray-900">
    <TheHeader />
    <TheSidebar />
    <Nuxt />
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
import TheFooter from '~/components/layout/TheFooter.vue'
import TheSidebar from '~/components/layout/TheSidebar.vue'
</script>
