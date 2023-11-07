/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        bottom: '0 4px 8px -2px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        candal: ['Candal', 'sans-serif'],
      },
      borderColor: {
        transparent: 'transparent',
        'light-gray': '#BDC0BF',
        'dark-gray': '#181818',
        blue: '#00396F',
        red: '#9F4848',
        'primary-blue': '#394c9a',
        gray: '#242424',
        green: '#52A045',
        yellow: '#A4A701' // Reemplaza esto con tu color hexadecimal
      },
      colors: {
        transparent: 'transparent',
        'dark-tertiary': '#BDC0BF', // Dark mode: Formerly light-gray
        'dark-secondary': '#242424', // Dark mode: Formerly gray
        'dark-primary': '#181818', // Dark mode: Formerly dark-gray
        'light-tertiary': '#EFEFEF', // Light mode: New color
        'light-secondary': '#EFEFEF', // Light mode: New color
        'light-primary': '#e3e3e3', // Light mode: New color
        primary: '#394c9a', // Any mode: Formerly primary-orange
        green: '#52A045',
        yellow: '#A4A701',
        red: '#9F4848',
        brown: '#5A3A3A'
      },
      text: {
        orange: '#f39200',
      },
      variants: {
        scrollbar: ['rounded', 'hover'],
      },
      zIndex: {
        100: '100',
      },
    },
  },
  variants: {
    scrollbar: ['rounded', 'hover'], // Habilitar estilos para scrollbar en estado hover
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    // ...
  ],
}
