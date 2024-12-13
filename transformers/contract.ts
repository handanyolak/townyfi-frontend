import type { Player } from '../types'

export function transformPlayer(values: any): Player {
  return {
    playerAddress: values[0],
    remainingNumbersCount: values[1],
    numbers: values[2],
  }
}
