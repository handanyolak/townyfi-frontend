<template>
  <div>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out transform"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in transform"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          class="modal-backdrop fixed inset-0 h-full w-full bg-black bg-opacity-20"
        >
          <div class="flex justify-center pt-24">
            <Transition
              enter-active-class="transition duration-300 ease-out transform"
              enter-from-class="scale-95 translate-y-10 opacity-0"
              enter-to-class="scale-100 translate-y-10 opacity-100"
              leave-active-class="duration-200 tease-in"
              leave-from-class="scale-100 translate-y-0 opacity-100"
              leave-to-class="scale-95 translate-y-0 translate-y-10 opacity-0"
            >
              <div
                ref="modal"
                class="modal relative w-1/2 rounded-lg bg-white p-4 shadow-xl"
                role="dialog"
              >
                <button class="absolute right-2 top-2" @click="closeModal">
                  <img class="h-5 w-5" src="@/assets/img/exit.svg" />
                </button>
                <slot />
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const modal = ref(null)

const emit = defineEmits(['modalClosed'])

const closeModal = () => {
  emit('modalClosed')
}

onClickOutside(modal, () => closeModal())
</script>
