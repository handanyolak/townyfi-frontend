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
      },
      colors: {
        brown: {
          light: '#635542',
          DEFAULT: '#745a3d',
          dark: '#2a1d0e',
        },
      },
      zIndex: {
        max: '99999',
      },
    },
  },
  plugins: [],
}
