import { TYPE, useToast } from 'vue-toastification'
import { uppercaseFirstChar } from '~/utils'
import { defaultToastificationConfig } from '~/config'
import { ToastFunction } from '~~/types'

// TODO: change useAppToast
export const useAppToast = (
  type: Exclude<TYPE, TYPE.DEFAULT>,
  message: string
) => {
  const icon = defineAsyncComponent(
    () => import(`../components/Toastification/${uppercaseFirstChar(type)}.vue`)
  )

  return (useToast()[type] as ToastFunction)(message, {
    ...defaultToastificationConfig,
    icon,
    type,
  })
}
