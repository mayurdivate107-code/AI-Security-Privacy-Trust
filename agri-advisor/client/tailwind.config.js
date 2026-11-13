/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        agri: {
          primary: '#166534',
          'primary-hover': '#14532d',
          secondary: '#22C55E',
          accent: '#84CC16',
          bg: '#F8FAF7',
          surface: '#FFFFFF',
          text: '#172B1C',
          muted: '#64748B',
          warning: '#F59E0B',
          danger: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
