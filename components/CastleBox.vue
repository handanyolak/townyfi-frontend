<template>
  <div
    class="castle relative flex min-h-[350px] flex-col items-center rounded-xl border border-towni-brown-light-200 bg-[#fffcf8] text-2xl font-bold shadow-lg shadow-towni-brown-light-200 dark:border dark:border-slate-800 dark:bg-night-blue dark:shadow-lg dark:shadow-sky-900"
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
import { CoordinateItem } from '~/types'
interface CastleBoxProps {
  item: CoordinateItem
}

const props = defineProps<CastleBoxProps>()

const emit = defineEmits(['modalOpened'])

const toggleModal = () => {
  emit('modalOpened', props.item)
}
</script>
