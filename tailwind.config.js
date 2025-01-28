/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 2s ease-in-out',
        'fade-out': 'fade-out 1s ease-in-out',
      },
      colors: {
        cardLight: '#ffffff', // Цвет для светлой темы
        cardDark: '#1f2937', // Цвет для тёмной темы (чуть светлее фона приложения)
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};