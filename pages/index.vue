<template>
  <div class="container flex h-screen items-center justify-center">
    <SidebarMenu />
    <ChatAndLogBox v-if="onValidNetwork" />
    <div
      v-if="onValidNetwork"
      class="map-frame flex items-center justify-center p-14"
    >
      <Map v-if="onValidNetwork" ref="mapElement" />
    </div>
    <TheLoading v-if="isLoading" full-screen />
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
import ChatAndLogBox from '~/components/chatAndLog/ChatAndLogBox.vue'
import SidebarMenu from '~/components/SidebarMenu.vue'

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
  console.log('isLoading', isLoading.value)
  await initializeApp()
  // const settings_ = {
  //   max: {
  //     health: 100,
  //     mana: 125,
  //     energy: 150,
  //     armor: 200,
  //     teleportDistance: 50,
  //     killArmorRewardLimit: 3,
  //     safeTownDistance: 100,
  //     safeTownDifference: 100,
  //     safeZoneDistance: 4,
  //     safeZoneDifference: 10000,
  //     attackDistance: 1,
  //     levelDifference: 2,
  //   },
  //   price: {
  //     health: 5,
  //     mana: 50,
  //     energy: 3,
  //     armor: 15,
  //     revive: 50,
  //     register: 500,
  //     teleport: 1,
  //     createTown: 0,
  //     settleTown: 2500,
  //     teleportToTown: 250,
  //     prepareAttack: 100,
  //     prepareDefend: 50,
  //   },
  //   rate: {
  //     getHealth: 90,
  //     getMana: 60,
  //     getEnergy: 30,
  //     registerReferralReward: 10,
  //     armorAbsorption: 2,
  //     attack: 5,
  //     movement: 1,
  //   },
  //   time: {
  //     revive: 17280,
  //     teleport: 60,
  //     teleportToTown: 720,
  //     attackableAt: 720,
  //     warExpiredAt: 360,
  //     protectionAt: 720,
  //     prepareToAttack: 30,
  //   },
  //   min: {
  //     levelToCreateTown: 0,
  //     townAreaRadius: 1,
  //   },
  //   exp: {
  //     kill: 50,
  //     referrerKill: 1,
  //   },
  //   multiplier: {
  //     attack: 5,
  //     resistance: 2,
  //   },
  //   numberDigits: 1,
  // }
  // setTimeout(async () => {
  //   await getKta.value.write.updateSettings([settings_ as any])
  // }, 1000)
  // const deneme = await getKta.value.read.settings()
  // console.log('settings', transformSettings(deneme))
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
