/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-mantine-color-scheme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f6f5fd',
          '100': '#f0ecfb',
          '200': '#e2dbf9',
          '300': '#ccbff3',
          '400': '#b39aeb',
          '500': '#9871e1',
          '600': '#8852d5',
          '700': '#7f4ac4',
          '800': '#6535a2',
          '900': '#542d85',
          '950': '#341c59'
        }
      }
    },
  },
  plugins: [],
}