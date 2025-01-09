<template>
  <div
    v-if="cells.length > 0"
    class="mt-2 w-fit rounded-md p-4"
    :style="`background-color: ${color}`"
  >
    <div class="rounded-md bg-white p-2">
      <div class="grid grid-cols-9 border border-gray-400">
        <div
          v-for="(cell, index) in cells"
          :key="index"
          class="relative flex h-8 w-8 items-center justify-center border border-gray-400 text-shadow md:text-xl lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-16 2xl:w-16"
          :class="{
            'bg-white font-bold ': cell !== null,
          }"
          :style="{
            color: cell !== null ? color : '',
            'background-color': cell === null ? color : '',
          }"
        >
          {{ cell !== null ? cell : '' }}
          <span
            v-if="cell !== null && highlightedNumbers.has(cell)"
            class="absolute h-8 w-8 rounded-full opacity-40 transition-all duration-500 ease-in-out lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-16 2xl:w-16"
            :style="`background-color: ${color}`"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface CardProps {
  color: string
  highlightedNumbers: Set<number>
  cardNumbers: number[]
}

const props = defineProps<CardProps>()

const formatCells = (cardNumbers: number[]): (number | null)[] => {
  const result: (number | null)[] = []
  let notNullCount = 2
  let isBeforeCellNotNull = false
  cardNumbers.forEach((num, index) => {
    result.push(num)
    if (!isBeforeCellNotNull && notNullCount && Math.random() >= 0.5) {
      notNullCount--
      isBeforeCellNotNull = true
      return
    }
    if (notNullCount === 2 && index === cardNumbers.length - 3) {
      notNullCount--
      isBeforeCellNotNull = true
      return
    }
    if (notNullCount === 1 && index === cardNumbers.length - 2) {
      notNullCount--
      isBeforeCellNotNull = true
      return
    }
    if (index !== cardNumbers.length - 1) {
      isBeforeCellNotNull = false
      result.push(null)
    }
  })
  return result
}

const cells = computed(() => formatCells(props.cardNumbers))
</script>
