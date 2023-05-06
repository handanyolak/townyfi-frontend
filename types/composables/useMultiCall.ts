import { BaseContract, Result } from 'ethers'

export type ResultInfo = {
  name: string
  inputs: any[]
  result: Result
  errors: Array<{ path: Array<string | number>; error: Error }>
  hasError: boolean
}

export type FunctionData = {
  name: string
  inputs?: any[]
}

export type MultiCallData = {
  contract: BaseContract
  functionsData: FunctionData[]
}
