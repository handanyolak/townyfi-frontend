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
      bingoContractAddress:
        process.env.NUXT_BINGO_CONTRACT_ADDRESS || zeroAddress,
      chain: process.env.NUXT_CHAIN,
      chainBlockTime: convertToInteger(process.env.NUXT_CHAIN_BLOCK_TIME, 5),
      publicRpcUrls: process.env.NUXT_PUBLIC_RPC_URLS?.split(',') || [],
      defenderRelayerWebhookUrl:
        process.env.NUXT_DEFENDER_RELAYER_WEBHOOK_URL || '',
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
        sourceMap: true,
      },
    },
  },

  devtools: {
    timeline: {
      enabled: true,
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
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
})
