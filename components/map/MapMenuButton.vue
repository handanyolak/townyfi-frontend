<template>
  <button
    :class="[
      'absolute z-60 cursor-pointer transition-all ease-in-out',
      positionClass,
    ]"
    @click="toggleVisibility"
  >
    <Icon
      :class="[
        'transform rounded-full bg-towny-brown-dark-600 text-3xl text-towny-brown-light-300 md:text-4xl',
        rotateClass,
      ]"
      :name="
        isVisible
          ? 'material-symbols-light:close'
          : 'material-symbols-light:double-arrow'
      "
    />
  </button>
</template>

<script setup lang="ts">
// --------[ Prop & Emit ]-------- //
const props = defineProps({
  position: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['toggle'])

const toggleVisibility = () => {
  emit('toggle')
}

// --------[ Computed ]-------- //
const positionClass = computed(() => {
  const positions: Record<string, string> = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }

  return props.position && positions[props.position]
    ? positions[props.position]
    : ''
})

const rotateClass = computed(() => {
  return props.position.includes('right') ? 'rotate-180' : ''
})
</script>
