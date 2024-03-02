import type { TypedContractMethod } from '~/types/typechain/common'

export type ExtractContractFnArgs<T> = T extends TypedContractMethod<
  infer A,
  any,
  any
>
  ? A
  : never
