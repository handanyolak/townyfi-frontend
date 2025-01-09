import { createResolver } from '@nuxt/kit'
import vueDevTools from 'vite-plugin-vue-devtools'
import { convertToInteger } from './utils'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: {
    enabled: false,
  },

  experimental: {
    localLayerAliases: true,
  },

  ssr: false,

  vite: {
    plugins: [vueDevTools()],
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
      },
    },
    build: {
      assetsInlineLimit: 0,
      target: 'esnext',
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
    },
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  modules: [
    '@nuxt/devtools',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/icon',
    '@wagmi/vue/nuxt',
  ],

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
      appUrl: process.env.NUXT_APP_URL || 'http://localhost:3000',
      appBaseUrl: process.env.NUXT_APP_BASE_URL || '/',
      appEnv: process.env.NUXT_APP_ENV || 'development',
      bingoContractAddress: process.env.NUXT_BINGO_CONTRACT_ADDRESS || '',
      chain: process.env.NUXT_CHAIN || '',
      drawnNumbersIntervalInSec: convertToInteger(
        process.env.NUXT_DRAWN_NUMBERS_INTERVAL_IN_SEC,
        3,
      ),
      drawnNumbersAdditionalTimeInSec: convertToInteger(
        process.env.NUXT_DRAWN_NUMBERS_ADDITIONAL_TIME_IN_SEC,
        15,
      ),
      chainBlockTimeInSec: convertToInteger(
        process.env.NUXT_CHAIN_BLOCK_TIME_IN_SEC,
        5,
      ),
      rpcUrls: (process.env.NUXT_RPC_URLS || '').split(','),
      rpcUrlsPublic: (process.env.NUXT_RPC_URLS_PUBLIC || '').split(','),
      ozDefenderRelayerWebhookUrl:
        process.env.NUXT_OZ_DEFENDER_RELAYER_WEBHOOK_URL || '',
      ozDefenderRelayerMessage:
        process.env.NUXT_OZ_DEFENDER_RELAYER_MESSAGE || '',
      chainExtendExplorerUrls:
        process.env.NUXT_CHAIN_EXTEND_EXPLORER_URLS?.split(',') || [],
      reownAppkitProjectId: process.env.NUXT_REOWN_APPKIT_PROJECT_ID || '',
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

  typescript: {
    tsConfig: {
      compilerOptions: {
        sourceMap: process.env.NUXT_APP_ENV === 'development',
      },
    },
  },

  devtools: {
    timeline: {
      enabled: process.env.NUXT_APP_ENV === 'development',
    },
  },

  app: {
    head: {
      title: 'Bingo',
      meta: [
        {
          name: 'description',
          content: 'Bingo is a decentralized lottery game on Ethereum',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: `${process.env.NUXT_APP_BASE_URL || '/'}favicon.svg`,
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Almendra:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet',
        },
      ],
    },
  },

  compatibilityDate: '2024-12-31',
})
