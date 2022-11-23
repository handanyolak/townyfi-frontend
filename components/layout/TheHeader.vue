<template>
  <div class="container">
    <div v-if="ethereum" class="flex justify-between py-3 my-5">
      <span>TownyFi</span>
      <div class="space-x-2">
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
    </div>
    <button v-else class="p-1 text-white rounded-sm bg-brown">install</button>
  </div>
</template>

<script lang="ts">
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
    const { address, balance } = storeToRefs(userWalletStore)

    // Hooks
    onMounted(async () => {
      if (ethereum) {
        //const accounts = await provider.listAccounts()
        await userWalletStore.connect()
      }
    })

    // Methods

    const connectWeb = () => {
      userWalletStore.connectWeb3
    }

    const disconnectWeb = () => {
      userWalletStore.disconnectWeb3
    }

    return {
      connectWeb,
      disconnectWeb,
      balance,
      address,
      ethereum,
    }
  },
})
</script>
