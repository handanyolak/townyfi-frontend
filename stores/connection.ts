import { numberToHex } from '~/utils'

export const useConnectionStore = defineStore('connectionStore', () => {
  // --------[ Nuxt Imports ]-------- //
  const {
    public: { chainId },
  } = useRuntimeConfig()

  // --------[ States ]-------- //
  const ethereum = window.ethereum
  const hasMetamask = Boolean(ethereum)
  const isConnected = ref(false)
  const onValidNetwork = ref(false)

  // --------[ Getters ]-------- //
  // --------[ Actions ]-------- //
  const setOnValidNetwork = (newValue: boolean) => {
    onValidNetwork.value = hasMetamask && newValue
  }

  const setIsConnected = (newValue: boolean) => {
    isConnected.value = newValue
  }

  const checkOnValidNetwork = async () => {
    const chainIdFromRpc = await window.ethereum.request({
      method: 'eth_chainId',
      params: [],
    })
    setOnValidNetwork(chainIdFromRpc === numberToHex(chainId))
  }

  return {
    isConnected,
    hasMetamask,
    onValidNetwork,
    setIsConnected,
    setOnValidNetwork,
    checkOnValidNetwork,
  }
})
