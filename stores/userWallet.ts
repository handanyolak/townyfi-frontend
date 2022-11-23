import { providers, ethers } from 'ethers'
import { defineStore } from 'pinia'
import { useConnectionStore } from './connection'

export const useUserWalletStore = defineStore('userWalletStore', {
  state: () => ({
    address: '',
    balance: '',
    isConnected: false,
  }),
  getters: {
    provider(state): any {
      return useConnectionStore().provider
    },
    ethereum(): any {
      return useConnectionStore().ethereum
    },
  },

  actions: {
    setAddress(newAddress: string) {
      this.address = newAddress
    },
    setBalance(newBalance: string) {
      this.balance = newBalance
    },
    async connect() {
      await this.updateUserInfo()

      this.isConnected = Boolean(this.address)
      if (!this.isConnected) {
        throw new Error('Connection Error.')
      }

      await this.startEthEvents()
    },
    async updateUserInfo(_address = null) {
      await this.updateUserAddress(_address)
      await this.updateUserBalance()
    },
    async updateUserAddress(_address = null) {
      this.setAddress(
        _address ||
          (await this.provider.send('eth_requestAccounts', []))[0].toLowerCase()
      )
    },
    async updateUserBalance() {
      this.setBalance(
        ethers.utils.formatEther(
          (await this.provider.getBalance(this.address)).toString()
        )
      )
    },
    startEthEvents() {
      ethereum.on('chainChanged', this.handleChainChanged)
      ethereum.on('accountsChanged', this.handleAccountsChanged)
      ethereum.on('disconnect', this.handleDisconnect)
    },
    async handleChainChanged() {
      await this.updateUserBalance()
      console.log('Chain has changed.')
    },
    async handleAccountsChanged(_accounts: any) {
      if (_accounts.length > 0) {
        await this.updateUserInfo(_accounts[0].toLowerCase())
        console.log(`Linked account changed to '${_accounts[0]}'`)
      } else {
        console.log('Linked account not found. Page will be reloaded.')
        await this.disconnectWeb3()
      }
    },
    stopEthEvents() {
      ethereum.removeListener('chainChanged', this.handleChainChanged)
      ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
    },
    async handleDisconnect() {
      await stopEthEvents()
      this.isConnected = false
    },

    async disconnectWeb3() {
      // reset events
      await this.stopEthEvents()
      // set false to `isConnected`
      this.isConnected = false
      console.log('Disconnected.')
    },
    async connectWeb3() {
      try {
        // if No web3 provider
        if (!this.ethereum) {
          throw new Error('No provider detected.')
        }
        // ask to connect
        await this.provider.send('eth_requestAccounts', [])

        await this.connect()
      } catch (error) {
        // user denied account access
        console.log(error)
      }
    },
  },
})
