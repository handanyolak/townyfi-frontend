import { numberToHex } from '~/utils'
import { KillThemAll, KtaToken } from '~/types/typechain'

export const useConnectionStore = defineStore('connectionStore', () => {
  const { ktaChainId } = useRuntimeConfig().public
  const userWalletStore = useUserWalletStore()
  const provider = useProvider()
  const signer = computed(async () => await provider.getSigner())

  const isConnected = ref(false)
  const hasMetamask = Boolean(window.ethereum)
  const ethereum = window.ethereum
  const onValidNetwork = ref(
    hasMetamask && ethereum.chainId === numberToHex(ktaChainId)
  )

  // NOTE: Burayi boyle yapmamizin sebebi ethers'in sabit kontrolleridir.
  let ktaToken: KtaToken = {} as KtaToken
  let kta: KillThemAll = {} as KillThemAll

  const getKtaToken = computed(() => ktaToken)

  const getKta = computed(() => kta)

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
    onValidNetwork,
    isConnected,
    hasMetamask,
    ethereum,
    signer,
    getKtaToken,
    getKta,
    setKta,
    setKtaToken,
    setOnValidNetwork,
    setIsConnected,
  }
})
