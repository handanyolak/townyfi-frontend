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
import { defineComponent, Ref, ref, onMounted, provide } from 'vue'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import { useStore } from '~/stores/index'

export default defineComponent({
  setup() {
    // Constants
    let web3: Web3
    const provider: any = ref(null)
    const isConnected = ref(false)
    const address: Ref<string> = ref('')
    const balance: Ref<string> = ref('')

    const informationStore = useStore()

    // Hooks
    onMounted(async () => {
      await setProvider()

      if (provider.value) {
        // create web3 instance
        web3 = new Web3(provider.value)

        const accounts = await web3.eth.getAccounts()
        if (accounts.length > 0) await connect()
      }
    })

    // Methods
    const connectWeb3 = async () => {
      try {
        // if No web3 provider
        if (!provider.value) {
          throw new Error('No web3 provider detected.')
        }
        // ask to connect
        await web3.eth.requestAccounts()

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
      isConnected.value =
        (await web3.eth.net.isListening()) && provider.value.isConnected()
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

    // set for web3 provider
    const setProvider = async () => {
      provider.value = await detectEthereumProvider({
        mustBeMetaMask: true,
        silent: true,
        timeout: 3000,
      })
    }

    // get user address and balance
    const updateUserInfo = async (_address = null) => {
      await updateUserAddress(_address)
      await updateUserBalance()
    }

    // get user address
    const updateUserAddress = async (_address = null) => {
      address.value =
        _address || (await web3.eth.getAccounts())[0].toLowerCase()
      informationStore.setAddress(address.value)
    }

    // get user address
    const updateUserBalance = async () => {
      balance.value = web3.utils.fromWei(
        await web3.eth.getBalance(address.value),
        'ether'
      )
      informationStore.setBalance(balance.value)
    }

    // start eth events
    const startEthEvents = () => {
      provider.value.on('chainChanged', handleChainChanged)
      provider.value.on('accountsChanged', handleAccountsChanged)
      provider.value.on('disconnect', handleDisconnect)
    }

    // stop eth events
    const stopEthEvents = () => {
      provider.value.removeListener('chainChanged', handleChainChanged)
      provider.value.removeListener('accountsChanged', handleAccountsChanged)
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
