<template>
  <div class="container">
    <div
      class="absolute left-0 p-2 transition ease-in-out rounded-r-lg pl-7 bg-amber-900"
      :class="
        appOptionStore.showSidebar
          ? 'translate-x-0'
          : 'duration-1000 -translate-x-6'
      "
      @mouseover="sideOver()"
    >
      <img src="@/assets/img/sword-sidebar.svg" class="w-10 h-10" />
    </div>
    <div>
      <button @click="foo()">set to 2</button>
    </div>
    <div
      v-if="hasMetamask && onValidNetwork"
      class="grid h-screen grid-cols-3 gap-4"
    >
      <CastleBox
        v-for="(item, index) in addressesByCoordinate"
        :key="index"
        :item="item"
        @modalOpened="openModal(item)"
      />

      <InformationModal v-if="showModal" @modalClosed="closeModal()">
        <div class="flex flex-col">
          <span class="my-1 text-xs">{{ currentItem.x }}</span>
          <span class="my-1 text-xs">{{ currentItem.y }}</span>
          <span
            v-for="(_address, index) in currentItem.addresses"
            :key="index"
            class="my-1 text-xs"
            >{{ _address }}</span
          >
        </div>
      </InformationModal>
    </div>
    <GameInfo v-else />
  </div>
</template>

<script setup lang="ts">
import InformationModal from '~/components/InformationModal.vue'
import GameInfo from '~/components/GameInfo.vue'
import CastleBox from '~/components/CastleBox.vue'
import { CoordinateItem } from '~/types/coordinate-item'

// Constants
const { $kta } = useNuxtApp()
const connectionStore = useConnectionStore()
const userWalletStore = useUserWalletStore()
const userGameStore: any = useUserGameStore()
const appOptionStore = useAppOptions()
const { address } = storeToRefs(userWalletStore)
const { onValidNetwork } = storeToRefs(connectionStore)
const { addressesByCoordinate } = storeToRefs(userGameStore)
const provider = connectionStore.provider
const hasMetamask = connectionStore.hasMetamask
const kta = $kta(provider)
const showModal = ref(false)
const currentItem = ref({
  x: 0,
  y: 0,
  addresses: [],
} as CoordinateItem)

// Hooks
onMounted(async () => {
  const nearLevel = localStorage.getItem('nearLevel') || 1
  if (hasMetamask && onValidNetwork.value) {
    // TODO: Bu fonskiyon normalde header'da calisiyor fakat zaman uyumsuzlugu yonetilemedigi icin gecici olarak cp yapildi.
    // ileride event yontemiyle haberlesilebilir ya da daha iyi bir yol bulunabilir.
    await userWalletStore.connect()
    const userInfo = await kta.userByAddr(address.value)
    userGameStore.setUserInfo(userInfo)
    await userGameStore.userCoordinate(Number(nearLevel))
  }
})

const openModal = (item: CoordinateItem) => {
  currentItem.value = item
  showModal.value = true
}

const closeModal = () => (showModal.value = false)

const foo = () => {
  localStorage.setItem('nearLevel', '2')
}
const sideOver = () => {
  appOptionStore.showSidebar = true
}
</script>

<style>
.castle {
  background-image: url('~/assets/img/castle-brown.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
}
</style>
