<template>
  <div :class="containerClass">
    <client-only>
      <Vue3Lottie
        :animation-data="Loading"
        :height="fullScreen ? '400px' : '100px'"
        :width="fullScreen ? '400px' : '100px'"
        :speed="1.5"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import Loading from '~/assets/lotties/loading.json'

// --------[ Prop & Emit ]-------- //
const props = defineProps({
  fullScreen: {
    type: Boolean,
    default: false,
  },
})

// --------[ Computed ]-------- //
const containerClass = computed(() => {
  return props.fullScreen
    ? 'fixed inset-0 bg-[#362419] bg-opacity-40 backdrop-blur-sm z-120 flex justify-center items-center'
    : 'flex justify-center items-center'
})
</script>
