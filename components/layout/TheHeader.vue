<template>
  <div class="container">
    <div class="flex justify-between py-3 my-5">
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
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { defineComponent, ref, onMounted } from 'vue'
import { ethers } from 'ethers'
import { useConnectStore } from '~/stores/connect'

export default defineComponent({
  setup() {
    // Constants
    const informationStore = useConnectStore()
    const { address, balance } = storeToRefs(informationStore)
    // @ts-ignore // TODO: remove this
    if (ethereum === undefined) throw new Error('there is no metamask')
    // @ts-ignore // TODO: remove this
    const provider = new ethers.providers.Web3Provider(ethereum)
    const isConnected = ref(false)

    // Hooks
    onMounted(async () => {
      if (provider) {
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) await connect()
      }
    })

    // Methods
    const connectWeb3 = async () => {
      try {
        // if No web3 provider
        if (!provider) {
          throw new Error('No provider detected.')
        }
        // ask to connect
        await provider.send('eth_requestAccounts', [])

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
      await updateUserAddress(_address)
      await updateUserBalance()
    }

    // get user address
    const updateUserAddress = async (_address = null) => {
      address.value =
        _address ||
        (await provider.send('eth_requestAccounts', []))[0].toLowerCase()
      informationStore.setAddress(address.value)
    }

    // get user address
    const updateUserBalance = async () => {
      balance.value = ethers.utils.formatEther(
        (await provider.getBalance(address.value)).toString()
      )
      informationStore.setBalance(balance.value)
    }

    // start eth events
    const startEthEvents = () => {
      // @ts-ignore // TODO: remove this
      ethereum.on('chainChanged', handleChainChanged)
      // @ts-ignore // TODO: remove this
      ethereum.on('accountsChanged', handleAccountsChanged)
      // @ts-ignore // TODO: remove this
      ethereum.on('disconnect', handleDisconnect)
    }

    // stop eth events
    const stopEthEvents = () => {
      // @ts-ignore // TODO: remove this
      ethereum.removeListener('chainChanged', handleChainChanged)
      // @ts-ignore // TODO: remove this
      ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }

    // eth change chain event
    const handleChainChanged = async () => {
      await updateUserBalance()
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
      informationStore,
      balance,
      address,
    }
  },
})
</script>
