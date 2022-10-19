<template>
  <div>
    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-200 transform"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-show="showModal"
          class="modal-backdrop fixed bg-black w-full h-full bg-opacity-20 inset-0"
        >
          <div class="flex justify-center pt-24">
            <transition
              enter-active-class="transition ease-out duration-300 transform"
              enter-from-class="opacity-0 translate-y-10 scale-95"
              enter-to-class="opacity-100 translate-y-10 scale-100"
              leave-active-class="tease-in duration-200"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
            >
              <div
                class="modal relative bg-white shadow-xl w-1/2 p-4 rounded-lg"
                role="dialog"
                ref="modal"
              >
                <button @click="closeModal" class="absolute right-2 top-2">
                  <img class="h-5 w-5" src="~/assets/img/exit.svg" />
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

<script>
import { defineComponent, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const showModal = ref(false)
    const modal = ref(null)

    watch(
      () => props.show,
      (show) => {
        showModal.value = show
      }
    )
    // Methods
    const closeModal = () => {
      showModal.value = false
    }

    // VueUse
    onClickOutside(modal, (event) => closeModal())

    return {
      closeModal,
      open,
      showModal,
      modal,
    }
  },
})
</script>
