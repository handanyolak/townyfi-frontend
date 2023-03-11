<template>
  <div class="container">
    <div
      v-if="hasMetamask && onValidNetwork"
      class="grid gap-6"
      :class="{
        'md:grid-cols-3': (nearLevel === '1'),
        'md:grid-cols-5': (nearLevel === '2'),
        'md:grid-cols-7': (nearLevel === '3'),
      }"
    >
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
                <template #title>
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
    <SidebarMenu v-if="onValidNetwork" />
    <ChatBox />

    <Transition name="loading-slide">
      <TheLoading v-show="isLoading" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { BigNumber } from 'ethers'
import { CoordinateItem } from '~/types'
import OtherUser from '~/components/OtherUser.vue'
import Accordion from '~/components/Accordion.vue'
import TheLoading from '~/components/TheLoading.vue'

const appOptionsStore = useAppOptionsStore()
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()
const { initializeApp } = appOptionsStore
const { hasMetamask } = connectionStore
const { onValidNetwork } = storeToRefs(connectionStore)
const { addressesByCoordinate, isLoading, nearLevel } =
  storeToRefs(userGameStore)
const showModal = ref(false)
const currentItem = ref({
  x: BigNumber.from(0),
  y: BigNumber.from(0),
  addresses: [],
} as CoordinateItem)

onMounted(async () => {
  await initializeApp()
})

const openModal = (item: CoordinateItem) => {
  currentItem.value = item
  showModal.value = true
}

const closeModal = () => (showModal.value = false)
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
