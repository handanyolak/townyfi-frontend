import { ethers } from 'ethers'
import { KtaToken } from '~/types'
import ktaTokenAbi from '~/abi/ktaTokenAbi.json'

export const useKtaToken = (): KtaToken => {
  return new ethers.Contract(
    useRuntimeConfig().public.ktaTokenAddress,
    ktaTokenAbi,
    useProvider()?.getSigner()
  )
}
