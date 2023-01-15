<template>
  <div class="min-h-screen bg-towni-brown-light-100 dark:bg-night-blue">
    <TheHeader />
    <TheSidebar />
    <slot />
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
import TheSidebar from '~/components/layout/TheSidebar.vue'
import TheFooter from '~/components/layout/TheFooter.vue'
</script>
