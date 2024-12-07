<template>
  <div class="container flex h-screen items-center justify-center">
    <SidebarTriggerButtons />

    <div
      v-if="!isLoading"
      class="map-frame flex items-center justify-center p-2 lg:p-20"
    >
      <Map ref="mapElement" />
    </div>
    <AppButton
      class="scale-animate absolute bottom-16 flex text-lg md:text-xl"
      @click="startLastFetchedWar()"
    >
      <div class="flex items-center">
        <client-only>
          <Vue3Lottie
            class="cursor-pointer"
            :animation-data="StartWar"
            :height="55"
            :width="55"
          />
        </client-only>
        <span>Watch Last War of the Game!</span>
        <client-only>
          <Vue3Lottie
            class="cursor-pointer"
            :animation-data="StartWar"
            :height="55"
            :width="55"
          />
        </client-only>
      </div>
    </AppButton>
    <ChatAndLogBox v-if="onValidNetwork" />
    <TheLoading v-if="isLoading" full-screen />
    <AppModal
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
import { Vue3Lottie } from 'vue3-lottie'
import TheLoading from '~/components/common/TheLoading.vue'
import Map from '~/components/map/Map.vue'
import AppModal from '~/components/common/AppModal.vue'
import ChatAndLogBox from '~/components/chatAndLog/ChatAndLogBox.vue'
import SidebarTriggerButtons from '~/components/SidebarTriggerButtons.vue'
import AppButton from '~/components/common/AppButton.vue'
import StartWar from '~/assets/lotties/start-war.json'

// --------[ Stores ]-------- //
const appOptionsStore = useAppOptionsStore()
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()

const { initializeApp, clearModalInfo } = appOptionsStore

const { modalComponentName, modalComponentProps } = storeToRefs(appOptionsStore)
const { onValidNetwork } = storeToRefs(connectionStore)
const { isLoading } = storeToRefs(userGameStore)

const appOptionStore = useAppOptionsStore()
const { setModalInfo } = appOptionStore

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

const startLastFetchedWar = () => {
  setModalInfo('WarModal', { sizeMultiplier: 1.4 })
}
</script>

<style>
.toast-theme {
  @apply flex items-center bg-towny-brown-dark-300 bg-opacity-30 text-towny-brown-light-200 backdrop-blur-sm;
}

.map-frame {
  background-image: url('~/assets/img/map-background.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.scale-animate {
  box-shadow: 0px 0px 15px 2px rgba(198, 100, 50, 0.8);
  transform: scale(1);
  animation: scaleEffect 4s infinite ease-in-out;
  transition: transform 0.3s ease;
}

.scale-animate:hover {
  transform: scale(1.1);
}

@keyframes scaleEffect {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
