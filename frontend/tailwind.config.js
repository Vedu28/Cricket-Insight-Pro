/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cricket: {
          light: '#4ade80',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
        slate: {
          950: '#090d16',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        accent: {
          gold: '#fbbf24',
          neon: '#a3e635',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
