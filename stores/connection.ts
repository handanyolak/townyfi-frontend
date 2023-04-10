import { KillThemAll, KtaToken } from '~/types/typechain'
import { BrowserProvider } from 'ethers'
import { numberToHex } from '~/utils'

export const useConnectionStore = defineStore('connectionStore', () => {
  /**
   * Nuxt Imports
   */
  const { ktaChainId } = useRuntimeConfig().public

  /**
   * States
   */
  const ethereum = window.ethereum
  const provider = new BrowserProvider(ethereum)
  const hasMetamask = Boolean(ethereum)
  const isConnected = ref(false)
  const onValidNetwork = ref(
    hasMetamask && ethereum.chainId === numberToHex(ktaChainId)
  )
  // NOTE: The reason for doing it this way is due to the bugs in the "ethers" library.
  let ktaToken: KtaToken = {} as KtaToken
  let kta: KillThemAll = {} as KillThemAll

  /**
   * Getters
   */
  const signer = computed(async () => await getProvider.value.getSigner())
  const getProvider = computed(() => provider)
  const getKtaToken = computed(() => ktaToken)
  const getKta = computed(() => kta)

  /**
   * Actions
   */
  const setKtaToken = (newValue: KtaToken) => {
    ktaToken = newValue
  }

  const setKta = (newValue: KillThemAll) => {
    kta = newValue
  }

  const setOnValidNetwork = (newValue: boolean) => {
    onValidNetwork.value = hasMetamask && newValue
  }

  const setIsConnected = (newValue: boolean) => {
    isConnected.value = newValue
  }

  return {
    signer,
    getKta,
    getProvider,
    isConnected,
    getKtaToken,
    hasMetamask,
    onValidNetwork,
    setKta,
    setKtaToken,
    setIsConnected,
    setOnValidNetwork,
  }
})
