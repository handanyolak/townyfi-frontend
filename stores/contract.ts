import { getContract, type Address } from 'viem'
import { bingoAbi } from '~/abi'

export const useContractStore = defineStore('contractStore', () => {
  const {
    public: { bingoContractAddress },
  } = useRuntimeConfig()

  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()

  const { publicClient } = storeToRefs(userWalletStore)

  // --------[ States ]-------- //
  const getBingoContractPublic = computed(() =>
    getContract({
      address: bingoContractAddress as Address,
      abi: bingoAbi,
      client: publicClient.value,
    }),
  )

  return {
    getBingoContractPublic,
  }
})
