import { convertToInteger, convertToArray } from './utils'

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

  modules: ['@pinia/nuxt', '@vueuse/nuxt', 'nuxt-icon'],

  plugins: [
    '@/plugins/vue-toastification',
    '@/plugins/vue3-lottie',
    '@/plugins/vue-guided-tour',
  ],

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
      multiCallAddress: process.env.NUXT_MULTICALL_ADDRESS,
      networkName: process.env.NUXT_NETWORK_NAME,
      networkSymbol: process.env.NUXT_NETWORK_SYMBOL,
      chainRpcs: convertToArray(process.env.NUXT_CHAIN_RPCS),
      chainExplorers: convertToArray(process.env.NUXT_CHAIN_EXPLORERS),
      chainId: convertToInteger(process.env.NUXT_CHAIN_ID, 11155111),
      chainBlockTime: convertToInteger(process.env.NUXT_CHAIN_BLOCK_TIME, 10),
      minNearLevel: convertToInteger(process.env.NUXT_MIN_NEAR_LEVEL, 2),
      maxNearLevel: convertToInteger(process.env.NUXT_MAX_NEAR_LEVEL, 5),
    },
  },

  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
})
