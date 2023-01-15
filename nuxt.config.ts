// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  modules: ['@pinia/nuxt', '@vueuse/nuxt'],

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
    },
  },

  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
})
