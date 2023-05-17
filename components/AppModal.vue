<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 h-full w-full bg-[#362419] bg-opacity-40">
      <div class="flex h-screen items-center justify-center">
        <div
          ref="modal"
          :style="`height: ${modalSize}px; width: ${modalSize}px`"
          :class="[
            contentClasses,
            contentClasses === 'bg-transparent'
              ? 'shadow-none'
              : 'shadow-2xl shadow-towni-brown-dark-600',
          ]"
          class="modal relative h-3/5 w-2/5 rounded-lg bg-towni-brown-light-100"
        >
          <button class="absolute right-2 top-2 z-50" @click="closeModal">
            <img class="h-10 w-10" src="@/assets/img/exit.svg" />
          </button>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

//--------[ Props & Emits ]--------//
interface AppModalProps {
  contentClasses?: string
  modalSize?: string
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
