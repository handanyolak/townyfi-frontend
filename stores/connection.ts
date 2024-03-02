import type { KillThemAll, KtaToken, MultiCall } from '~/types/typechain'
import { BrowserProvider } from 'ethers'
import { numberToHex } from '~/utils'
import { Caller } from '~/contracts'

export const useConnectionStore = defineStore('connectionStore', () => {
  //--------[ Nuxt Imports ]--------//
  const { chainId } = useRuntimeConfig().public

  //--------[ States ]--------//
  const ethereum = window.ethereum
  const provider = new BrowserProvider(ethereum)
  const hasMetamask = Boolean(window.ethereum)
  const isConnected = ref(false)
  const onValidNetwork = ref(false)

  // NOTE: The reason for doing it this way is due to the bugs in the "ethers" library.
  let ktaToken: KtaToken = {} as KtaToken
  let kta: KillThemAll = {} as KillThemAll
  let multiCall: MultiCall = {} as MultiCall

  //--------[ Getters ]--------//
  const signer = computed(async () => await getProvider.value.getSigner())
  const getProvider = computed(() => provider)
  const getKtaToken = computed(() => ktaToken)
  const getKtaTokenCaller = computed(() => new Caller(getKtaToken.value))
  const getKta = computed(() => kta)
  const getKtaCaller = computed(() => new Caller(getKta.value))
  const getMultiCall = computed(() => multiCall)

  //--------[ Actions ]--------//
  const setKtaToken = (newValue: KtaToken) => {
    ktaToken = newValue
  }

  const setKta = (newValue: KillThemAll) => {
    kta = newValue
  }

  const setMultiCall = (newValue: MultiCall) => {
    multiCall = newValue
  }

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
    signer,
    getKta,
    getKtaCaller,
    getKtaTokenCaller,
    getProvider,
    isConnected,
    getKtaToken,
    getMultiCall,
    hasMetamask,
    onValidNetwork,
    setKta,
    setKtaToken,
    setMultiCall,
    setIsConnected,
    setOnValidNetwork,
    checkOnValidNetwork,
  }
})
