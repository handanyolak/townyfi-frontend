import { providers, ethers, constants } from 'ethers'
import { defineStore } from 'pinia'
import { useConnectionStore } from './connection'
import { useUserGameStore } from './userGame'
export const useUserWalletStore = defineStore('userWalletStore', {
  state: () => ({
    address: constants.AddressZero,
    balance: '',
  }),
  getters: {
    provider(): any {
      return useConnectionStore().provider
    },
    ethereum(): any {
      return useConnectionStore().ethereum
    },
    kta(): any {
      return this.$nuxt.$kta(this.provider)
    },
    ktaToken(): any {
      return this.$nuxt.$ktaToken(this.provider)
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
      const accounts = await this.provider.listAccounts()
      const isConnected = accounts.length > 0
      useConnectionStore().setIsConnected(isConnected)
      if (isConnected) await this.updateUserInfo()

      useConnectionStore().onValidNetwork &&
        useUserGameStore().setIsRegistered(
          await this.kta.isRegistered(this.address)
        )
    },
    async updateUserInfo(_address = null) {
      await this.updateUserAddress(_address)
      await this.updateUserBalance()
    },
    async updateUserAddress(_address = null) {
      this.setAddress(_address || (await this.provider.listAccounts())[0])
    },
    async updateUserBalance() {
      this.setBalance(
        ethers.utils.formatEther(await this.provider.getBalance(this.address))
      )
    },
    // TODO: ileride connection.ts'e tasinacaklar
    startEthEvents() {
      this.ethereum.on('chainChanged', this.handleChainChanged)
      this.ethereum.on('accountsChanged', this.handleAccountsChanged)
      this.ethereum.on('disconnect', this.handleDisconnect)
    },
    async handleChainChanged(chainId) {
      useConnectionStore().setOnValidNetwork(chainId == 5)
      await this.updateUserBalance()
      console.log('Chain has changed.')
    },
    async handleAccountsChanged(accounts: any) {
      const isConnected = accounts.length > 0
      useConnectionStore().setIsConnected(isConnected)
      if (isConnected) {
        await this.updateUserInfo(accounts[0])
        useUserGameStore().setIsRegistered(
          await this.kta.isRegistered(this.address)
        )
        // TODO: change the setUser
        useUserGameStore().setUserInfo(await this.kta.userByAddr(this.address))
        await useUserGameStore().userCoordinate()
        console.log(`Linked account changed to '${accounts[0]}'`)
      } else {
        console.log('Linked account not found. Page will be reloaded.')
        await this.disconnectWeb3()
      }
    },
    async handleDisconnect() {
      useConnectionStore().setIsConnected(false)
    },

    async disconnectWeb3() {
      this.address = constants.AddressZero
      this.balance = ''
      useConnectionStore().setIsConnected(false)
      console.log('Disconnected.')
    },
    async connectWeb3() {
      try {
        if (!this.ethereum) {
          throw new Error('No provider detected.')
        }
        await this.provider.send('eth_requestAccounts', [])

        await this.connect()
      } catch (error) {
        console.log(error)
      }
    },
  },
})
