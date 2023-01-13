// const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '6rem',
        },
      },
      colors: {
        'towni-brown-light': {
          100: '#f7f2ec',
          200: '#ffe8d0',
          300: '#E8D5B2',
          400: '#e6c3a2',
          500: '#d6b16b',
        },
        'towni-brown-dark': {
          100: '#C69666',
          200: '#c68c52',
          300: '#c57b34',
          400: '#96501b',
          500: '#b44e00',
          600: '#3f2007',
        },
        'night-blue': '#0a0a16',
      },
      boxShadow: {
        'towni-300': '0px 3px 8px -6px #b44e00',
      },
      zIndex: {
        max: '99999',
      },
      skew: {
        65: '65deg',
      },
    },
  },
  plugins: [
    // plugin(function ({ addComponents, theme }) {
    //   addComponents({
    //     '.example': {
    //       backgroundColor: theme('colors.white'),
    //       borderRadius: theme('borderRadius.lg'),
    //       padding: theme('spacing.6'),
    //       boxShadow: theme('boxShadow.xl'),
    //     },
    //   })
    // }),
  ],
}
