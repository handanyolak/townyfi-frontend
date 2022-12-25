<template>
  <div
    class="relative flex flex-col items-center text-2xl font-bold shadow-2xl castle rounded-xl dark:shadow-slate-400 dark:shadow-lg"
  >
    <div>
      <span>{{ item.x }}</span>
      <span>,</span>
      <span>{{ item.y }}</span>
    </div>
    <button @click="toggleModal()">
      <img
        class="absolute bottom-0 z-10 visible w-10 h-10 dark:invisible"
        src="@/assets/img/knight.svg"
        alt="soldier"
      />
      <img
        class="absolute bottom-0 z-10 invisible w-10 h-10 dark:visible"
        src="@/assets/img/soldier.svg"
        alt="soldier"
      />
    </button>

    <CastleSvg class="absolute w-full h-full" />
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
