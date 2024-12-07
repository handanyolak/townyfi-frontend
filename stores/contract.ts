import { getContract, type Address } from 'viem'
import { ktaTokenAbi, ktaAbi, ktaGameChatAbi } from '~/abi'
import { ContractCaller } from '~/contracts'

export const useContractStore = defineStore('contractStore', () => {
  const {
    public: { ktaTokenAddress, ktaAddress, ktaGameChatAddress },
  } = useRuntimeConfig()

  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()

  const { chainClient, publicClient } = storeToRefs(userWalletStore)

  // --------[ States ]-------- //
  const getKtaToken = computed(() =>
    getContract({
      address: ktaTokenAddress as Address,
      abi: ktaTokenAbi,
      client: chainClient.value,
    }),
  )
  const getKtaTokenPublic = computed(() =>
    getContract({
      address: ktaTokenAddress as Address,
      abi: ktaTokenAbi,
      client: publicClient.value,
    }),
  )
  const getKta = computed(() =>
    getContract({
      address: ktaAddress as Address,
      abi: ktaAbi,
      client: chainClient.value,
    }),
  )
  const getKtaPublic = computed(() =>
    getContract({
      address: ktaAddress as Address,
      abi: ktaAbi,
      client: publicClient.value,
    }),
  )
  const getKtaGameChat = computed(() =>
    getContract({
      address: ktaGameChatAddress as Address,
      abi: ktaGameChatAbi,
      client: chainClient.value,
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
  const getKtaCaller = computed(() => new ContractCaller(getKta.value))
  const getKtaGameChatCaller = computed(
    () => new ContractCaller(getKtaGameChat.value),
  )

  return {
    getKtaToken,
    getKtaTokenPublic,
    getKtaTokenCaller,
    getKta,
    getKtaPublic,
    getKtaCaller,
    getKtaGameChat,
    getKtaGameChatPublic,
    getKtaGameChatCaller,
  }
})
