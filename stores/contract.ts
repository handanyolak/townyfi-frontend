import { getContract, type Address } from 'viem'
import { ktaTokenAbi, ktaAbi } from '~/abi'
import { ContractCaller } from '~/contracts'

export const useContractStore = defineStore('contractStore', () => {
  const {
    public: { ktaTokenAddress, ktaAddress },
  } = useRuntimeConfig()

  // --------[ Stores ]-------- //
  const userWalletStore = useUserWalletStore()

  const { chainClient } = storeToRefs(userWalletStore)

  // --------[ States ]-------- //
  const getKtaToken = computed(() =>
    getContract({
      address: ktaTokenAddress as Address,
      abi: ktaTokenAbi,
      client: chainClient.value,
    }),
  )
  const getKta = computed(() =>
    getContract({
      address: ktaAddress as Address,
      abi: ktaAbi,
      client: chainClient.value,
    }),
  )
  const getKtaTokenCaller = computed(
    () => new ContractCaller(getKtaToken.value),
  )
  const getKtaCaller = computed(() => new ContractCaller(getKta.value))

  return {
    getKtaToken,
    getKtaTokenCaller,
    getKta,
    getKtaCaller,
  }
})
