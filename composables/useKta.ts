import { Contract } from 'ethers'
import ktaAbi from '~/abi/ktaAbi.json'

export const useKta = () => {
  return new Contract(
    useRuntimeConfig().public.ktaAddress,
    ktaAbi,
    useProvider()
  )
}
