module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  plugins: [],
  rules: {
    'vue/no-undef-components': 'error',
    'vue/multi-word-component-names': 0,
    'no-console': 'off',
    'no-useless-constructor': 'off',
  },
  overrides: [],
}
