/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#0c0e14',
          1: '#111318',
          2: '#161820',
          3: '#1d2029',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          hover: 'rgba(255,255,255,0.12)',
        },
        brand: {
          blue: '#4f8ef7',
          indigo: '#7c6af7',
          purple: '#a855f7',
        }
      },
      boxShadow: {
        'glass': '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)',
        'glow-blue': '0 0 30px rgba(79,142,247,0.2)',
        'glow-emerald': '0 0 30px rgba(16,185,129,0.2)',
        'glow-rose': '0 0 30px rgba(244,63,94,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
}
