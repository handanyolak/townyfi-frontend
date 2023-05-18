<template>
  <Transition name="modal-outer">
    <div
      v-show="modalActive"
      class="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-[#362419] bg-opacity-40 backdrop-blur-sm"
    >
      <Transition name="modal-outer">
        <div v-if="modalActive">
          <div
            ref="modal"
            :style="`height: ${modalSize}px; width: ${modalSize}px`"
            :class="[
              contentClasses,
              contentClasses === 'bg-transparent'
                ? 'shadow-none'
                : 'bg-towni-brown-light-100 shadow-xl',
            ]"
            class="modal relative h-3/5 w-2/5 rounded-md"
          >
            <button class="absolute right-2 top-2 z-50" @click="closeModal">
              <img class="h-10 w-10" src="@/assets/img/exit.svg" />
            </button>
            <slot />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

//--------[ Props & Emits ]--------//
interface AppModalProps {
  contentClasses?: string
  modalSize?: string
  modalActive?: boolean
}

defineProps<AppModalProps>()

const emit = defineEmits(['modalClosed'])

//--------[ Data ]--------//
const modal = ref(null)

//--------[ Methods ]--------//
const closeModal = () => {
  emit('modalClosed')
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
