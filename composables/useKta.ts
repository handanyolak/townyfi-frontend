import { ethers } from 'ethers'
import { KillThemAll } from '~/types'
import ktaAbi from '~/abi/ktaAbi.json'

export const useKta = (): KillThemAll => {
  return new ethers.Contract(
    useRuntimeConfig().public.ktaAddress,
    ktaAbi,
    useProvider()
  )
}
