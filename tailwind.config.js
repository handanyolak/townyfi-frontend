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
    './app.vue',
  ],
  safelist: [
    {
      pattern: /grid-cols-\d+/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    {
      pattern: /gap-[xy]-\d+/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        'towny-brown-light': {
          100: '#f7f2ec',
          200: '#ffe8d0',
          300: '#E8D5B2',
          400: '#e6c3a2',
          500: '#d6b16b',
          600: '#FFD479',
        },
        'towny-brown-dark': {
          100: '#C69666',
          200: '#c68c52',
          300: '#c57b34',
          400: '#96501b',
          500: '#b44e00',
          600: '#3f2007',
        },
        'night-blue': '#0a0a16',
      },
      height: {
        '5v': '5vh',
        '10v': '10vh',
        '20v': '20vh',
        '30v': '30vh',
        '40v': '40vh',
        '50v': '50vh',
        '60v': '60vh',
        '70v': '70vh',
        '80v': '80vh',
        '90v': '90vh',
        '100v': '100vh',
      },
      backgroundSize: {
        /*         auto: 'auto',
        cover: 'cover',
        contain: 'contain', */
        '20%': '20%',
        '30%': '30%',
        '45%': '45%',
        '50%': '50%',
        '60%': '60%',
        '70%': '70%',
      },
      backgroundImage: {
        map: "url('@/assets/img/map3.jpeg')",
        knight: "url('@/assets/img/cavalry.svg')",
      },
      keyframes: {
        fadein: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadein: 'fadein 3s 1',
      },
      boxShadow: {
        'towny-200': '0px 0px 15px 0px rgba(198, 140, 82, 0.8)',
        'towny-300': '0px 3px 8px -6px #b44e00',
        'towny-400': '0px 1px 0px 1px rgba(255, 205, 116, 0.4)',
      },
      zIndex: {
        '60': 60,
        '70': 70,
        '80': 80,
        '90': 90,
        '100': 100,
        '110': 110,
        '120': 120,
        '130': 130,
        '140': 140,
        '150': 150,
        '1000': 1000,
        '10000': 10000,
        '100000': 100000,
      },
      skew: {
        65: '65deg',
      },
    },
    borderWidth: {
      DEFAULT: '1px',
      12: '12px',
      18: '18px',
      20: '20px',
      30: '30px',
    },
  },
}
