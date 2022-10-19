<template>
  <div class="container">
    <div class="grid h-screen grid-cols-3 gap-3">
      <div
        v-for="item in 9"
        class="castle flex flex-col items-center text-2xl font-bold shadow-2xl rounded-xl"
      >
        <button @click="toggleModal">
          <img src="~/assets/img/soldier.svg" alt="soldier" />
        </button>
      </div>
      <InformationModal :show="showModal">
        <div class="flex flex-col">
          <span class="my-1 text-xs">{{ address }}</span>
          <span class="my-1 text-xs">{{ balance }}</span>
          <span class="my-1 text-xs"
            >{{ user?.coordinate?._x }}, {{ user?.coordinate?._y }}</span
          >
          <span class="my-1 text-xs">{{ user?.health }}</span>
        </div>
      </InformationModal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useConnectStore } from '~/stores/connect'
import { useContractStore } from '~/stores/contract'
import { BigNumber, ethers } from 'ethers'
import { storeToRefs } from 'pinia'
import InformationModal from '@/components/InformationModal.vue'

export default defineComponent({
  setup() {
    // Constants
    const connectInfo = useConnectStore()
    const { address, balance } = storeToRefs(connectInfo)
    const contractInfo: any = useContractStore()
    const { user } = storeToRefs(contractInfo)
    // @ts-ignore // TODO: remove this
    const { $kta, $ktaToken } = useNuxtApp()
    // @ts-ignore // TODO: remove this
    if (ethereum === undefined) throw new Error('there is no metamask')
    // @ts-ignore // TODO: remove this // TODO: get provider from composable
    const provider = new ethers.providers.Web3Provider(ethereum)
    /* const user = ref(null) */
    const kta = $kta(provider)
    const ktaToken = $ktaToken(provider)
    const addressesByCoordinate = ref({})
    const showModal = ref(false)

    // Hooks
    onMounted(async () => {
      console.log(ktaToken)
      if (!address) {
        //throw new Error('No Address')
        alert('No address')
        return
      }
      const signer = await provider.getSigner()
      // TODO: kutular componentlestirildikten sonra anlamsizlik gidecekz
      user.value = await kta.userByAddr(await signer.getAddress())
      contractInfo.setUserInfo(user.value)
      const nearLevel = 1
      const minScanX = user.value.coordinate._x.sub(nearLevel)
      const maxScanX = user.value.coordinate._x.add(nearLevel)
      const minScanY = user.value.coordinate._y.sub(nearLevel)
      const maxScanY = user.value.coordinate._y.add(nearLevel)
      for (let i = minScanX; i <= maxScanX; i++) {
        for (let j = minScanY; j <= maxScanY; j++) {
          // @ts-ignore
          addressesByCoordinate.value[[i, j]] =
            await kta.getAddressesByCoordinate([i, j])
        }
      }
      console.log(addressesByCoordinate.value)
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
          console.log(`from: ${from}`)
          console.log('to: ' + to)
          console.log('amount: ' + ethers.utils.formatEther(value))
        }
      )
    }
    const toggleModal = () => (showModal.value = !showModal.value)
    return {
      connectInfo,
      user,
      address,
      balance,
      toggleModal,
      showModal,
    }
  },
  components: { InformationModal },
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
