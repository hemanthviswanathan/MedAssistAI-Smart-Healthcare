/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E', // Teal 700
          light: '#14B8A6', // Teal 500
          dark: '#0D5E56',
        },
        secondary: {
          DEFAULT: '#0EA5E9', // Sky 500
          light: '#38BDF8',
          dark: '#0284C7',
        },
        accent: {
          DEFAULT: '#EF4444', // Red 500
          hover: '#DC2626',
        },
        background: '#F8FAFC', // Slate 50
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
