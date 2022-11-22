import { providers, ethers } from 'ethers'
import { defineStore } from 'pinia'
import { useConnectionStore } from './connection'

export const useUserWalletStore = defineStore('userWalletStore', {
  state: () => ({
    address: '',
    balance: '',
  }),
  getters: {
    provider(state): any {
      return useConnectionStore().provider
    },
  },
  actions: {
    setAddress(newAddress: string) {
      this.address = newAddress
    },
    setBalance(newBalance: string) {
      this.balance = newBalance
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
  },
})
