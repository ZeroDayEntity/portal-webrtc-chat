/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'electric-purple': {
          '500': '#8a2be2',
          '600': '#7b24cb',
        }
      },
      backdropBlur: {
        xl: '20px',
      },
    },
  },
  plugins: [],
}
