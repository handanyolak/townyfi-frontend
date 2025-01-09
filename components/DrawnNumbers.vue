<template>
  <div
    v-if="drawnNumbersInUi.length > 0"
    class="relative col-span-2 flex flex-col items-center justify-start md:col-start-6 md:items-end"
  >
    <ul
      class="relative grid grid-cols-9 grid-rows-10 justify-center gap-0.5 rounded-lg bg-white p-2 shadow-xl md:grid-cols-6 lg:grid-cols-9 lg:grid-rows-10"
    >
      <li
        v-for="(currentDrawnNumber, index) in drawnNumbersInUi"
        :key="index"
        class="relative flex h-6 w-6 items-center justify-center text-center text-shadow md:h-8 md:w-8 md:text-lg xl:h-10 xl:w-10 xl:text-xl 2xl:h-12 2xl:w-12 2xl:text-2xl"
      >
        {{ currentDrawnNumber }}
        <span
          class="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 transition-all duration-500 ease-in-out md:h-8 md:w-8 md:text-lg xl:h-10 xl:w-10"
          :style="`background-color: ${color}`"
        ></span>
      </li>
      <transition name="number-fade" appear>
        <div
          v-if="currentNumber !== null"
          class="transform-center absolute flex h-20 w-20 justify-center rounded-full bg-white text-3xl font-bold text-white md:h-40 md:w-40 md:text-9xl"
        >
          <div
            :style="`background-color: ${color}`"
            class="flex h-full w-full items-center justify-center rounded-full bg-opacity-40"
          >
            {{ currentNumber }}
          </div>
        </div>
      </transition>
    </ul>
    <p v-if="!isGameFinishedInUi" class="my-4 w-full text-center text-xl">
      Remaining drawn Numbers count: {{ remainingDrawnNumbersCount }}
    </p>
  </div>
</template>

<script lang="ts" setup>
interface DrawnNumbersProps {
  isGameFinishedInUi: boolean
  remainingDrawnNumbersCount: number
  currentNumber: number | null
  drawnNumbersInUi: number[]
  color: string
}

defineProps<DrawnNumbersProps>()
</script>

<style scoped>
.number-fade-enter-active,
.number-fade-leave-active {
  transition:
    transform 1s ease,
    opacity 1s ease;
}

.number-fade-enter-from {
  transform: translateY(100%) scale(1);
  opacity: 0;
}

.number-fade-enter-to {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.number-fade-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.number-fade-leave-to {
  transform: translateY(-100%) scale(0.5);
  opacity: 0;
}
</style>
