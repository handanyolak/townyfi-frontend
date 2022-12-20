<template>
  <div
    class="flex flex-col items-center text-2xl font-bold shadow-2xl castle rounded-xl dark:shadow-slate-400 dark:shadow-lg"
  >
    <div>
      <span>{{ item.x }}</span>
      <span>,</span>
      <span>{{ item.y }}</span>
    </div>
    <button @click="toggleModal()">
      <img src="@/assets/img/soldier.svg" alt="soldier" />
    </button>
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
