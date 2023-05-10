<template>
  <div class="container flex h-screen items-center justify-center">
    <GameInfo v-if="!hasMetamask && !onValidNetwork" />
    <SidebarMenu v-if="onValidNetwork" />
    <ChatBox v-if="hasMetamask && onValidNetwork" />
    <Map />
    <TheLoading v-show="isLoading" />
    <AppModal v-if="modalComponentName" @modalClosed="clearModalInfo()">
      <Component
        :is="currentComponent"
        v-bind="{ ...modalComponentProps }"
        class="tab"
      ></Component>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import TheLoading from '~/components/TheLoading.vue'
import Map from '~/components/Map.vue'
import AppModal from '~/components/AppModal.vue'

//--------[ Stores ]--------//
const appOptionsStore = useAppOptionsStore()
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()

const { initializeApp, clearModalInfo } = appOptionsStore
const { hasMetamask } = connectionStore

const { modalComponentName, modalComponentProps } = storeToRefs(appOptionsStore)
const { onValidNetwork } = storeToRefs(connectionStore)
const { isLoading } = storeToRefs(userGameStore)

//--------[ Hooks ]--------//
onMounted(async () => {
  await initializeApp()
})

const currentComponent = computed(() => {
  const _modalComponentName = modalComponentName.value
  return defineAsyncComponent(
    () => import(`../components/modals/${_modalComponentName}.vue`)
  )
})
</script>

<style>
.toast-theme {
  @apply bg-towni-brown-dark-300 bg-opacity-30 text-towni-brown-dark-300  backdrop-blur-sm;
}
</style>
