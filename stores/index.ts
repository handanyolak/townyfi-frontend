import { defineStore } from 'pinia'

export const useStore = defineStore('userChainInfo', {
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
