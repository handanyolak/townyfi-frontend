import { formatEther, JsonRpcSigner, ZeroAddress } from 'ethers'
import { useTownyToast } from '~/composables/useTownyToast'
import { $t } from '~/composables/useLang'

export const useUserWalletStore = defineStore('userWalletStore', () => {
  const connectionStore = useConnectionStore()
  const { getProvider } = storeToRefs(connectionStore)

  const address = ref(ZeroAddress)
  const balance = ref('')
  const ktaAllowance = ref<bigint>(0n)
  const currentBlockNumber = ref(0)

  const getSigner = computed(
    () => new JsonRpcSigner(getProvider.value, address.value)
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
    const accounts = await getProvider.value.listAccounts()
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
      _address ||
        (await (await getProvider.value.listAccounts())[0].getAddress())
    )
  }

  const updateUserBalance = async () => {
    setBalance(formatEther(await getProvider.value.getBalance(address.value)))
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
    handleAccountsChanged()
    connectionStore.setIsConnected(false)
    useTownyToast('success', $t('disconnected'))
  }

  const connectWeb3 = async () => {
    try {
      await getProvider.value.send('eth_requestAccounts', [])
      handleAccountsChanged()
      await connect()
    } catch (error) {
      console.log(error)
    }
  }

  return {
    address,
    balance,
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
