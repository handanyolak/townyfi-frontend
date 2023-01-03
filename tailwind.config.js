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
        brown: {
          light: '#635542',
          DEFAULT: '#745a3d',
          dark: '#2a1d0e',
        },
        'towni-brown': {
          100: '#e6c3a2',
          200: '#c57b34',
          300: '#b44e00',
        },
      },
      zIndex: {
        max: '99999',
      },
      skew: {
        65: '65deg',
      },
    },
  },
  plugins: [],
}
