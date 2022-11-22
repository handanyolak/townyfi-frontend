<template>
  <div class="container">
    <div v-if="ethereum" class="flex justify-between py-3 my-5">
      <span>TownyFi</span>
      <div class="space-x-2">
        <button
          @click="connectWeb3()"
          class="p-1 text-white rounded-sm bg-brown-dark"
        >
          Connect Wallet
        </button>
        <button
          @click="disconnectWeb3()"
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
import { defineComponent, ref, onMounted } from 'vue'
import { ethers } from 'ethers'
import { useConnectionStore } from '~/stores/connection'
import { useUserWalletStore } from '~/stores/userWallet'

export default defineComponent({
  setup() {
    // Constants
    const connectionStore = useConnectionStore()
    const ethereum = connectionStore.ethereum
    const userWalletStore = useUserWalletStore()
    const { address, balance } = storeToRefs(userWalletStore)
    const provider: any = ref()
    if (ethereum) {
      provider.value = new ethers.providers.Web3Provider(ethereum)
    }
    const isConnected = ref(false)

    // Hooks
    onMounted(async () => {
      if (ethereum) {
        //const accounts = await provider.listAccounts()
        await connect()
      }
    })

    // Methods
    const connectWeb3 = async () => {
      try {
        // if No web3 provider
        if (!ethereum) {
          throw new Error('No provider detected.')
        }
        // ask to connect
        await provider.value.send('eth_requestAccounts', [])

        await connect()
      } catch (error) {
        // user denied account access
        console.log(error)
      }
    }

    const connect = async () => {
      // get address, balance etc.
      await updateUserInfo()
      // Check connecting

      // TODO: remove this
      isConnected.value = Boolean(address.value)
      if (!isConnected.value) {
        throw new Error('Connection Error.')
      }
      // started eth events
      await startEthEvents()
    }

    const disconnectWeb3 = async () => {
      // reset events
      await stopEthEvents()
      // set false to `isConnected`
      isConnected.value = false
      console.log('Disconnected.')
    }

    // get user address and balance
    const updateUserInfo = async (_address = null) => {
      await userWalletStore.updateUserAddress(_address)
      await userWalletStore.updateUserBalance()
    }

    // start eth events
    const startEthEvents = () => {
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('disconnect', handleDisconnect)
    }

    // stop eth events
    const stopEthEvents = () => {
      ethereum.removeListener('chainChanged', handleChainChanged)
      ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }

    // eth change chain event
    const handleChainChanged = async () => {
      await userWalletStore.updateUserBalance()
      console.log('Chain has changed.')
    }

    // eth change account event
    const handleAccountsChanged = async (_accounts: any) => {
      if (_accounts.length > 0) {
        await updateUserInfo(_accounts[0].toLowerCase())
        console.log(`Linked account changed to '${_accounts[0]}'`)
      } else {
        console.log('Linked account not found. Page will be reloaded.')
        await disconnectWeb3()
      }
    }

    // eth disconnect event
    const handleDisconnect = async () => {
      await stopEthEvents()
      isConnected.value = false
    }
    return {
      connectWeb3,
      disconnectWeb3,
      balance,
      address,
      ethereum,
    }
  },
})
</script>
