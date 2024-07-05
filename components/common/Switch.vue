<template>
  <div
    class="relative flex h-8 w-24 cursor-pointer select-none items-center rounded-full bg-towny-brown-dark-300 bg-opacity-20 shadow-inner backdrop-blur"
    @click="toggle"
  >
    <div
      :class="isToggle ? 'right-1' : 'left-6 -translate-x-full transform'"
      class="absolute z-10 h-5 w-5 transform rounded-full bg-towny-brown-dark-300 transition duration-300 ease-in-out"
    ></div>
    <span
      :class="
        isToggle ? '-translate-x-1/4 opacity-0' : '-translate-x-3/4 opacity-100'
      "
      class="absolute left-3/4 transform text-towny-brown-dark-300 transition-all duration-500 ease-in-out"
      ><slot name="item-1"
    /></span>
    <span
      :class="
        isToggle
          ? 'block -translate-x-1/4 opacity-100'
          : '-translate-x-3/4 opacity-0'
      "
      class="absolute left-1/4 transform text-towny-brown-dark-300 transition-all duration-500 ease-in-out"
      ><slot name="item-2"
    /></span>
  </div>
</template>

<script setup lang="ts">
// --------[ Props & Emits ]-------- //
const emit = defineEmits(['toggled'])

// --------[ Data ]-------- //
const isToggle = ref(false)

// --------[ Methods ]-------- //
const toggle = () => {
  emit('toggled')
  isToggle.value = !isToggle.value
}
</script>
