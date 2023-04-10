import { numberToHex } from '~/utils'
import { KillThemAll, KtaToken } from '~/types/typechain'
import { BrowserProvider } from 'ethers'

export const useConnectionStore = defineStore('connectionStore', () => {
  const { ktaChainId } = useRuntimeConfig().public

  const ethereum = window.ethereum
  const provider = new BrowserProvider(ethereum)
  const signer = computed(async () => await getProvider.value.getSigner())

  const isConnected = ref(false)
  const hasMetamask = Boolean(ethereum)
  const onValidNetwork = ref(
    hasMetamask && ethereum.chainId === numberToHex(ktaChainId)
  )

  // NOTE: Burayi boyle yapmamizin sebebi ethers'in sabit kontrolleridir.
  let ktaToken: KtaToken = {} as KtaToken
  let kta: KillThemAll = {} as KillThemAll

  const getKtaToken = computed(() => ktaToken)

  const getKta = computed(() => kta)

  const getProvider = computed(() => provider)

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
    getProvider,
    onValidNetwork,
    isConnected,
    hasMetamask,
    signer,
    getKtaToken,
    getKta,
    setKta,
    setKtaToken,
    setOnValidNetwork,
    setIsConnected,
  }
})
