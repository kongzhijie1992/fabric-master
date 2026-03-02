import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f8f7',
          100: '#d8ebe7',
          200: '#b3d8d1',
          300: '#80bcb2',
          400: '#4f9f94',
          500: '#2f847a',
          600: '#226c65',
          700: '#1d5651',
          800: '#1a4542',
          900: '#183b39'
        }
      },
      boxShadow: {
        soft: '0 18px 42px rgba(16, 24, 40, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
