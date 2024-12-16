import { createResolver } from '@nuxt/kit'
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
      appUrl: process.env.NUXT_APP_URL || 'https://emretepedev.github.io',
      bingoContractAddress:
        process.env.NUXT_BINGO_CONTRACT_ADDRESS ||
        '0x3f9b9f6b287e9110143b6fac158d06560816af5f',
      chain: process.env.NUXT_CHAIN || 'sepolia',
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
      publicRpcUrls: (
        process.env.NUXT_PUBLIC_RPC_URLS ||
        'https://sepolia.gateway.tenderly.co,https://eth-sepolia.public.blastapi.io,https://gateway.tenderly.co/public/sepolia,https://ethereum-sepolia.blockpi.network/v1/rpc/private,https://sepolia.drpc.org,https://ethereum-sepolia-rpc.publicnode.com,https://endpoints.omniatech.io/v1/eth/sepolia/public,https://ethereum-sepolia.rpc.subquery.network/public,https://1rpc.io/sepolia,https://api.zan.top/eth-sepolia,https://eth-sepolia.g.alchemy.com/v2/demo,https://eth-sepolia.api.onfinality.io/public,https://eth-testnet.4everland.org/v1/37fa9972c1b1cd5fab542c7bdd4cde2f,https://eth-sepolia-public.unifra.io'
      ).split(','),
      ozDefenderRelayerWebhookUrl:
        process.env.NUXT_OZ_DEFENDER_RELAYER_WEBHOOK_URL ||
        'https://api.defender.openzeppelin.com/actions/4ede244c-65a3-4ab9-9c8a-1eb265782cd4/runs/webhook/333bd302-898d-4ba9-9a60-77e2a0af814a/PL4mQLTJw2AZ61pTSA73Wj',
      ozDefenderRelayerMessage:
        process.env.NUXT_OZ_DEFENDER_RELAYER_MESSAGE || 'Bingo!',
      chainExtendExplorerUrls:
        process.env.NUXT_CHAIN_EXTEND_EXPLORER_URLS?.split(',') || [],
      reownAppkitProjectId:
        process.env.NUXT_REOWN_APPKIT_PROJECT_ID ||
        'f1af70943ebd1ef87a5642ad2b859a82',
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
    baseURL: '/bingo/',
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
  // devServer: {
  //   https: {
  //     key: './localhost.key',
  //     cert: './localhost.crt',
  //   },
  // },
})
