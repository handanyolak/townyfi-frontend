import type { Abi, Address } from 'viem'

export type ResultInfo = {
  name: string
  inputs: any[]
  result?: unknown
  error?: Error
  hasError: boolean
}

export type FunctionData = {
  name: string
  inputs?: any[]
}

export type MultiCallData = {
  address: Address
  abi: Abi
  functionsData: FunctionData[]
}
