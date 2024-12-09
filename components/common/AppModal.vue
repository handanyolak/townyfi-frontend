<template>
  <Transition name="modal-outer">
    <div
      v-show="modalActive"
      class="absolute left-0 top-0 z-120 flex h-screen w-full items-center justify-center bg-[#362419] bg-opacity-40 backdrop-blur-sm"
    >
      <Transition name="modal-outer">
        <div v-if="modalActive">
          <div
            ref="modal"
            :style="modalStyle"
            :class="[
              contentClasses,
              'modal relative h-3/5 w-2/5 rounded-md bg-transparent',
            ]"
          >
            <button
              v-if="!isAnimation"
              class="absolute right-2 top-2 z-50"
              @click="closeModal"
            >
              <img class="h-10 w-10" src="@/assets/img/close.svg" />
            </button>
            <slot />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onClickOutside, useWindowSize } from '@vueuse/core'
import type { Modal } from '~/types'

// --------[ Store ]-------- //
const appOptionsStore = useAppOptionsStore()
const { isAnimation } = storeToRefs(appOptionsStore)

const { width } = useWindowSize()

// --------[ Prop & Emit ]-------- //

const props = defineProps<Modal>()

const emit = defineEmits(['modalClosed'])

// --------[ Data ]-------- //
const modal = ref(null)

// --------[ Computed ]-------- //
const modalStyle = computed(() => {
  const isMobile = width.value <= 768

  if (isMobile) {
    return `height: 100vh; width: 90vw;`
  } else {
    return `height: ${props.modalSize}px; width: ${props.modalSize}px`
  }
})

// --------[ Method ]-------- //
const closeModal = () => {
  if (!isAnimation.value) {
    emit('modalClosed')
  }
}

onClickOutside(modal, () => closeModal())
</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}

.modal-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-inner-leave-to {
  transform: scale(0.8);
}
</style>
