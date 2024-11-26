<template>
  <button
    class="relative z-50 rounded-full p-2 focus:outline-none"
    :class="buttonClass"
    @click="toggle"
  >
    <div
      :class="[
        isOpen ? 'translate-y-2 rotate-45' : '',
        'my-1 h-[2px] w-5 transform bg-white transition duration-300 ease-linear',
      ]"
    ></div>

    <div
      :class="[
        isOpen ? 'opacity-0' : '',
        'my-1 h-[2px] w-5 transform bg-white transition duration-300 ease-linear',
      ]"
    ></div>

    <div
      :class="[
        isOpen ? '-translate-y-1 -rotate-45' : '',
        'my-1 h-[2px] w-5 transform bg-white transition duration-300 ease-linear',
      ]"
    ></div>
  </button>
</template>

<script setup lang="ts">
// --------[ Prop & Emit ]-------- //
defineProps({
  isOpen: Boolean,
  buttonClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['toggle'])

// --------[ Method ]-------- //
const toggle = () => {
  emit('toggle')
}
</script>
