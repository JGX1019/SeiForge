/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'sei-red': '#e11d48',
        'sei-light-red': '#f43f5e',
        'sei-dark-red': '#be123c',
        'sei-white': '#ffffff',
        'sei-offwhite': '#f8fafc',
        'sei-light-gray': '#e2e8f0',
        'sei-gray': '#94a3b8',
        'sei-dark-gray': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'sei-gradient': 'linear-gradient(135deg, var(--sei-red) 0%, var(--sei-dark-red) 100%)',
      },
    },
  },
  plugins: [],
} 