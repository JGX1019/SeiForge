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
        // Sei primary colors
        'sei-red': '#E11D48',
        'sei-light-red': '#F43F5E',
        'sei-dark-red': '#BE123C',
        // Sei blues based on branding
        'sei-blue': '#272090',
        'sei-light-blue': '#71B0DB',
        'sei-mid-blue': '#445FB5',
        'sei-purple': '#452797',
        // UI colors
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
        'sei-blue-gradient': 'linear-gradient(135deg, var(--sei-light-blue) 0%, var(--sei-blue) 100%)',
        'sei-purple-gradient': 'linear-gradient(135deg, var(--sei-mid-blue) 0%, var(--sei-purple) 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 2s forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(244, 63, 94, 0.7)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 10px rgba(244, 63, 94, 0.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shine': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
} 