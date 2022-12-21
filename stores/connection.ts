import { providers } from 'ethers'

export const useConnectionStore = defineStore('connectionStore', {
  state: () => ({
    onValidNetwork: Boolean(window.ethereum) && window.ethereum.chainId == 5,
    isConnected: false,
  }),
  getters: {
    hasMetamask(): boolean {
      return Boolean(window.ethereum)
    },
    ethereum(): any {
      return window.ethereum
    },
    provider(): any {
      if (this.hasMetamask)
        return new providers.Web3Provider(this.ethereum, 'any')
    },
    signer(): any {
      if (this.hasMetamask) return this.provider.getSigner()
    },
  },
  actions: {
    setOnValidNetwork(newValue: boolean) {
      this.onValidNetwork = this.hasMetamask && newValue
    },
    setIsConnected(newValue: boolean) {
      this.isConnected = newValue
    },
  },
})
