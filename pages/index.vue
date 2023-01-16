<template>
  <div class="container">
    <div>
      <button @click="foo()">set to 2</button>
    </div>
    <div v-if="hasMetamask && onValidNetwork" class="grid grid-cols-3 gap-4">
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
    <HoverMenu />
    <ChatBox />
  </div>
</template>

<script setup lang="ts">
import { BigNumber } from 'ethers'
import { CoordinateItem } from '~/types'

// Constants
const connectionStore = useConnectionStore()
const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()
const { address } = storeToRefs(userWalletStore)
const { onValidNetwork } = storeToRefs(connectionStore)
const { addressesByCoordinate } = storeToRefs(userGameStore)
const hasMetamask = connectionStore.hasMetamask
const kta = useKta()
const showModal = ref(false)
const currentItem = ref({
  x: BigNumber.from(0),
  y: BigNumber.from(0),
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
    await userGameStore.setUserCoordinate(Number(nearLevel))
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
</script>
