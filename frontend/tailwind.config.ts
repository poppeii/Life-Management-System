import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#f5f3ff', 100: '#ede9fe', 500: '#7c3aed', 600: '#6d28d9', 700: '#5b21b6' },
        skysoft: '#eef7ff',
        ink: '#172033'
      },
      boxShadow: { soft: '0 16px 50px rgba(49, 46, 129, 0.08)' }
    }
  },
  plugins: []
};

export default config;
