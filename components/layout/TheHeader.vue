<template>
  <div class="container">
    <div v-if="ethereum" class="flex justify-between py-3 my-5">
      <span>TownyFi</span>
      <div v-if="register" class="space-x-2">
        <button
          @click="connectWeb()"
          class="p-1 text-white rounded-sm bg-brown-dark"
        >
          Connect Wallet
        </button>
        <button
          @click="disconnectWeb()"
          class="p-1 text-white rounded-sm bg-brown"
        >
          Disconnect Wallet
        </button>
      </div>
      <button
        v-else
        @click="userRegister()"
        class="p-1 text-white rounded-sm bg-brown"
      >
        Register the game
      </button>
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

export default defineComponent({
  setup() {
    // Constants
    const connectionStore = useConnectionStore()
    const ethereum = connectionStore.ethereum
    const userWalletStore = useUserWalletStore()
    const kta = userWalletStore.kta
    const ktaToken = userWalletStore.ktaToken
    const { register } = storeToRefs(userWalletStore)

    // Hooks
    onMounted(async () => {
      if (ethereum) {
        //const accounts = await provider.listAccounts()
        await userWalletStore.connect()
      }
    })

    // Methods
    const connectWeb = () => {
      userWalletStore.connectWeb3()
    }

    const disconnectWeb = () => {
      userWalletStore.disconnectWeb3()
    }

    const userRegister = async () => {
      await (
        await ktaToken
          .connect(connectionStore.signer)
          .approve(kta.address, ethers.constants.MaxUint256)
      ).wait()

      await kta
        .connect(connectionStore.signer)
        .register(ethers.constants.HashZero, ethers.constants.AddressZero)
    }

    return {
      connectWeb,
      disconnectWeb,
      userRegister,
      ethereum,
      register,
    }
  },
})
</script>
