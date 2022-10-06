import { defineStore } from 'pinia'

export const useConnectStore = defineStore('connectStore', {
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
