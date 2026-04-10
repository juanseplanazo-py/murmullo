/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FFFBF5',
          100: '#FFF8ED',
          200: '#F5EDE4',
          300: '#E8D5C4',
          400: '#D4A9A9',
          500: '#C49B8A',
          600: '#8B7E74',
          700: '#6B5E54',
          800: '#4A3F37',
          900: '#2D2A26',
        },
        rose: {
          100: '#FDE8E8',
          200: '#F5C6C6',
          300: '#D4A9A9',
          400: '#C48B8B',
          500: '#B07070',
        },
        lavender: {
          100: '#F0EBF5',
          200: '#E0D5EB',
          300: '#C4B1D4',
          400: '#A78BBF',
          500: '#8A6AAA',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
