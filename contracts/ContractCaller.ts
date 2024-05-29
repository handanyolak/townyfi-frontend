// @ts-nocheck

import { TYPE, useToast } from 'vue-toastification'
import { defaultToastificationConfig } from '~/config'
import type { Mutable, ParamType } from '~/types'

export class ContractCaller<K> {
  constructor(private readonly contract: K) {}

  async callFunction<FT extends 'read' | 'write', FN extends keyof K[FT]>({
    type,
    name,
    needRegister = true,
    args = [],
  }: {
    type: FT
    name: FN
    needRegister?: boolean
    args?: Mutable<ParamType<K[FT][FN]>> | []
  }) {
    const connectionStore = useConnectionStore()
    const userGameStore = useUserGameStore()
    const userWalletStore = useUserWalletStore()

    const { isConnected } = storeToRefs(connectionStore)
    const { isRegistered } = storeToRefs(userGameStore)
    const { chainClient } = storeToRefs(userWalletStore)

    if (type === 'write' && !isConnected.value) {
      useAppToast(TYPE.ERROR, 'Connect your wallet first')
      return false
    }

    if (needRegister && !isRegistered.value) {
      useAppToast(TYPE.ERROR, 'Register your account first')
      return false
    }

    const staticCallRes = await this.contract.simulate[name](...args)
      .then((res) => res)
      .catch((e) => e)

    if (staticCallRes instanceof Error) {
      useAppToast(TYPE.ERROR, staticCallRes.message)
      return false
    }

    const icon = defineAsyncComponent(
      () => import(`../components/toast/Loading.vue`),
    )

    const toast = useToast()
    const toastId = toast(
      `Sending transaction of '${String(name)}' function...`,
      {
        ...defaultToastificationConfig,
        timeout: 0,
        icon,
      },
    )

    try {
      const tx = await this.contract[type][name](...args)

      const receipt = await chainClient.value.waitForTransactionReceipt({
        hash: tx,
      })

      if (receipt.status !== 'success') {
        throw new Error('Transaction failed')
      }

      toast.dismiss(toastId)

      useAppToast(
        TYPE.SUCCESS,
        `Transaction of '${String(name)}' function confirmed successfully`,
      )
      return true
    } catch (error) {
      toast.dismiss(toastId)
      useAppToast(TYPE.ERROR, 'Transaction failed: Something went wrong')
      return false
    }
  }
}
