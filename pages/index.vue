<template>
  <div class="container flex h-screen items-center justify-center">
    <SidebarTriggerButtons />

    <div
      v-if="!isLoading"
      class="map-frame flex items-center justify-center p-2 lg:p-20"
    >
      <Map ref="mapElement" />
    </div>
    <ChatAndLogBox v-if="onValidNetwork" />
    <TheLoading v-if="isLoading" full-screen />
    <AppModal
      v-if="modalComponentName"
      :modal-size="dynamicModalSize"
      :modal-active="Boolean(modalComponentName)"
      @modal-closed="clearModalInfo()"
    >
      <Component
        :is="currentComponent"
        v-bind="modalComponentProps"
        :class="[
          'tab h-full',
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
import ChatAndLogBox from '~/components/chatAndLog/ChatAndLogBox.vue'
import SidebarTriggerButtons from '~/components/SidebarTriggerButtons.vue'

// --------[ Stores ]-------- //
const appOptionsStore = useAppOptionsStore()
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()

const { initializeApp, clearModalInfo } = appOptionsStore

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

const dynamicModalSize = computed(() => {
  const props: any = modalComponentProps.value
  return (width.value * (props?.sizeMultiplier ?? 1) + 20).toString()
})
</script>

<style lang="postcss">
.toast-theme {
  @apply flex items-center bg-towny-brown-dark-300 bg-opacity-30 text-towny-brown-light-200 backdrop-blur-sm;
}

.map-frame {
  background-image: url('~/assets/img/map-background.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
