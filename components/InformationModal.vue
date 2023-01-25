<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 h-full w-full bg-black bg-opacity-20">
      <div class="flex h-screen items-center justify-center">
        <div
          ref="modal"
          :class="contentClasses"
          class="modal relative min-h-[20%] min-w-[30%] rounded-lg bg-white"
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

interface ContentClassesProps {
  contentClasses: string
}

defineProps<ContentClassesProps>()

const emit = defineEmits(['modalClosed'])

const modal = ref(null)

const closeModal = () => {
  emit('modalClosed')
}

onClickOutside(modal, () => closeModal())
</script>
