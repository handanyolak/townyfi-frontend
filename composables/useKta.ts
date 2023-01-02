import { ethers } from 'ethers'
import { KillThemAll } from '~/types/typechain-types/contracts/game/KillThemAll'
import ktaAbi from '~/abi/ktaAbi.json'

export const useKta = (): KillThemAll => {
  return new ethers.Contract(
    useRuntimeConfig().public.ktaAddress,
    ktaAbi,
    useProvider()
  )
}
