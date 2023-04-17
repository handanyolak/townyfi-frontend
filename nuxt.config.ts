import { convertToInteger } from './utils'

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: false,

  vite: {
    build: {
      assetsInlineLimit: 0,
      target: 'ESNext',
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'ESNext',
      },
    },
  },

  modules: ['@pinia/nuxt', '@vueuse/nuxt'],

  plugins: ['@/plugins/vue-toastification'],

  css: ['~/assets/css/main.css'],

  components: true,

  imports: {
    autoImport: true,
    dirs: ['stores', 'composables'],
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      ktaAddress: process.env.NUXT_KTA_ADDRESS,
      ktaTokenAddress: process.env.NUXT_KTA_TOKEN_ADDRESS,
      ktaChainId: convertToInteger(process.env.NUXT_KTA_CHAIN_ID, 1337),
      minNearLevel: convertToInteger(process.env.NUXT_MIN_NEAR_LEVEL, 2),
      maxNearLevel: convertToInteger(process.env.NUXT_MAX_NEAR_LEVEL, 5),
    },
  },

  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
})
