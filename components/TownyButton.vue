<template>
  <button
    :class="[
      'rounded-md border-2 border-solid border-transparent p-2 text-sm   transition-colors duration-200 ease-in-out ',
      border
        ? 'border-gradient hover:fill-gradient text-towni-brown-200 hover:text-white'
        : 'fill-gradient hover:border-gradient text-white hover:text-towni-brown-200',
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface ButtonThemeProps {
  fill?: boolean
  border?: boolean
}
defineProps<ButtonThemeProps>()
</script>
