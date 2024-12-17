import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
  })

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  })
})
