<template>
  <div class="container flex h-screen items-center justify-center">
    <GamePreview v-if="!hasMetamask || !onValidNetwork" />
    <SidebarMenu v-if="hasMetamask" />
    <ChatBox v-if="hasMetamask && onValidNetwork" />
    <div
      v-if="hasMetamask && onValidNetwork"
      class="map-frame flex items-center justify-center p-14"
    >
      <Map ref="mapElement" />
    </div>
    <TheLoading v-show="isLoading" full-screen />
    <AppModal
      :modal-size="(width + 20).toString()"
      :modal-active="Boolean(modalComponentName)"
      @modal-closed="clearModalInfo()"
    >
      <Component
        :is="currentComponent"
        v-bind="modalComponentProps"
        :class="[
          'tab scrollbar-gutter-stable h-full',
          modalComponentName === 'MapboxModal'
            ? ''
            : 'overflow-y-auto overflow-x-hidden',
        ]"
      ></Component>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import TheLoading from '~/components/common/TheLoading.vue'
import Map from '~/components/map/Map.vue'
import AppModal from '~/components/common/AppModal.vue'
import ChatBox from '~/components/chat/ChatBox.vue'

// --------[ Stores ]-------- //
const appOptionsStore = useAppOptionsStore()
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()

const { initializeApp, clearModalInfo } = appOptionsStore
const { hasMetamask } = connectionStore

const { modalComponentName, modalComponentProps } = storeToRefs(appOptionsStore)
const { onValidNetwork } = storeToRefs(connectionStore)
const { isLoading } = storeToRefs(userGameStore)

// --------[ Data ]-------- //
// TODO: map'de hesaplanan width buraya emit ile gonderilecek
const mapElement = ref(null)
const { width } = useElementSize(mapElement)

// --------[ Hooks ]-------- //
onMounted(async () => {
  await initializeApp()
})

// --------[ Computed ]-------- //
const currentComponent = computed(() => {
  const _modalComponentName = modalComponentName.value
  return defineAsyncComponent(
    () => import(`../components/modals/${_modalComponentName}.vue`),
  )
})
</script>

<style>
.toast-theme {
  @apply flex items-center bg-towni-brown-dark-300 bg-opacity-30 text-towni-brown-light-200 backdrop-blur-sm;
}

.map-frame {
  background-image: url('~/assets/img/map-background.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
