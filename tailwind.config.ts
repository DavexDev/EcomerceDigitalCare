import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        // Custom animations for CoreSpinLoader
        'spin-10s': 'spin 10s linear infinite',
        'spin-2s': 'spin 2s linear infinite',
        'spin-3s': 'spin 3s linear infinite',
        'spin-3s-reverse': 'spin 3s linear infinite reverse',
        'spin-1s': 'spin 1s ease-in-out infinite',
        'spin-4s': 'spin 4s linear infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config
