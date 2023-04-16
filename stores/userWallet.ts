import { formatEther, JsonRpcSigner, ZeroAddress } from 'ethers'
import { useTownyToast } from '~/composables/useTownyToast'
import { $t } from '~/composables/useLang'

export const useUserWalletStore = defineStore('userWalletStore', () => {
  //--------[ Stores ]--------//
  const connectionStore = useConnectionStore()
  const { getProvider } = storeToRefs(connectionStore)

  //--------[ States ]--------//
  const address = ref(ZeroAddress)
  const ktaAllowance = ref<bigint>(0n)
  const currentBlockNumber = ref(0)
  const balance = ref('')

  //--------[ Getters ]--------//
  const getSigner = computed(
    () => new JsonRpcSigner(getProvider.value, address.value)
  )

  //--------[ Actions ]--------//
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
    // TODO: Is this code block necessary?
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
    getSigner,
    ktaAllowance,
    currentBlockNumber,
    connect,
    setAddress,
    setBalance,
    connectWeb3,
    startEthEvents,
    disconnectWeb3,
    setKtaAllowance,
    handleDisconnect,
    updateUserBalance,
    updateUserAddress,
    handleChainChanged,
    updateUserWalletInfo,
    handleAccountsChanged,
    setCurrentBlockNumber,
  }
})
