<template>
  <div
    v-show="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      ref="modal"
      role="dialog"
      aria-labelledby="modal-title"
      aria-hidden="false"
      class="relative flex h-5/6 w-5/6 flex-col items-center rounded-lg bg-white p-6 shadow-lg"
    >
      <h2
        id="modal-title"
        :style="`color: ${color}`"
        class="mb-4 text-center text-lg font-bold md:text-3xl"
      >
        {{ title }}
      </h2>
      <slot />

      <button class="absolute right-0 top-0 rounded-md p-2" @click="closeModal">
        <Icon name="ic:round-close" class="h-10 w-10" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

const modal = ref(null)

const closeModal = () => {
  emit('close')
}

onClickOutside(modal, () => closeModal())
</script>
