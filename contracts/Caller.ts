// @ts-nocheck

import { TYPE, useToast } from 'vue-toastification'
import { defaultToastificationConfig } from '~/config'

export class Caller<K> {
  constructor(private readonly contract: K) {}

  async callFunction<FT extends 'read' | 'write', FN extends keyof K[FT]>(
    fnType: FT,
    fnName: FN,
    fnArgs: any[] = [], // K[FT][FN],
    needRegister = true,
  ) {
    const connectionStore = useConnectionStore()
    const userGameStore = useUserGameStore()
    const userWalletStore = useUserWalletStore()

    const { isConnected } = storeToRefs(connectionStore)
    const { isRegistered } = storeToRefs(userGameStore)
    const { walletClient } = storeToRefs(userWalletStore)

    if (!isConnected.value) {
      useAppToast(TYPE.ERROR, 'Connect your wallet first')
      return false
    }

    if (needRegister && !isRegistered.value) {
      useAppToast(TYPE.ERROR, 'Register your account first')
      return false
    }

    const staticCallRes = await this.contract.simulate[fnName](fnArgs)
      .then((res) => res)
      .catch((e) => e)

    if (staticCallRes instanceof Error) {
      useAppToast(TYPE.ERROR, staticCallRes.message)
      return false
    }

    const icon = defineAsyncComponent(
      () => import(`../components/Toastification/Loading.vue`),
    )

    const toast = useToast()
    toast(`Sending transaction of '${String(fnName)}' function...`, {
      ...defaultToastificationConfig,
      timeout: 0,
      icon,
    })

    try {
      const tx = await this.contract[fnType][fnName](fnArgs)

      const receipt = await walletClient.value.waitForTransactionReceipt({
        hash: tx,
      })

      if (receipt.status !== 'success') {
        throw new Error('Transaction failed')
      }

      toast.clear()
      useAppToast(
        TYPE.SUCCESS,
        `Transaction of '${String(fnName)}' function confirmed successfully`,
      )
      return true
    } catch (error) {
      toast.clear()
      useAppToast(TYPE.ERROR, 'Transaction failed: Something went wrong')
      return false
    }
  }
}
