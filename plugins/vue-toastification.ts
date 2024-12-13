import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    toastClassName: 'toast-theme',
    closeButton: false,
    transition: 'Vue-Toastification__slideBlurred',
    maxToasts: 3,
  })
})
