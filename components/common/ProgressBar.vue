<template>
  <div class="progress mt-4 bg-slate-100 bg-opacity-10">
    <div class="progress-bg relative h-10 rounded-sm border border-white/50">
      <div class="relative h-full">
        <span
          v-if="name"
          class="absolute left-2 top-1/2 z-30 -translate-y-1/2 transform text-sm leading-3 text-white"
          >{{ current }}/{{ initial }}</span
        >
        <span
          v-if="name"
          class="absolute right-2 top-1/2 z-30 -translate-y-1/2 transform text-sm leading-3 text-white"
          >{{ name }}</span
        >
        <div
          :class="[
            'progress__bar duration-800 absolute bottom-0 left-0 top-0 z-20 transition-all ease-out before:absolute before:-right-0.5 before:-top-3 before:h-14 before:w-1 after:absolute after:-right-0.5 after:-top-1 after:h-14 after:w-1',
            stateColor,
          ]"
          :style="{ width: stateWidth }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name?: string
  current: number | bigint
  initial: number | bigint
  threshold: number
  thresholdColor: string
  color: string
}>()

const stateWidth = computed(
  () => `${(Number(props.current) / Number(props.initial)) * 100}%`,
)

const stateColor = computed(() =>
  props.current <= props.threshold ? props.thresholdColor : props.color,
)
</script>

<style scoped>
.progress__bar:before,
.progress__bar:after {
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0) 75%
  );
}
</style>
