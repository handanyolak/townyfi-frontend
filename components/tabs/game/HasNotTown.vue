<template>
  <div class="mt-10">
    <AppButton
      basic-hover
      class="w-full"
      @click="setModalInfo('CreateTownModal')"
      >Create Town</AppButton
    >
    <p class="my-5 text-center font-bold text-towny-brown-dark-400">OR</p>
    <AppButton basic-hover class="w-full" @click="setModalInfo('SearchModal')"
      >Search Modal</AppButton
    >
  </div>
</template>

<script setup lang="ts">
import AppButton from '~/components/common/AppButton.vue'

// --------[ Stores ]-------- //
const appOptionStore = useAppOptionsStore()

const { setModalInfo } = appOptionStore
</script>
