/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans:    ['"Inter"', 'sans-serif'],
        inter:   ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 40px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float':     'float 5s ease-in-out infinite',
        'slide-up':  'slideUp 0.5s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'pulse-glow':'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float:    { '0%,100%':{ transform:'translateY(0)'     }, '50%':{ transform:'translateY(-18px)'     } },
        slideUp:  { from:{ transform:'translateY(24px)',opacity:'0' }, to:{ transform:'translateY(0)',opacity:'1' } },
        fadeIn:   { from:{ opacity:'0' }, to:{ opacity:'1' } },
        pulseGlow:{ '0%,100%':{ boxShadow:'0 0 0 0 rgba(34,197,94,0.4)' }, '50%':{ boxShadow:'0 0 0 14px rgba(34,197,94,0)' } },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #064e3b 100%)',
      },
    },
  },
  plugins: [],
}