export const useConnectionStore = defineStore('connectionStore', () => {
  const { ktaChainId } = useRuntimeConfig().public
  const provider = useProvider()
  const signer = computed(() => provider.getSigner())

  const isConnected = ref(false)
  const hasMetamask = Boolean(window.ethereum)
  const ethereum = window.ethereum
  const onValidNetwork = ref(
    hasMetamask && ethereum.chainId === '0x' + ktaChainId.toString(16)
  )

  const setOnValidNetwork = (newValue: boolean) => {
    onValidNetwork.value = hasMetamask && newValue
  }

  const setIsConnected = (newValue: boolean) => {
    isConnected.value = newValue
  }

  return {
    onValidNetwork,
    isConnected,
    hasMetamask,
    ethereum,
    provider,
    signer,
    setOnValidNetwork,
    setIsConnected,
  }
})
