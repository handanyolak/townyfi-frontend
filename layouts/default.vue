<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'body',
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

useToggle(isDark)
</script>
