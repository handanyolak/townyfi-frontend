import type { Address } from 'viem'
import type { TypedContractMethod } from '~/types/typechain/common'

export type CoordinateStruct = {
  _x: bigint
  _y: bigint
}

export type BlockNumberStruct = {
  _at: bigint
}

export type Town = {
  coordinate: CoordinateStruct
  name: string
  leader: string
  exp: bigint
  levelId: bigint
  price: bigint
  recruitment: boolean
  status: string
  mode: string
  protectionAt: BlockNumberStruct
}

export type UserTownInfo = {
  townId: bigint
  joinBlock: bigint
}

export type UserTimer = {
  getHealth: bigint
  getMana: bigint
  getEnergy: bigint
  revive: bigint
  teleport: bigint
  teleportToTown: bigint
  prepareToAttack: bigint
}

export type UserCharPoint = {
  attack: bigint
  defend: bigint
}

export type User = {
  health: bigint
  mana: bigint
  energy: bigint
  armor: bigint
  coordinate: CoordinateStruct
  name: string
  exp: bigint
  levelId: bigint
  referrer: Address
  townInfo: UserTownInfo
  timer: UserTimer
  charPoint: UserCharPoint
}
