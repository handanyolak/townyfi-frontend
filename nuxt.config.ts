import { createResolver } from '@nuxt/kit'
import { zeroAddress } from 'viem'
import { convertToInteger } from './utils'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    localLayerAliases: true,
  },

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

  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@vee-validate/nuxt', 'nuxt-icon'],

  css: ['~/assets/css/main.css'],

  components: {
    dirs: [],
  },

  imports: {
    autoImport: true,
    dirs: [resolve('./stores'), '~/stores'],
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      ktaTokenAddress: process.env.NUXT_KTA_TOKEN_ADDRESS || zeroAddress,
      ktaGamePassNftAddress:
        process.env.NUXT_KTA_GAME_PASS_NFT_ADDRESS || zeroAddress,
      ktaAddress: process.env.NUXT_KTA_ADDRESS || zeroAddress,
      ktaGameChatAddress: process.env.NUXT_KTA_GAME_CHAT_ADDRESS || zeroAddress,
      chain: process.env.NUXT_CHAIN,
      chainBlockTime: convertToInteger(process.env.NUXT_CHAIN_BLOCK_TIME, 5),
      minNearLevel: convertToInteger(process.env.NUXT_MIN_NEAR_LEVEL, 2),
      maxNearLevel: convertToInteger(process.env.NUXT_MAX_NEAR_LEVEL, 5),
    },
  },

  pinia: {
    storesDirs: ['~/stores/**', '#/stores/**', '@/stores/**'],
  },

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      ErrorMessage: 'VeeErrorMessage',
    },
    typedSchemaPackage: 'yup',
  },

  devtools: {
    timeline: {
      enabled: true,
    },
  },
})
