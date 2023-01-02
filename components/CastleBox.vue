<template>
  <div
    class="castle relative flex min-h-[350px] flex-col items-center rounded-xl text-2xl font-bold shadow-2xl dark:shadow-lg dark:shadow-slate-400"
  >
    <div>
      <span>{{ item.x.toString() }}</span>
      <span>,</span>
      <span>{{ item.y.toString() }}</span>
    </div>
    <button @click="toggleModal()">
      <img
        class="visible absolute bottom-12 z-10 h-10 w-10 dark:invisible"
        src="@/assets/img/knight.svg"
        alt="soldier"
      />
      <img
        class="invisible absolute bottom-12 z-10 h-10 w-10 dark:visible"
        src="@/assets/img/soldier.svg"
        alt="soldier"
      />
    </button>

    <CastleSvg class="absolute h-full w-full p-10"></CastleSvg>
  </div>
</template>

<script setup lang="ts">
import { CoordinateItem } from '~/types/coordinate-item'
interface CastleBoxProps {
  item: CoordinateItem
}

const props = defineProps<CastleBoxProps>()

const emit = defineEmits(['modalOpened'])

const toggleModal = () => {
  emit('modalOpened', props.item)
}
</script>
