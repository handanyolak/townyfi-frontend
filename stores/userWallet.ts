import { formatEther, JsonRpcSigner, ZeroAddress } from 'ethers'
import { useTownyToast } from '~/composables/useTownyToast'
import { $t } from '~/composables/useLang'

export const useUserWalletStore = defineStore('userWalletStore', () => {
  const connectionStore = useConnectionStore()
  const provider = useProvider()
  const ethereum = computed(() => connectionStore.ethereum)

  const address = ref(ZeroAddress)
  const balance = ref('')
  const ktaAllowance = ref<bigint>(0n)
  const currentBlockNumber = ref(0)

  const getSigner = computed(
    () => new JsonRpcSigner(useProvider(), address.value)
  )

  const setAddress = (newAddress: string) => {
    address.value = newAddress
  }

  const setBalance = (newBalance: string) => {
    balance.value = newBalance
  }

  const setCurrentBlockNumber = (newBlockNumber: number) => {
    currentBlockNumber.value = newBlockNumber
  }

  const setKtaAllowance = (newKtaAllowance: bigint) => {
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
    setAddress(
      _address || (await (await provider.listAccounts())[0].getAddress())
    )
  }

  const updateUserBalance = async () => {
    setBalance(formatEther(await provider.getBalance(address.value)))
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

  const disconnectWeb3 = () => {
    handleAccountsChanged()
    connectionStore.setIsConnected(false)
    useTownyToast('success', $t('disconnected'))
  }

  const connectWeb3 = async () => {
    try {
      await provider!!.send('eth_requestAccounts', [])
      handleAccountsChanged()
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
    currentBlockNumber,
    ktaAllowance,
    getSigner,
    setAddress,
    setBalance,
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
