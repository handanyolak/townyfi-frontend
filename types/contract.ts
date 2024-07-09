import type { Address, Hex } from 'viem'

export type CoordinateStruct = {
  _x: bigint
  _y: bigint
}

export type BlockNumberStruct = {
  _at: bigint
}

export type Town = {
  coordinate: CoordinateStruct
  name: Hex
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
  name: Hex
  exp: bigint
  levelId: bigint
  referrer: Address
  townInfo: UserTownInfo
  timer: UserTimer
  charPoint: UserCharPoint
}

export type SettingsMax = {
  health: bigint
  mana: bigint
  energy: bigint
  armor: bigint
  teleportDistance: bigint
  killArmorRewardLimit: bigint
  safeTownDistance: bigint
  safeTownDifference: bigint
  safeZoneDistance: bigint
  safeZoneDifference: bigint
  attackDistance: bigint
  levelDifference: bigint
}

export type SettingsPrice = {
  health: bigint
  mana: bigint
  energy: bigint
  armor: bigint
  revive: bigint
  register: bigint
  teleport: bigint
  createTown: bigint
  settleTown: bigint
  teleportToTown: bigint
  prepareAttack: bigint
  prepareDefend: bigint
}

export type SettingsRate = {
  getHealth: bigint
  getMana: bigint
  getEnergy: bigint
  registerReferralReward: bigint
  armorAbsorption: bigint
  attack: bigint
  movement: bigint
}

export type SettingsTime = {
  revive: bigint
  teleport: bigint
  teleportToTown: bigint
  attackableAt: bigint
  warExpiredAt: bigint
  protectionAt: bigint
  prepareToAttack: bigint
}

export type SettingsMin = {
  levelToCreateTown: bigint
  townAreaRadius: bigint
}

export type SettingsExp = {
  kill: bigint
  referrerKill: bigint
}

export type SettingsMultiplier = {
  attack: bigint
  resistance: bigint
}

export type Settings = {
  max: SettingsMax
  price: SettingsPrice
  rate: SettingsRate
  time: SettingsTime
  min: SettingsMin
  exp: SettingsExp
  multiplier: SettingsMultiplier
  numberDigits: bigint
}

export type WarLog = {
  attacker: Address
  defender: Address
  healthDamage: bigint
  armorDamage: bigint
  remainingHealth: bigint
  remainingArmor: bigint
}
