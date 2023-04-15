<template>
  <div class="container flex h-screen items-center justify-center">
    <GameInfo v-if="!hasMetamask && !onValidNetwork" />
    <SidebarMenu v-if="onValidNetwork" />
    <ChatBox v-if="hasMetamask && onValidNetwork" />
    <Map />
    <TheLoading v-show="isLoading" />
  </div>
</template>

<script setup lang="ts">
import TheLoading from '~/components/TheLoading.vue'
import Map from '~/components/Map.vue'

//--------[ Stores ]--------//
const appOptionsStore = useAppOptionsStore()
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()

const { initializeApp } = appOptionsStore
const { hasMetamask } = connectionStore

const { onValidNetwork } = storeToRefs(connectionStore)
const { isLoading } = storeToRefs(userGameStore)

//--------[ Hooks ]--------//
onMounted(async () => {
  await initializeApp()
})
</script>

<style>
.toast-theme {
  @apply bg-towni-brown-dark-300 bg-opacity-30 text-towni-brown-dark-300  backdrop-blur-sm;
}
</style>
