<template>
  <div
    class="flex flex-col items-center text-2xl font-bold shadow-2xl castle rounded-xl"
  >
    <button @click="toggleModal()">
      <img src="~/assets/img/soldier.svg" alt="soldier" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CoordinateItem } from '~/types/coordinate-item'

const props = defineProps({
  item: {
    type: Object as PropType<CoordinateItem>,
    required: true,
  },
})

const emit = defineEmits(['modalOpened'])

const toggleModal = () => {
  emit('modalOpened', props.item)
}
</script>
