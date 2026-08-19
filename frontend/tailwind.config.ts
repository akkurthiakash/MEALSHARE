import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fode: {
          bgLight: '#FFFDF9',
          bgDark: '#0B1324',
          yellow: '#FFC107',
          yellowDark: '#FFA000',
          black: '#000000',
          textDark: '#0F172A',
          textMuted: '#475569',
          borderDashed: '#E2D9D0',
        },
        primary: {
          DEFAULT: '#059669',
          dark: '#047857',
          light: '#10B981',
        },
        accent: {
          DEFAULT: '#FF5722',
          light: '#FF7043',
          dark: '#E64A19',
        },
        warning: '#D97706',
        success: '#059669',
        background: '#FFFDF9',
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
