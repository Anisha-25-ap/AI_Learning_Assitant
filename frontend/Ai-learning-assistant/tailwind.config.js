/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF9324', // Moved from your CSS @theme
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'], // Sets Urbanist as your primary font
      },
      screens: {
        '3xl': '1920px', // Moved from your CSS @theme
      },
    },
  },
  plugins: [],
}