<template>
  <div class="container">
    <div
      v-if="hasMetamask && onValidNetwork"
      class="grid h-screen grid-cols-3 gap-3"
    >
      <CastleBox
        v-for="(item, index) in addressesByCoordinate"
        :item="item"
        :key="index"
        @modalOpened="openModal(item)"
      />
      <InformationModal v-if="showModal" @modalClosed="closeModal()">
        <div class="flex flex-col">
          <span class="my-1 text-xs">{{ currentItem.x }}</span>
          <span class="my-1 text-xs">{{ currentItem.y }}</span>
          <span v-for="address in currentItem.addresses" class="my-1 text-xs">{{
            address
          }}</span>
        </div>
      </InformationModal>
    </div>
    <GameInfo v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import { useConnectionStore } from '~/stores/connection'
import { useUserGameStore } from '~/stores/userGame'
import { BigNumber, ethers } from 'ethers'
import { storeToRefs } from 'pinia'
import InformationModal from '~/components/InformationModal.vue'
import GameInfo from '~/components/GameInfo.vue'
import CastleBox from '~/components/CastleBox.vue'
import TheLoading from '~/components/TheLoading.vue'
import { CoordinateItem } from '~/types/coordinate-item'
import { useUserWalletStore } from '~/stores/userWallet'

export default defineComponent({
  components: { InformationModal, CastleBox, TheLoading, GameInfo },
  setup() {
    // Constants
    // @ts-ignore // TODO: remove this
    const { $kta, $ktaToken } = useNuxtApp()
    const connectionStore = useConnectionStore()
    const userWalletStore = useUserWalletStore()
    const userGameStore: any = useUserGameStore()
    const { address, balance } = storeToRefs(userWalletStore)
    const { onValidNetwork } = storeToRefs(connectionStore)
    const { user, addressesByCoordinate } = storeToRefs(userGameStore)
    const provider = connectionStore.provider
    const hasMetamask = connectionStore.hasMetamask
    const kta = $kta(provider)
    const ktaToken = $ktaToken(provider)
    const showModal = ref(false)
    const currentItem: Ref<CoordinateItem> = ref({
      x: 0,
      y: 0,
      addresses: [],
    })

    // Hooks
    onMounted(async () => {
      if (hasMetamask && onValidNetwork.value) {
        // TODO: Bu fonskiyon normalde header'da calisiyor fakat zaman uyumsuzlugu yonetilemedigi icin gecici olarak cp yapildi.
        // ileride event yontemiyle haberlesilebilir ya da daha iyi bir yol bulunabilir.
        await userWalletStore.connect()
        const userInfo = await kta.userByAddr(address.value)
        userGameStore.setUserInfo(userInfo)
        await userGameStore.userCoordinate()
      }

      // @ts-ignore   b cnhchdht1QdressesByCoordinate.value[user.value.coordinate])
      /*
            user:
            armor, health, mana, energy, levelId, exp, charPoint, coordinate
            name, referrer

            */

      /* startKtaTokenEvents() */
      /*  await ktaToken
              .connect(signer)
              .transfer(
                '0xb91760bA38F185660755fEEcDFaeCe974Ac04A91',
                ethers.utils.parseEther('1')
              ) */
    })

    // Methods
    const startKtaTokenEvents = () => {
      ktaToken.on(
        'Transfer',
        async (from: string, to: string, value: BigNumber) => {
          console.log(`from: ${from}`)
          console.log('to: ' + to)
          console.log('amount: ' + ethers.utils.formatEther(value))
        }
      )
    }

    const openModal = (item: CoordinateItem) => {
      currentItem.value = item
      showModal.value = true
    }

    const closeModal = () => (showModal.value = false)

    return {
      openModal,
      closeModal,
      currentItem,
      addressesByCoordinate,
      showModal,
      balance,
      address,
      user,
      hasMetamask,
      onValidNetwork,
    }
  },
})
</script>

<style>
.castle {
  background-image: url('~/assets/img/castle-brown.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
}
</style>
