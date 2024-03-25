<template>
  <span ref="tooltip" class="relative" @click.stop="toggleTooltip()">
    <Icon
      :name="iconName"
      class="mr-1 h-4 w-4 cursor-pointer text-towni-brown-dark-300 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
      @click="actionTooltip()"
    />
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

// --------[ Props & Emits ]-------- //
interface TooltipProps {
  autoClose?: boolean
  iconName?: string
}

const props = withDefaults(defineProps<TooltipProps>(), {
  autoClose: false,
  iconName: 'uil:info-circle',
})

// --------[ Data ]-------- //
const tooltip = ref(null)
const isShowTooltip = ref(false)

// --------[ Methods ]-------- //
const toggleTooltip = () => {
  isShowTooltip.value = !isShowTooltip.value
  if (props.autoClose) {
    setTimeout(() => (isShowTooltip.value = false), 1500)
  }
}

const emit = defineEmits(['action'])

const actionTooltip = () => {
  emit('action')
}

onClickOutside(tooltip, () => (isShowTooltip.value = false))
</script>
