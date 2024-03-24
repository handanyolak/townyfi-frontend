import { TownMode, TownStatus } from '~/enums'
import type { Town, User } from '~/types/contract'
import { replaceAtKeys } from '~/utils'

export function transformTown(values: any): Town {
  return {
    coordinate: values[0],
    name: values[1],
    leader: values[2],
    exp: values[3],
    levelId: values[4],
    price: values[5],
    recruitment: values[6],
    status: TownStatus[Number(values[7])],
    mode: TownMode[Number(values[8])],
    protectionAt: values[9]._at,
  }
}

export function transformUser(values: any): User {
  return {
    health: values[0],
    mana: values[1],
    energy: values[2],
    armor: values[3],
    coordinate: values[4],
    name: values[5],
    exp: values[6],
    levelId: values[7],
    referrer: values[8],
    townInfo: values[9],
    timer: replaceAtKeys(values[10]),
    charPoint: values[11],
  }
}
