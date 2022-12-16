<template>
  <div class="container">
    <div v-if="hasMetamask" class="flex justify-between py-3 my-5">
      <span>TownyFi</span>
      <div v-if="onValidNetwork">
        <div v-if="isConnected">
          <div class="space-x-2">
            <button
              v-if="!isRegistered"
              @click="userRegister()"
              class="p-1 text-white rounded-sm bg-brown"
            >
              Register the game
            </button>
            <button
              @click="disconnectWeb3()"
              class="p-1 text-white rounded-sm bg-brown"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
        <button
          @click="connectWeb3()"
          v-else
          class="p-1 text-white rounded-sm bg-brown-dark"
        >
          Connect Wallet
        </button>
      </div>
      <a
        v-else
        @click="switchNetwork()"
        target="_blank"
        class="p-1 text-white rounded-sm bg-brown"
      >
        Switch Network
      </a>
    </div>
    <a
      v-else
      href="https://metamask.io/download/"
      target="_blank"
      class="p-1 text-white rounded-sm bg-brown"
    >
      install
    </a>
  </div>
</template>

<script lang="ts">
import { ethers } from 'ethers'
import { storeToRefs } from 'pinia'
import { defineComponent, onMounted } from 'vue'
import { useConnectionStore } from '~/stores/connection'
import { useUserWalletStore } from '~/stores/userWallet'
import { useUserGameStore } from '~/stores/userGame'

export default defineComponent({
  setup() {
    // Constants
    const connectionStore = useConnectionStore()
    const hasMetamask = connectionStore.hasMetamask
    const ethereum = connectionStore.ethereum
    const userWalletStore = useUserWalletStore()
    const userGameStore = useUserGameStore()
    const kta = userWalletStore.kta
    const ktaToken = userWalletStore.ktaToken
    const { connectWeb3, disconnectWeb3 } = userWalletStore
    const { isRegistered } = storeToRefs(userGameStore)
    const { onValidNetwork, isConnected } = storeToRefs(connectionStore)

    // Hooks
    onMounted(async () => {
      if (hasMetamask) {
        /* const accounts = await userWalletStore.provider */
        /* await userWalletStore.connect() */
        userWalletStore.startEthEvents()
      }
    })

    // Methods
    const switchNetwork = async () => {
      // TODO: chainId env'den alinacak
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: '0x' + Number(5).toString(16),
            },
          ],
        })
      } catch (error) {
        console.log(error)
      }
    }

    const userRegister = async () => {
      try {
        await (
          await ktaToken
            .connect(connectionStore.signer)
            .approve(kta.address, ethers.constants.MaxUint256)
        ).wait()

        await kta
          .connect(connectionStore.signer)
          .register(ethers.constants.HashZero, ethers.constants.AddressZero)
      } catch (error) {
        console.log(error)
      }
    }

    return {
      connectWeb3,
      disconnectWeb3,
      userRegister,
      hasMetamask,
      isRegistered,
      onValidNetwork,
      switchNetwork,
      isConnected,
    }
  },
})
</script>
