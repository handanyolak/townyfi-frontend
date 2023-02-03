<template>
  <div class="container">
    <div v-if="hasMetamask && onValidNetwork" class="grid gap-6 md:grid-cols-3">
      <CastleBox
        v-for="(item, index) in addressesByCoordinate"
        :key="index"
        :item="item"
        @modalOpened="openModal(item)"
      />

      <InformationModal
        v-if="showModal"
        :content-classes="'min-h-[50%] w-1/3 bg-transparent'"
        @modalClosed="closeModal()"
      >
        <Parchment>
          <template #parchment-title> Addresses </template>
          <div class="flex flex-col">
            <div>
              <Accordion
                v-for="(_address, index) in currentItem.addresses"
                :key="index"
              >
                <template #address>
                  <div>{{ _address }}</div>
                </template>
                <OtherUser :address="_address" />
              </Accordion>
            </div>
          </div>
        </Parchment>
      </InformationModal>
    </div>
    <GameInfo v-else />
    <HoverMenu />
    <ChatBox />

    <Transition name="loading-slide">
      <TheLoading v-show="isLoading" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { BigNumber } from 'ethers'
import { CoordinateItem } from '~/types'
import { Coordinates } from '~/types/typechain/contracts/game/KillThemAll'
import OtherUser from '~/components/OtherUser.vue'
import Accordion from '~/components/Accordion.vue'
import TheLoading from '~/components/TheLoading.vue'
import { useTownyToast } from '~/composables/useTownyToast'
const connectionStore = useConnectionStore()
const userWalletStore = useUserWalletStore()
const userGameStore = useUserGameStore()
const { address } = storeToRefs(userWalletStore)
const { onValidNetwork } = storeToRefs(connectionStore)
const { addressesByCoordinate, isLoading } = storeToRefs(userGameStore)
const hasMetamask = connectionStore.hasMetamask
const kta = useKta()
const showModal = ref(false)
const currentItem = ref({
  x: BigNumber.from(0),
  y: BigNumber.from(0),
  addresses: [],
} as CoordinateItem)

onMounted(async () => {
  const nearLevel = localStorage.getItem('nearLevel') || 1
  if (hasMetamask && onValidNetwork.value) {
    userWalletStore.setCurrentBlockNumber(
      await connectionStore.provider!!.getBlockNumber()
    )

    connectionStore.provider!!.on('block', (blockNumber: number) => {
      userWalletStore.setCurrentBlockNumber(blockNumber)
    })

    // TODO: userGameStore'a startGameEvents fonksiyonunda eklenecek
    kta.on(
      'UserMoved',
      (
        user: string,
        _, // oldCoordinate: Coordinates.CoordinateStruct,
        newCoordinate: Coordinates.CoordinateStruct
      ) => {
        useTownyToast('info', `New Coordinate: ${newCoordinate}`)

        if (user === useUserWalletStore().address) {
          userGameStore.setUserProperty('coordinate', newCoordinate)
        }
      }
    )

    // TODO: Bu fonskiyon normalde header'da calisiyor fakat zaman uyumsuzlugu yonetilemedigi icin gecici olarak cp yapildi.
    // ileride event yontemiyle haberlesilebilir ya da daha iyi bir yol bulunabilir.
    await userWalletStore.connect()
    const userInfo = { ...(await kta.userByAddr(address.value)) }
    userGameStore.setUserInfo(userInfo)
    await userGameStore.setUserCoordinate(Number(nearLevel))
  }
})

const openModal = (item: CoordinateItem) => {
  currentItem.value = item
  showModal.value = true
}

const closeModal = () => (showModal.value = false)

/* const foo = () => {
  localStorage.setItem('nearLevel', '2')
} */
</script>

<style>
.loading-slide-enter {
  opacity: 0;
}

.loading-slide-enter-active {
  animation: slide-in 1s ease-in forwards;
  transition: opacity 0.5s;
}

.loading-slide-leave-active {
  animation: slide-out 1s ease-out forwards;
  opacity: 0;
  transition: opacity 1s;
}

@keyframes slide-in {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(20px);
  }
}

.toast-theme {
  @apply bg-towni-brown-dark-300 bg-opacity-30 text-towni-brown-dark-300  backdrop-blur-sm;
}
</style>
