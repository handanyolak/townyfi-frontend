<template>
  <div class="container">
    <div class="grid h-screen grid-cols-3 gap-3">
      <CastleBox
        v-for="item in addressesByCoordinate"
        :item="item"
        :key="item.x + '-' + item.y"
        @modalOpened="openModal(item)"
      ></CastleBox>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import { useConnectStore } from '~/stores/connect'
import { useContractStore } from '~/stores/contract'
import { BigNumber, ethers } from 'ethers'
import { storeToRefs } from 'pinia'
import InformationModal from '~/components/InformationModal.vue'
import CastleBox from '~/components/CastleBox.vue'
import { CoordinateItem } from '~/types/coordinate-item'

export default defineComponent({
  components: { InformationModal, CastleBox },
  setup() {
    // Constants
    const connectInfo = useConnectStore()
    const { address, balance } = storeToRefs(connectInfo)
    const contractInfo: any = useContractStore()
    const { user } = storeToRefs(contractInfo)
    // @ts-ignore // TODO: remove this
    const { $kta, $ktaToken } = useNuxtApp()
    // @ts-ignore // TODO: remove this
    if (window.ethereum === undefined) throw new Error('there is no metamask')
    // @ts-ignore // TODO: remove this // TODO: get provider from composable
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const kta = $kta(provider)
    const ktaToken = $ktaToken(provider)
    const addressesByCoordinate: Ref<CoordinateItem[]> = ref([])
    const showModal = ref(false)
    const currentItem: Ref<CoordinateItem> = ref({
      x: 0,
      y: 0,
      addresses: [],
    })

    // Hooks
    onMounted(async () => {
      if (!address) {
        alert('No address')
        return
      }
      const signer = await provider.getSigner()
      console.log(signer)
      // TODO: kutular componentlestirildikten sonra anlamsizlik gidecek
      console.log(await signer.getAddress())
      user.value = await kta.userByAddr(await signer.getAddress())

      contractInfo.setUserInfo(user.value)
      const nearLevel = 1
      const minScanX = user.value.coordinate._x.sub(nearLevel)
      const maxScanX = user.value.coordinate._x.add(nearLevel)
      const minScanY = user.value.coordinate._y.sub(nearLevel)
      const maxScanY = user.value.coordinate._y.add(nearLevel)
      for (let i = minScanX; i <= maxScanX; i++) {
        for (let j = minScanY; j <= maxScanY; j++) {
          const coordinateItem: CoordinateItem = {
            x: i,
            y: j,
            addresses: await kta.getAddressesByCoordinate([i, j]),
          }

          addressesByCoordinate.value.push(coordinateItem)
        }
      }
      // @ts-ignore   b cnhchdht1QdressesByCoordinate.value[user.value.coordinate])
      /*
            user:
            armor, health, mana, energy, levelId, exp, charPoint, coordinate
            name, referrer

            */
      /*  await (
              await ktaToken
                .connect(signer)
                .approve(kta.address, ethers.constants.MaxUint256)
            ).wait()

            await kta
              .connect(signer)
              .register(ethers.constants.HashZero, ethers.constants.AddressZero) */
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
          /*  console.log(`from: ${from}`)
          console.log('to: ' + to)
          console.log('amount: ' + ethers.utils.formatEther(value)) */
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
      connectInfo,
      showModal,
      balance,
      address,
      user,
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
