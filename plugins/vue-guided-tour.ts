import VueGuidedTour from 'vue-guided-tour'
import 'vue-guided-tour/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGuidedTour as any)
})
