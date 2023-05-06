import {
  BaseContract,
  BytesLike,
  FunctionFragment,
  checkResultErrors,
  solidityPacked,
} from 'ethers'
import { MultiCallData, ResultInfo } from '~/types'

export const useMultiCall = async (
  multicallData: MultiCallData[]
): Promise<Map<string, ResultInfo[]>> => {
  const connectionStore = useConnectionStore()
  const { getMultiCall } = storeToRefs(connectionStore)

  const contracts: BaseContract[] = []
  const fragments: FunctionFragment[] = []
  const targets: string[] = []
  const data: BytesLike[] = []
  const names: string[] = []
  const inputs: any[] = []

  for (const item of multicallData) {
    const functionsData = item.functionsData
    for (const functionData of functionsData) {
      const input = functionData.inputs || []
      inputs.push(input)
      const name = functionData.name
      names.push(name)
      const contract = item.contract
      contracts.push(contract)
      targets.push(contract.target as string)
      const fragment: FunctionFragment = (contract as any)[name].fragment
      fragments.push(fragment)

      const types: string[] = []
      for (const input of fragment.inputs) {
        types.push(input.type)
      }

      if (fragment.inputs.length !== input.length) {
        throw new Error(`wrong inputs length for function: ${name}`)
      }

      const functionInputData = contract.interface.encodeFunctionData(
        fragment,
        input
      )

      data.push(functionInputData)
    }
  }

  const allRawData = await getMultiCall.value.multiCall(targets, data)
  const result = new Map<string, ResultInfo[]>()
  for (let i = 0; i < allRawData.length; i++) {
    const data = contracts[i].interface.decodeFunctionResult(
      fragments[i],
      allRawData[i]
    )

    const key = targets[i]
    if (!result.has(key)) {
      result.set(key, [])
    }

    const errors = checkResultErrors(data)
    result.get(key)!!.push({
      name: names[i],
      inputs: inputs[i],
      result: data,
      errors,
      hasError: errors.length > 0,
    })
  }

  return result
}
