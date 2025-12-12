import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', ...fontFamily.sans]
      },
      colors: {
        brand: {
          DEFAULT: '#0F172A',
          soft: '#1E293B',
          accent: '#38BDF8'
        }
      },
      borderRadius: {
        lg: '12px',
        md: '10px',
        sm: '8px'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
