import type { Abi, Address } from 'viem'
import type { MultiCallData, ResultInfo } from '~/types'

export const useMultiCall = async (
  multicallData: MultiCallData[],
): Promise<Map<Address, ResultInfo[]>> => {
  const userWalletStore = useUserWalletStore()

  const { walletClient } = storeToRefs(userWalletStore)

  const contracts: {
    address: Address
    abi: Abi
    functionName: string
    args: any[]
  }[] = []
  const targets: Address[] = []
  const names: string[] = []
  const inputs: any[] = []

  for (const item of multicallData) {
    const { address, abi, functionsData } = item
    const contract = {
      address,
      abi,
    } as const

    for (const functionData of functionsData) {
      const { name, inputs: fnInputs = [] } = functionData
      inputs.push(fnInputs)
      names.push(name)
      const multicallContracts = {
        ...contract,
        functionName: name,
        args: fnInputs,
      }
      targets.push(address)

      contracts.push(multicallContracts)
    }
  }

  const data = await walletClient.value.multicall({
    contracts,
    allowFailure: true,
  })

  const result = new Map<Address, ResultInfo[]>()
  for (let i = 0; i < data.length; i++) {
    const { result: multicallRes, error, status } = data[i]

    const key = targets[i]
    if (!result.has(key)) {
      result.set(key, [])
    }

    result.get(key)!.push({
      name: names[i],
      inputs: inputs[i],
      result: multicallRes,
      error,
      hasError: status !== 'success',
    })
  }

  return result
}
