<template>
  <div class="container">
    <div class="grid h-screen grid-cols-3 gap-3">
      <div
        v-for="(item, index) in addressesByCoordinate"
        :key="index"
        class="flex flex-col items-center text-2xl font-bold shadow-2xl castle rounded-xl"
      >
        <button @click="toggleModal(index)">
          <img src="~/assets/img/soldier.svg" alt="soldier" />
        </button>
      </div>
      <InformationModal :show="showModal">
        <div class="flex flex-col">
          <span class="my-1 text-xs">{{ coordinateInfo.x }}</span>
          <span class="my-1 text-xs">{{ coordinateInfo.y }}</span>
          <span
            v-for="address in coordinateInfo.addresses"
            class="my-1 text-xs"
            >{{ address }}</span
          >
        </div>
      </InformationModal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from 'vue'
import { useConnectStore } from '~/stores/connect'
import { useContractStore } from '~/stores/contract'
import { BigNumber, ethers } from 'ethers'
import { storeToRefs } from 'pinia'
import InformationModal from '@/components/InformationModal.vue'

export default defineComponent({
  components: { InformationModal },
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
    const addressesByCoordinate: any = ref([])
    const showModal = ref(false)
    const coordinateInfo: any = reactive({
      x: null,
      y: null,
      addresses: null,
    })

    // Hooks
    onMounted(async () => {
      /* console.log(ktaToken) */
      if (!address) {
        //throw new Error('No Address')
        alert('No address')
        return
      }
      const signer = await provider.getSigner()
      // TODO: kutular componentlestirildikten sonra anlamsizlik gidecek
      user.value = await kta.userByAddr(await signer.getAddress())
      /* console.log(user.value) */
      contractInfo.setUserInfo(user.value)
      const nearLevel = 1
      const minScanX = user.value.coordinate._x.sub(nearLevel)
      const maxScanX = user.value.coordinate._x.add(nearLevel)
      const minScanY = user.value.coordinate._y.sub(nearLevel)
      const maxScanY = user.value.coordinate._y.add(nearLevel)
      for (let i = minScanX; i <= maxScanX; i++) {
        for (let j = minScanY; j <= maxScanY; j++) {
          // @ts-ignore
          addressesByCoordinate.value.push({
            x: i,
            y: j,
            addresses: await kta.getAddressesByCoordinate([i, j]),
          })
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
    const toggleModal = (index: any) => {
      showModal.value = !showModal.value
      coordinateInformation(index)
    }

    const coordinateInformation = (index: any) => {
      coordinateInfo.x = addressesByCoordinate.value[index].x
      coordinateInfo.y = addressesByCoordinate.value[index].y
      coordinateInfo.addresses = addressesByCoordinate.value[index].addresses
    }
    return {
      toggleModal,
      addressesByCoordinate,
      coordinateInfo,
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
