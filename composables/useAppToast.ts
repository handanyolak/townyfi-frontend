import { TYPE, useToast } from 'vue-toastification'
import type { ToastOptions } from 'vue-toastification/src/types'
import { uppercaseFirstChar } from '~/utils'
import type { ToastFunction } from '~/types'

export const useAppToast = (
  type: Exclude<TYPE, TYPE.DEFAULT>,
  message: string,
  options?: ToastOptions,
) => {
  const icon = defineAsyncComponent(
    () => import(`../components/toast/${uppercaseFirstChar(type)}.vue`),
  )

  return (useToast()[type] as ToastFunction)(message, {
    ...options,
    icon,
    type,
  })
}
