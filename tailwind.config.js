/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        risk: '#DC2626',
        opportunity: '#2563EB',
        caution: '#D97706',
        success: '#059669',
        accent: '#2DD4BF',
      },
    },
  },
  plugins: [],
}
