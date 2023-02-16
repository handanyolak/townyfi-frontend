import { Form, Field, ErrorMessage, configure } from 'vee-validate'
import { defaultVeeValidateConfig } from '~/config/vee-validate'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VForm', Form)
  nuxtApp.vueApp.component('VField', Field)
  nuxtApp.vueApp.component('VErrorMessage', ErrorMessage)

  configure(defaultVeeValidateConfig)
})
