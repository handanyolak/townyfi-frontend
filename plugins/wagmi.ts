import { WagmiPlugin } from '@wagmi/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const userWalletStore = useUserWalletStore()

  nuxtApp.vueApp.use(WagmiPlugin, {
    config: userWalletStore.wagmiAdapter.wagmiConfig,
  })
})
