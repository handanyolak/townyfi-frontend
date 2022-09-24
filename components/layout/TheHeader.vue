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

export default defineComponent({
  setup() {
    // Constants
    let web3: Web3
    const provider: any = ref(null)
    const isConnected = ref(false)
    const address: any = ref(null)
    const balance: Ref<string> = ref('')

    // Hooks
    onMounted(async () => {
      await setProvider()

      if (provider.value) {
        // create web3 instance
        web3 = new Web3(provider.value)
      }
    })

    // Methods
    const connectWeb3 = async () => {
      console.log(provider.value)
      console.log(web3.eth)
      console.log('********')
      try {
        // if No web3 provider
        if (!provider.value) {
          throw new Error('No web3 provider detected.')
        }
        // ask to connect
        await web3.eth.requestAccounts()

        // get address, balance etc.
        await updateUserInfo()

        // check connecting
        isConnected.value =
          (await web3.eth.net.isListening()) && provider.value.isConnected()
        if (!isConnected.value) {
          throw new Error('Connection Error.')
        }
        // start eth events
        await startEthEvents()
      } catch (error) {
        // user denied account access
        console.log(error)
      }
    }

    const disconnectWeb3 = async () => {
      console.log('Disconnected.')
      // reset events
      await stopEthEvents()
      // reload to
      location.reload()
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
    }

    // get user address
    const updateUserBalance = async () => {
      balance.value = web3.utils.fromWei(
        await web3.eth.getBalance(address.value),
        'ether'
      )
    }

    // start eth events
    const startEthEvents = () => {
      provider.value.on('chainChanged', handleChainChanged)
      provider.value.on('accountsChanged', handleAccountsChanged)
      provider.value.on('disconnect', handleDisconnect)
    }

    // Stop eth events
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
        location.reload()
      }
    }

    // eth disconnect event
    const handleDisconnect = async () => {
      await stopEthEvents()
      location.reload()
    }

    return {
      connectWeb3,
      disconnectWeb3,
    }
  },
})
</script>
