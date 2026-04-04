import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ado: {
          bg: '#1b1b1f',
          surface: '#252529',
          surface2: '#2d2d31',
          border: '#3e3e42',
          accent: '#0078d4',
          accentHover: '#106ebe',
          accentLight: '#1a8fe0',
          text: '#d4d4d8',
          muted: '#8c8c93',
          bug: '#e81123',
          task: '#0078d4',
          story: '#107c10',
          epic: '#5c2d91',
          feature: '#009ac7',
          issue: '#e6a817',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Cascadia Code', 'Consolas', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'dot-bounce': 'dotBounce 1.4s infinite ease-in-out both',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
