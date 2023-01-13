<template>
  <button
    class="group mx-auto rounded-full bg-gradient-to-tr from-towni-brown-dark-300 via-towni-brown-dark-200 to-towni-brown-light-400 p-[2px] text-sm transition-colors duration-1000 ease-in-out"
  >
    <div
      :class="[
        'rounded-full p-2 transition-colors duration-500 ease-in-out',
        border
          ? 'bg-towni-brown-light-100 text-towni-brown-dark-200 group-hover:bg-transparent group-hover:text-white  dark:bg-night-blue '
          : 'bg-transparent text-white group-hover:bg-towni-brown-light-100 group-hover:text-towni-brown-dark-200 dark:group-hover:bg-night-blue',
      ]"
    >
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
interface ButtonThemeProps {
  fill?: boolean
  border?: boolean
}
defineProps<ButtonThemeProps>()
</script>
