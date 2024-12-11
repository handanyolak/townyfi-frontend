import { getContract, type Address } from 'viem'
import { bingoAbi } from '~/abi'
import { ContractCaller } from '~/contracts'

export const useContractStore = defineStore('contractStore', () => {
  const {
    public: { bingoContractAddress },
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

  return {
    getBingoContract,
    getBingoContractPublic,
    getBingoContractCaller,
  }
})
