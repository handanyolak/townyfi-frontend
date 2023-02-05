import { ethers, constants } from 'ethers'
import { useTownyToast } from '~/composables/useTownyToast'
import { $t } from '~/composables/useLang'

export const useUserWalletStore = defineStore('userWalletStore', () => {
  const { ktaChainId } = useRuntimeConfig().public
  const kta = useKta()
  const ktaToken = useKtaToken()
  const connectionStore = useConnectionStore()
  const userGameStore = useUserGameStore()
  const provider = useProvider()
  const ethereum = computed(() => connectionStore.ethereum)

  const address = ref(constants.AddressZero)
  const balance = ref('')
  const currentBlockNumber = ref(0)

  const setUserInfo = (newUserInfo: any) => {
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

  const connect = async () => {
    const accounts = await provider.listAccounts()
    const isConnected = accounts.length > 0
    connectionStore.setIsConnected(isConnected)
    if (isConnected) await updateUserInfo()

    connectionStore.onValidNetwork &&
      userGameStore.setIsRegistered(await kta.isRegistered(address.value))
  }

  const updateUserInfo = async (_address = null) => {
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

  const handleChainChanged = async (chainId) => {
    connectionStore.setOnValidNetwork(chainId === ktaChainId)

    await updateUserBalance()

    useTownyToast('info', $t('chain_changed'))
  }

  const handleAccountsChanged = async (accounts: string[]) => {
    const isConnected = accounts.length > 0
    connectionStore.setIsConnected(isConnected)
    if (isConnected) {
      await updateUserInfo(accounts[0])
      userGameStore.setIsRegistered(await kta.isRegistered(address.value))
      // TODO: change the setUser
      userGameStore.setUserInfo(await kta.userByAddr(address.value))
      await userGameStore.setUserCoordinate()
      useTownyToast('info', `${$t('address_changed')} ${accounts[0]}`)
    } else {
      useTownyToast('error', $t('address_not_found'))
      await disconnectWeb3()
    }
  }

  const handleDisconnect = () => {
    connectionStore.setIsConnected(false)
  }

  const disconnectWeb3 = () => {
    address.value = constants.AddressZero
    balance.value = ''
    connectionStore.setIsConnected(false)
    useTownyToast('success', $t('disconnected'))
  }

  const connectWeb3 = async () => {
    try {
      if (!ethereum.value) {
        throw new Error('No provider detected.')
      }
      await provider.send('eth_requestAccounts', [])

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
    setAddress,
    setBalance,
    setUserInfo,
    connect,
    updateUserInfo,
    updateUserAddress,
    updateUserBalance,
    startEthEvents,
    handleChainChanged,
    handleAccountsChanged,
    handleDisconnect,
    disconnectWeb3,
    connectWeb3,
    setCurrentBlockNumber,
  }
})
