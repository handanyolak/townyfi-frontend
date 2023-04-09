import { JsonRpcSigner } from 'ethers'
import { KtaToken__factory } from '~/types/typechain'

export const useKtaToken = () => {
  return KtaToken__factory.connect(
    useRuntimeConfig().public.ktaTokenAddress,
    new JsonRpcSigner(useProvider(), window.ethereum.selectedAddress)
  )
}
