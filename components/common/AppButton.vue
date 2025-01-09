<template>
  <button
    :disabled="disabled"
    class="mb-8 flex items-center justify-center rounded bg-[#5b75f4] px-6 py-3 text-lg text-white hover:bg-[#6981f6] md:text-xl"
  >
    <Icon
      v-if="showLoadingIcon"
      name="svg-spinners:tadpole"
      class="h-5 w-5 animate-spin"
    />
    <Icon v-if="showDefaultIcon('left')" :name="iconName" class="h-5 w-5" />
    <span class="mx-2">{{ title }}</span>
    <Icon v-if="showDefaultIcon('right')" :name="iconName" class="h-5 w-5" />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

export type IconPosition = 'left' | 'right'

interface ButtonProps {
  title: string
  iconName?: string
  iconPosition?: IconPosition
  isLoading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  title: '',
  iconName: '',
  iconPosition: 'left',
  isLoading: false,
  disabled: false,
})

const showLoadingIcon = computed(() => props.isLoading)

const showDefaultIcon = (position: IconPosition) => {
  return props.iconName && props.iconPosition === position && !props.isLoading
}
</script>
