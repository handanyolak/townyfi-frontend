import {
  type Address,
  formatEther,
  zeroAddress,
  custom,
  publicActions,
  createWalletClient,
  createPublicClient,
  formatUnits,
  http,
} from 'viem'
import * as chains from 'viem/chains'
import { TYPE } from 'vue-toastification'
import { useAppToast } from '~/composables/useAppToast'
import { custom as customChain } from '~/chains/custom'
import { $t } from '~/composables/useLang'

export const useUserWalletStore = defineStore('userWalletStore', () => {
  // --------[ Nuxt ]-------- //
  const {
    public: { chain: runtimeChain },
  } = useRuntimeConfig()

  // --------[ Stores ]-------- //
  const connectionStore = useConnectionStore()
  const userGameStore = useUserGameStore()

  // --------[ States ]-------- //
  const ethereum = window.ethereum
  const address = ref(zeroAddress as Address)
  const chain =
    runtimeChain !== 'custom'
      ? (chains[
          runtimeChain as keyof typeof chains // eslint-disable-line import/namespace
        ] as chains.Chain)
      : customChain

  const walletClient = computed(() =>
    createWalletClient({
      chain,
      transport: custom(ethereum),
      account: address.value,
    }).extend(publicActions),
  )

  const publicClient = computed(() =>
    createPublicClient({
      chain,
      transport: http(chain.rpcUrls.default.http[0]),
      batch: {
        multicall: true,
      },
    }),
  )

  const chainClient = connectionStore.hasMetamask ? walletClient : publicClient
  const ktaSymbol = ref('')
  const ktaDecimals = ref(0)
  const ktaAllowance = ref(0n)
  const ktaBalance = ref(0n)
  const currentBlockNumber = ref(BigInt(0))
  const balance = ref('')

  // --------[ Actions ]-------- //
  const setAddress = (newAddress: Address) => {
    address.value = newAddress
  }

  const setBalance = (newBalance: string) => {
    balance.value = newBalance
  }

  const setCurrentBlockNumber = (newBlockNumber: bigint) => {
    currentBlockNumber.value = newBlockNumber
  }

  const setKtaSymbol = (newKtaSymbol: string) => {
    ktaSymbol.value = newKtaSymbol
  }

  const setKtaDecimals = (newKtaDecimals: number) => {
    ktaDecimals.value = newKtaDecimals
  }

  const setKtaAllowance = (newKtaAllowance: bigint) => {
    ktaAllowance.value = BigInt(formatUnits(newKtaAllowance, ktaDecimals.value))
  }

  const setKtaBalance = (newKtaBalance: bigint) => {
    ktaBalance.value = BigInt(formatUnits(newKtaBalance, ktaDecimals.value))
  }

  const connect = async () => {
    const accounts = await walletClient.value.getAddresses()
    const isConnected = accounts.length > 0
    connectionStore.setIsConnected(isConnected)
    // TODO: Is this code block necessary?
    if (isConnected) await updateUserWalletInfo(accounts[0])
  }

  const updateUserWalletInfo = async (_address: Address) => {
    updateUserAddress(_address)
    await updateUserBalance(_address)
  }

  const updateUserAddress = (_address: Address) => {
    setAddress(_address)
  }

  const updateUserBalance = async (_address: Address) => {
    setBalance(
      formatEther(
        await chainClient.value.getBalance({
          address: _address,
        }),
      ),
    )
  }

  const startEthEvents = () => {
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('disconnect', handleDisconnect)
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  const handleAccountsChanged = () => {
    window.location.reload()
  }

  const handleDisconnect = () => {
    connectionStore.setIsConnected(false)
  }

  const disconnectWeb3 = () => {
    connectionStore.setIsConnected(false)
    userGameStore.setIsRegistered(false)
    useAppToast(TYPE.SUCCESS, $t('disconnected'))
  }

  const connectWeb3 = async () => {
    try {
      await walletClient.value.requestAddresses()
      handleAccountsChanged()
      await connect()
    } catch (error) {
      console.log(error)
    }
  }

  return {
    address,
    balance,
    chain,
    chainClient,
    walletClient,
    ktaSymbol,
    ktaDecimals,
    ktaAllowance,
    ktaBalance,
    currentBlockNumber,
    connect,
    setAddress,
    setBalance,
    connectWeb3,
    startEthEvents,
    disconnectWeb3,
    setKtaSymbol,
    setKtaDecimals,
    setKtaAllowance,
    setKtaBalance,
    handleDisconnect,
    updateUserBalance,
    updateUserAddress,
    handleChainChanged,
    updateUserWalletInfo,
    handleAccountsChanged,
    setCurrentBlockNumber,
  }
})
