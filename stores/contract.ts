import { getContract, type Address } from 'viem'
import { ktaTokenAbi, ktaGameChatAbi, bingoAbi } from '~/abi'
import { ContractCaller } from '~/contracts'

export const useContractStore = defineStore('contractStore', () => {
  const {
    public: { ktaTokenAddress, ktaGameChatAddress, bingoContractAddress },
  } = useRuntimeConfig()

  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()

  const { walletClient, publicClient } = storeToRefs(userWalletStore)

  // --------[ States ]-------- //
  const getBingoContract = computed(() =>
    getContract({
      address: bingoContractAddress as Address,
      abi: bingoAbi,
      client: walletClient.value,
    }),
  )
  const getBingoContractPublic = computed(() =>
    getContract({
      address: bingoContractAddress as Address,
      abi: bingoAbi,
      client: publicClient.value,
    }),
  )
  const getBingoContractCaller = computed(
    () => new ContractCaller(getBingoContract.value),
  )
  const getKtaToken = computed(() =>
    getContract({
      address: ktaTokenAddress as Address,
      abi: ktaTokenAbi,
      client: walletClient.value,
    }),
  )
  const getKtaTokenPublic = computed(() =>
    getContract({
      address: ktaTokenAddress as Address,
      abi: ktaTokenAbi,
      client: publicClient.value,
    }),
  )
  const getKtaGameChat = computed(() =>
    getContract({
      address: ktaGameChatAddress as Address,
      abi: ktaGameChatAbi,
      client: walletClient.value,
    }),
  )
  const getKtaGameChatPublic = computed(() =>
    getContract({
      address: ktaGameChatAddress as Address,
      abi: ktaGameChatAbi,
      client: publicClient.value,
    }),
  )
  const getKtaTokenCaller = computed(
    () => new ContractCaller(getKtaToken.value),
  )
  const getKtaGameChatCaller = computed(
    () => new ContractCaller(getKtaGameChat.value),
  )

  return {
    getBingoContract,
    getBingoContractPublic,
    getBingoContractCaller,
    getKtaToken,
    getKtaTokenPublic,
    getKtaTokenCaller,
    getKtaGameChat,
    getKtaGameChatPublic,
    getKtaGameChatCaller,
  }
})
