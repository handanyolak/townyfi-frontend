<template>
  <div
    class="flex flex-col items-center text-2xl font-bold shadow-2xl castle rounded-xl"
  >
    <button @click="toggleModal()">
      <img src="~/assets/img/soldier.svg" alt="soldier" />
    </button>
  </div>
</template>

<script>
import { emit } from 'process'
import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, { emit }) {
    // Constants
    const showModal = ref(false)

    // Methods
    const toggleModal = () => {
      showModal.value = !showModal.value
      emit('toggleModal', showModal.value)
    }

    return {
      toggleModal,
    }
  },
})
</script>
