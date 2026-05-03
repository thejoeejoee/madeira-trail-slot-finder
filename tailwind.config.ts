import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        skin: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          border: 'var(--color-border)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          green: 'var(--color-green)',
          yellow: 'var(--color-yellow)',
          orange: 'var(--color-orange)',
          red: 'var(--color-red)',
          full: 'var(--color-full)',
          accent: 'var(--color-accent)',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
    },
  },
} satisfies Config
