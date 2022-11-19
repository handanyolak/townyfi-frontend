import { defineStore } from 'pinia'

export const useUserWalletStore = defineStore('userWalletStore', {
  state: () => ({
    address: '',
    balance: '',
  }),
  actions: {
    setAddress(newAddress: string) {
      this.address = newAddress
    },
    setBalance(newBalance: string) {
      this.balance = newBalance
    },
  },
})
