import { numberToHex } from 'viem'

export const useConnectionStore = defineStore('connectionStore', () => {
  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()

  // --------[ States ]-------- //
  const ethereum = window.ethereum
  const hasMetamask = Boolean(ethereum)
  const isConnected = ref(false)
  const onValidNetwork = ref(false)

  // --------[ Getters ]-------- //
  // --------[ Actions ]-------- //
  const setOnValidNetwork = (newValue: boolean) => {
    onValidNetwork.value = newValue
  }

  const setIsConnected = (newValue: boolean) => {
    isConnected.value = newValue
  }

  const checkOnValidNetwork = async () => {
    if (!hasMetamask) {
      setOnValidNetwork(true)
    } else {
      const chainId: string = await window.ethereum.request({
        method: 'eth_chainId',
        params: [],
      })
      setOnValidNetwork(chainId === numberToHex(userWalletStore.chain.id))
    }
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
