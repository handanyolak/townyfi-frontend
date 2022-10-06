<template>
  <div class="container">
    <div class="grid h-screen grid-cols-3 gap-3">
      <div
        v-for="item in 9"
        :key="item"
        class="flex flex-col items-center text-2xl font-bold border-8 shadow-2xl bg-gradient-to-r from-brown-light via-brown to-brown-dark rounded-xl border-brown"
      >
        <span class="px-4 my-2 bg-brown-light">
          <span
            class="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-600"
            >DESTINY</span
          >
        </span>
        <span class="my-1 text-xs text-white">{{
          informationStore.address
        }}</span>
        <span class="my-1 text-xs text-white">{{
          informationStore.balance
        }}</span>
        <span class="my-1 text-xs text-white"
          >{{ user?.coordinate?._x }}, {{ user?.coordinate?._y }}</span
        >
        <span class="my-1 text-xs text-white">{{ user?.health }}</span>
        <span class="my-1 text-xs text-white">{{ user?.health }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from '~/stores/index'
import { BigNumber, ethers } from 'ethers'
import useKtaToken from '~/composable/useKtaToken'
import useKta from '~/composable/useKta'
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    // Constants
    const informationStore = useStore()
    const { address } = storeToRefs(informationStore)
    // @ts-ignore // TODO: remove this
    if (ethereum === undefined) throw new Error('there is no metamask')
    // @ts-ignore // TODO: remove this // TODO: get provider from composable
    const provider = new ethers.providers.Web3Provider(ethereum)
    const user = ref(null)

    const { ktaTokenContract } = useKtaToken()
    const { ktaContract } = useKta()

    // Hooks
    onMounted(async () => {
      if (!address) {
        //throw new Error('No Address')
        alert('No address')
        return
      }

      const signer = await provider.getSigner()
      user.value = await ktaContract.userByAddr(await signer.getAddress())

      /*
      user:
      armor, health, mana, energy, levelId, exp, charPoint, coordinate
      name, referrer

      */

      /*  await (
        await ktaTokenContract
          .connect(signer)
          .approve(ktaContract.address, ethers.constants.MaxUint256)
      ).wait()

      await ktaContract
        .connect(signer)
        .register(ethers.constants.HashZero, ethers.constants.AddressZero) */

      /* startKtaTokenEvents() */
      /*  await ktaTokenContract
        .connect(signer)
        .transfer(
          '0xb91760bA38F185660755fEEcDFaeCe974Ac04A91',
          ethers.utils.parseEther('1')
        ) */
    })

    // Methods
    const startKtaTokenEvents = () => {
      ktaTokenContract.on(
        'Transfer',
        async (from: string, to: string, value: BigNumber) => {
          console.log(`from: ${from}`)
          console.log('to: ' + to)
          console.log('amount: ' + ethers.utils.formatEther(value))
        }
      )
    }

    return {
      informationStore,
      user,
    }
  },
})
</script>
