import { ethers, constants, BigNumber } from 'ethers'
import { useTownyToast } from '~/composables/useTownyToast'
import { $t } from '~/composables/useLang'

export const useUserWalletStore = defineStore('userWalletStore', () => {
  const connectionStore = useConnectionStore()
  const kta = useKta()
  const ktaToken = useKtaToken()
  const provider = useProvider()
  const ethereum = computed(() => connectionStore.ethereum)

  const address = ref(constants.AddressZero)
  const balance = ref('')
  const ktaAllowance = ref<BigNumber>('')
  const currentBlockNumber = ref(0)

  const setUser = (newUserInfo: any) => {
    user.value = newUserInfo
  }

  const setAddress = (newAddress: string) => {
    address.value = newAddress
  }

  const setBalance = (newBalance: string) => {
    balance.value = newBalance
  }

  const setCurrentBlockNumber = (newBlockNumber: number) => {
    currentBlockNumber.value = newBlockNumber
  }

  const setKtaAllowance = (newKtaAllowance: BigNumber) => {
    ktaAllowance.value = newKtaAllowance
  }

  const connect = async () => {
    const accounts = await provider.listAccounts()
    const isConnected = accounts.length > 0
    connectionStore.setIsConnected(isConnected)
    // TODO: buraya gerek var mi arastiralim
    if (isConnected) await updateUserWalletInfo()
  }

  const updateUserWalletInfo = async (_address = null) => {
    await updateUserAddress(_address)
    await updateUserBalance()
  }

  const updateUserAddress = async (_address = null) => {
    setAddress(_address || (await provider.listAccounts())[0])
  }

  const updateUserBalance = async () => {
    setBalance(
      ethers.utils.formatEther(await provider.getBalance(address.value))
    )
  }

  const startEthEvents = () => {
    ethereum.value.on('chainChanged', handleChainChanged)
    ethereum.value.on('accountsChanged', handleAccountsChanged)
    ethereum.value.on('disconnect', handleDisconnect)
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

  const disconnectWeb3 = async () => {
    await handleAccountsChanged([ethers.constants.AddressZero])
    connectionStore.setIsConnected(false)
    useTownyToast('success', $t('disconnected'))
  }

  const connectWeb3 = async () => {
    try {
      await provider!!.send('eth_requestAccounts', [])
      const accounts = await provider!!.listAccounts()
      await handleAccountsChanged(accounts)
      await connect()
    } catch (error) {
      console.log(error)
    }
  }

  return {
    address,
    balance,
    provider,
    ethereum,
    kta,
    ktaToken,
    currentBlockNumber,
    ktaAllowance,
    setAddress,
    setBalance,
    setUser,
    connect,
    updateUserWalletInfo,
    updateUserAddress,
    updateUserBalance,
    startEthEvents,
    handleChainChanged,
    handleAccountsChanged,
    handleDisconnect,
    disconnectWeb3,
    connectWeb3,
    setCurrentBlockNumber,
    setKtaAllowance,
  }
})
