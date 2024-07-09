<template>
  <div class="mt-2">
    <div class="relative h-12 border border-white/50 p-0.5">
      <div class="relative h-full">
        <span
          class="absolute left-2 top-1/2 z-30 -translate-y-1/2 transform text-sm leading-3"
          >{{ name }}</span
        >
        <span
          class="absolute right-2 top-1/2 z-30 -translate-y-1/2 transform text-sm leading-3"
          >{{ currentHealth }}</span
        >
        <div
          class="absolute bottom-0 left-0 top-0 z-20"
          :style="{ width: stateWidth, backgroundColor: stateColor }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  currentHealth: number
  maxHealth: number
}>()

const stateWidth = computed(
  () => `${(props.currentHealth / props.maxHealth) * 100}%`,
)
const stateColor = computed(() => (props.currentHealth <= 20 ? 'red' : 'green'))
</script>
