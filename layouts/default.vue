<template>
  <div class="dark:bg-night-blue min-h-screen bg-towni-brown-light-100">
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
