<template>
  <span ref="tooltip" class="relative" @click.stop="toggleTooltip()">
    <slot name="tooltip-image" />
    <span
      :class="[
        ' absolute bottom-4 transform rounded-md bg-towni-brown-light-400 p-1 py-1 text-center text-sm text-towni-brown-dark-300 shadow-xl transition-all duration-700 ease-out',
        isShowTooltip
          ? 'visible translate-y-0 transform cursor-pointer bg-towni-brown-light-200'
          : 'invisible -translate-y-12',
        autoClose ? '' : 'w-56',
      ]"
    >
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const isShowTooltip = ref(false)
const tooltip = ref(null)

const props = defineProps({
  autoClose: {
    type: Boolean,
    default: false,
  },
})

const toggleTooltip = () => {
  isShowTooltip.value = !isShowTooltip.value
  if (props.autoClose) {
    setTimeout(() => (isShowTooltip.value = false), 1500)
  }
}

onClickOutside(tooltip, () => (isShowTooltip.value = false))
</script>
