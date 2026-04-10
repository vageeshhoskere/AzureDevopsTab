import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ado: {
          bg: '#F5F3FF',
          surface: '#FFFFFF',
          surface2: '#EBEFF9',
          border: '#E0E7FF',
          accent: '#6366F1',
          accentHover: '#4F46E5',
          accentLight: '#818CF8',
          text: '#1E1B4B',
          muted: '#64748B',
          bug: '#DC2626',
          task: '#2563EB',
          story: '#059669',
          epic: '#7C3AED',
          feature: '#0891B2',
          issue: '#D97706',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Cascadia Code"', 'Consolas', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.25s ease-out',
        'dot-bounce': 'dotBounce 1.4s infinite ease-in-out both',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
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
