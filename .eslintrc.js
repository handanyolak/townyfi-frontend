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
    'vue/no-undef-components': [
      'error',
      {
        ignorePatterns: [
          'Icon',
          'VeeForm',
          'VeeField',
          'VeeErrorMessage',
          'ClientOnly',
        ],
      },
    ],
    'vue/multi-word-component-names': 0,
    'no-console': 'off',
    'no-useless-constructor': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [],
}
