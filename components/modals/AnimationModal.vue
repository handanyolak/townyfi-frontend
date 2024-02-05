<template>
  <div>
    <div v-if="isConfirmed">
      <client-only>
        <Vue3Lottie :animation-link="animationUrl" />
      </client-only>
    </div>
    <div
      v-else
      class="flex h-full flex-col items-center justify-center space-y-4 rounded-md border-[4px] border-towni-brown-dark-400"
    >
      <p class="text-center text-xl text-towni-brown-light-100">
        {{ props.message }}
      </p>
      <div class="flex space-x-3">
        <AppButton @click="confirm()" class="px-6" basicHover>Yes</AppButton>
        <AppButton @click="decline()" class="px-6" basicHover>No</AppButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'

const appOptionsStore = useAppOptionsStore()
const { isConfirmed } = storeToRefs(appOptionsStore)
const { closeModalWithResponse, clearModalInfo } = useAppOptionsStore()

//--------[ Props & Emits ]--------//
interface AnimationModalProps {
  animation: string
  message: string
}

const props = defineProps<AnimationModalProps>()

const confirm = () => {
  isConfirmed.value = true
  closeModalWithResponse(true)
}

const decline = () => {
  closeModalWithResponse(false)
  clearModalInfo()
}

const animationUrl = computed(() => useLottie(props.animation))
</script>
