import { WagmiPlugin } from '@wagmi/vue'
import { wagmiAdapter } from '~/config'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig })
})
