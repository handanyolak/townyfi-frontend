<template>
  <div
    class="relative h-screen overflow-hidden transition-colors duration-300 dark:bg-[#0D1117]"
  >
    <TheHeader />
    <TheSidebar />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import TheHeader from '~/components/layout/TheHeader.vue'
import TheSidebar from '~/components/layout/TheSidebar.vue'

const isDark = useDark({
  selector: 'body',
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

useToggle(isDark)
</script>
