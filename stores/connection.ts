import { defineStore } from 'pinia'
import { ethers, providers } from 'ethers'

export const useConnectionStore = defineStore('connectionStore', {
  getters: {
    ethereum(): any {
      return window.ethereum
    },
    provider(state): any {
      if (this.ethereum) return new providers.Web3Provider(ethereum)
    },
    signer(state): any {
      if (this.ethereum) return this.provider.getSigner()
    },
  },
})
