/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sei primary colors
        'sei-red': '#F43F5E',
        'sei-light-red': '#FB7185',
        'sei-dark-red': '#E11D48',
        // Sei blues based on branding
        'sei-blue': '#323AC0',
        'sei-light-blue': '#85C0E9',
        'sei-mid-blue': '#567AD5',
        'sei-purple': '#6E3FB7',
        // UI colors
        'sei-white': '#ffffff',
        'sei-offwhite': '#1e293b',
        'sei-light-gray': '#334155',
        'sei-gray': '#64748b',
        'sei-dark-gray': '#e2e8f0',
        'sei-dark-blue': '#0f172a',
        'sei-dark-purple': '#2e1065',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'sei-gradient': 'linear-gradient(135deg, var(--sei-light-red) 0%, var(--sei-red) 100%)',
        'sei-blue-gradient': 'linear-gradient(135deg, var(--sei-light-blue) 0%, var(--sei-blue) 100%)',
        'sei-purple-gradient': 'linear-gradient(135deg, var(--sei-mid-blue) 0%, var(--sei-purple) 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 2s forwards',
        'ripple': 'ripple 0.8s ease-out 1',
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
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: 0.5 },
          '100%': { transform: 'scale(2.5)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}