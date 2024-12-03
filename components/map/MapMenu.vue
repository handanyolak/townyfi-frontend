<template>
  <div
    :class="[
      'absolute transform rounded-lg p-2 shadow-lg transition-all duration-300',
      positionClasses,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
// --------[ Prop & Emit ]-------- //
interface Props {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const props = defineProps<Props>()

// --------[ Computed ]-------- //
const positionClasses = computed(() => {
  const positions: Record<Props['position'], string> = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }

  return props.position && positions[props.position]
    ? positions[props.position]
    : ''
})
</script>
