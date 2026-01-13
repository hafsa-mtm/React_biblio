/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          900: '#3E2723',
          700: '#6F4E37',
          600: '#8D6E63',
          500: '#A1887F',
        },
        beige: '#F5EFE6',
        chocolate: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#d4b9b0',
          400: '#a18072',
          500: '#8b5e34',
          600: '#7f5539',
          700: '#634832',
          800: '#3d281e',
          900: '#23190f',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          800: '#92400e',
        }
      },
      keyframes: {
        slideIn: {
          'from': { opacity: '0', transform: 'translateX(100%)' },
          'to': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'slideIn': 'slideIn 0.3s ease-out forwards',
        'scaleIn': 'scaleIn 0.2s ease-out forwards',
      }
    },
  },
};