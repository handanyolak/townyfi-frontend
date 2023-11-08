<template>
  <div class="container flex h-screen items-center justify-center">
    <GamePreview v-if="!hasMetamask || !onValidNetwork" />
    <SidebarMenu v-if="hasMetamask" />
    <ChatBox v-if="hasMetamask && onValidNetwork" />
    <Map ref="mapElement" v-if="hasMetamask && onValidNetwork" />
    <TheLoading v-show="isLoading" />
    <AppModal :modalSize="(width + 20).toString()" :modalActive="Boolean(modalComponentName)" :contentClasses="modalComponentName === 'MapboxModal' ? 'bg-transparent' : ''
      " @modalClosed="clearModalInfo()">
      <Component :is="currentComponent" v-bind="modalComponentProps" :class="modalComponentName === 'MapboxModal'
          ? ''
          : 'overflow-y-auto overflow-x-hidden'
        " class="tab h-full"></Component>
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

//--------[ Data ]--------//
//TODO: map'de hesaplanan width buraya emit ile gonderilecek
const mapElement = ref(null)
const { width } = useElementSize(mapElement)

//--------[ Hooks ]--------//
onMounted(async () => {
  await initializeApp()
})

//--------[ Computed ]--------//
const currentComponent = computed(() => {
  const _modalComponentName = modalComponentName.value
  return defineAsyncComponent(
    () => import(`../components/modals/${_modalComponentName}.vue`)
  )
})
</script>

<style>
.toast-theme {
  @apply bg-towni-brown-dark-300 bg-opacity-30 text-towni-brown-light-200 backdrop-blur-sm flex items-center;
}
</style>
