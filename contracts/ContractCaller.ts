// @ts-nocheck

import { TYPE, useToast } from 'vue-toastification'
import { useAppKitAccount } from '@reown/appkit/vue'
import type { Mutable, ParamType } from '~/types'

export class ContractCaller<K> {
  constructor(private readonly contract: K) {}

  async callFunction<FT extends 'read' | 'write', FN extends keyof K[FT]>({
    type,
    name,
    args = [],
  }: {
    type: FT
    name: FN
    needRegister?: boolean
    args?: Mutable<ParamType<K[FT][FN]>> | []
  }) {
    const userWalletStore = useUserWalletStore()

    const accountInfo = useAppKitAccount()
    const { chainClient, walletClient } = storeToRefs(userWalletStore)

    if (type === 'write' && !accountInfo.value.isConnected) {
      useAppToast(TYPE.ERROR, 'Connect your wallet first')

      return false
    }

    const staticCallRes = await this.contract.simulate[name](...args)
      .then((res) => res)
      .catch((e) => e)

    if (staticCallRes instanceof Error) {
      const trimmedMessage = staticCallRes.message
        .split('Contract Call:')[0]
        .trim()

      useAppToast(TYPE.ERROR, trimmedMessage)

      return false
    }

    const icon = defineAsyncComponent(
      () => import(`../components/toast/Loading.vue`),
    )

    const toast = useToast()
    const toastId = toast(
      `Sending transaction of '${String(name)}' function...`,
      {
        timeout: 0,
        icon,
      },
    )

    try {
      await walletClient.value.requestAddresses()
      await walletClient.value.getAddresses()

      const _tx = await this.contract[type][name](...args)

      useAppToast(TYPE.INFO, `Transaction of '${name}' function sent`)

      const receipt = await chainClient.value.waitForTransactionReceipt({
        hash: tx,
      })

      if (receipt.status !== 'success') {
        throw new Error('Transaction failed')
      }

      toast.dismiss(toastId)

      useAppToast(TYPE.SUCCESS, `Transaction of '${name}' function confirmed`)
      return true
    } catch (error) {
      console.error(error)
      toast.dismiss(toastId)
      useAppToast(TYPE.ERROR, 'Transaction failed: Something went wrong')
      return false
    }
  }
}
