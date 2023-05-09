import {
  ToastContent,
  ToastID,
  ToastOptions,
} from 'vue-toastification/src/types'

export type ToastFunction = (
  content: ToastContent,
  options?: ToastOptions
) => ToastID
