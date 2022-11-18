<template>
  <div
    class="flex flex-col items-center text-2xl font-bold shadow-2xl castle rounded-xl"
  >
    <button @click="toggleModal()">
      <img src="~/assets/img/soldier.svg" alt="soldier" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { CoordinateItem } from '~/types/coordinate-item'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<CoordinateItem>,
      required: true,
    },
  },
  setup(props, { emit }) {
    // Methods
    const toggleModal = () => {
      emit('modalOpened', props.item)
    }

    return {
      toggleModal,
    }
  },
})
</script>
