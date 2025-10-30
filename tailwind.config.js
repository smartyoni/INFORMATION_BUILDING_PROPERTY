/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        maple: {
          bg: '#2a2520',
          light: '#C9B896',
          frame: '#8B6F47',
          border: '#A0826D',
          gold: '#D4AF37',
          purple: '#8B5FB5',
          tab: '#B8956A',
          slot: '#C5B4E3',
        }
      },
      fontSize: {
        'maple-title': '20px',
        'maple-body': '14px',
        'maple-label': '12px',
      },
      fontFamily: {
        maple: ['Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
