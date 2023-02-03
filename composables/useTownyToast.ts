import { useToast } from 'vue-toastification'
import { uppercaseFirstChar } from '~/utils'
import { ToastType } from '~/types'
import { defaultToastificationConfig } from '~/config'

export const useTownyToast = (type: ToastType, message: string) => {
  const icon = defineAsyncComponent(
    () => import(`../components/Toastification/${uppercaseFirstChar(type)}.vue`)
  )

  useToast()[type](message, {
    icon,
    type,
    ...defaultToastificationConfig,
  })
}
