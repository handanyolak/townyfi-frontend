<template>
  <div class="mt-10">
    <AppButton
      basicHover
      class="w-full"
      @click="setModalInfo('CreateTownModal')"
      >Create Town</AppButton
    >
    <p class="my-5 text-center font-bold text-towni-brown-dark-400">OR</p>
    <AppButton basicHover class="w-full" @click="setModalInfo('SearchModal')"
      >Search Modal</AppButton
    >
  </div>
</template>

<script setup lang="ts">
//--------[ Stores ]--------//
const appOptionStore = useAppOptionsStore()
const { setModalInfo } = appOptionStore
</script>
