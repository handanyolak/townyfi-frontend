<template>
  <button
    :class="[
      ' mx-auto rounded-full bg-gradient-to-tr from-towni-brown-dark-300 via-towni-brown-dark-200 to-towni-brown-light-400 p-[2px] text-sm duration-1000 ease-in-out',
      hoverEffect ? 'group' : '',
    ]"
  >
    <div
      :class="[
        'rounded-full py-2 px-4  duration-500 ease-in-out',
        border
          ? 'bg-towni-brown-light-100 text-towni-brown-dark-200 group-hover:bg-transparent group-hover:text-white  dark:bg-night-blue'
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
  hoverEffect?: boolean
}
defineProps<ButtonThemeProps>()
</script>
