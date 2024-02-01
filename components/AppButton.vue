<template>
  <button
    :class="[
      'mx-auto rounded-full bg-gradient-to-tr from-towni-brown-dark-300 via-towni-brown-dark-200 to-towni-brown-light-400 p-[2px] text-sm  transition duration-500  ease-in-out  disabled:opacity-50',
      fillHover || borderHover ? 'group' : '',
      basicHover
        ? 'shadow-lg shadow-towni-brown-dark-200 hover:from-towni-brown-dark-300 hover:via-towni-brown-dark-300 hover:to-towni-brown-light-500 hover:shadow-towni-brown-dark-500'
        : '',
    ]"
  >
    <div
      :class="[
        'rounded-full py-2 px-4 duration-500 ease-in-out',
        inlineClass ? inlineClass : '',
        fillHover
          ? 'bg-towni-brown-light-100 text-towni-brown-dark-200 group-hover:bg-transparent group-hover:text-white  dark:bg-night-blue'
          : 'bg-transparent text-white dark:group-hover:bg-night-blue',
      ]"
    >
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
//--------[ Props & Emits ]--------//
interface ButtonThemeProps {
  fillHover?: boolean
  borderHover?: boolean
  basicHover?: boolean
  inlineClass?: string
}

defineProps<ButtonThemeProps>()
</script>
