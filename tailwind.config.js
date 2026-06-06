/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        void: '#05020a',
        ink: '#0b0614',
        neon: {
          blue: '#1bb6ff',
          cyan: '#27fff2',
          purple: '#a855f7',
          pink: '#ff37d6'
        }
      },
      boxShadow: {
        neon: '0 0 28px rgba(39, 255, 242, 0.32)',
        purple: '0 0 34px rgba(168, 85, 247, 0.32)'
      }
    }
  },
  plugins: []
};
