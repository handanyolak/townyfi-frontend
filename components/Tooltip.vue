<template>
  <span class="relative" @click="toggleTooltip()">
    <img
      class="mr-1 h-3 w-3 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
      src="@/assets/img/information.svg"
    />
    <span
      :class="[
        'absolute bottom-4 w-64 transform rounded-md bg-towni-brown-100 py-1 text-center text-sm text-towni-brown-200 shadow-xl transition-all duration-700 ease-out',
        isShowTooltip
          ? 'visible translate-y-0 transform cursor-pointer bg-towni-brown-600'
          : 'invisible -translate-y-12',
      ]"
    >
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
const isShowTooltip = ref(false)

const toggleTooltip = () => {
  isShowTooltip.value = !isShowTooltip.value
}
</script>
