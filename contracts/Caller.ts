// @ts-nocheck

import { defaultToastificationConfig } from '~/config'
import { TYPE, useToast } from 'vue-toastification'
import { ExtractContractFnArgs } from '~/types/contract'

export class Caller<K> {
  constructor(private readonly contract: K) {}

  async callFunction<T extends keyof K>(
    fnName: T,
    fnArgs: ExtractContractFnArgs<K[T]> = [],
    needRegister = true
  ): Promise<boolean> {
    const connectionStore = useConnectionStore()
    const userGameStore = useUserGameStore()

    const { isConnected } = storeToRefs(connectionStore)
    const { isRegistered } = storeToRefs(userGameStore)

    if (!isConnected.value) {
      useAppToast(TYPE.ERROR, 'Connect your wallet first')
      return false
    }

    if (needRegister && !isRegistered.value) {
      useAppToast(TYPE.ERROR, 'Register your account first')
      return false
    }

    const staticCallRes = await this.contract[fnName]
      .staticCall(...fnArgs)
      .then((res) => res)
      .catch((e) => e)

    if (staticCallRes instanceof Error) {
      useAppToast(TYPE.ERROR, staticCallRes.message)
      return false
    }

    const icon = defineAsyncComponent(
      () => import(`../components/Toastification/Loading.vue`)
    )

    const toast = useToast()
    toast(`Sending transaction of '${String(fnName)}' function...`, {
      ...defaultToastificationConfig,
      timeout: 0,
      icon,
    })

    try {
      const tx = await this.contract[fnName](...fnArgs)
      await tx.wait()
      toast.clear()
      useAppToast(
        TYPE.SUCCESS,
        `Transaction of '${String(fnName)}' function confirmed successfully`
      )
      return true
    } catch (error) {
      toast.clear()
      useAppToast(TYPE.ERROR, 'Transaction failed: Something went wrong')
      return false
    }
  }
}
