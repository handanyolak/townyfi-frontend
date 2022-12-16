<template>
  <div>
    <Teleport to="body">
      <transition
        enter-active-class="transition duration-200 ease-out transform"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in transform"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          class="fixed inset-0 w-full h-full bg-black modal-backdrop bg-opacity-20"
        >
          <div class="flex justify-center pt-24">
            <transition
              enter-active-class="transition duration-300 ease-out transform"
              enter-from-class="scale-95 translate-y-10 opacity-0"
              enter-to-class="scale-100 translate-y-10 opacity-100"
              leave-active-class="duration-200 tease-in"
              leave-from-class="scale-100 translate-y-0 opacity-100"
              leave-to-class="scale-95 translate-y-0 translate-y-10 opacity-0"
            >
              <div
                class="relative w-1/2 p-4 bg-white rounded-lg shadow-xl modal"
                role="dialog"
                ref="modal"
              >
                <button @click="closeModal" class="absolute right-2 top-2">
                  <img class="w-5 h-5" src="~/assets/img/exit.svg" />
                </button>
                <slot />
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const modal = ref(null)

const emit = defineEmits(['modalClosed'])

const closeModal = () => {
  emit('modalClosed')
}

onClickOutside(modal, () => closeModal())
</script>
