import { getContract, type Address } from 'viem'
import { bingoAbi } from '~/abi'

export const useContractStore = defineStore('contractStore', () => {
  const {
    public: { bingoContractAddress },
  } = useRuntimeConfig()

  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()
  const { publicClient } = userWalletStore

  // --------[ States ]-------- //
  const bingoContractPublic = getContract({
    address: bingoContractAddress as Address,
    abi: bingoAbi,
    client: publicClient,
  })

  return {
    bingoContractPublic,
  }
})
