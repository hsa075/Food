import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        uttara: {
          terracotta: {
            DEFAULT: '#9E472A',
            dark: '#853A21',
            light: '#C46345',
            faint: '#FDF6F3',
          },
          ochre: {
            DEFAULT: '#D9822B',
            dark: '#B8691D',
            light: '#F4BA78',
            faint: '#FDF7EE',
          },
          ivory: {
            DEFAULT: '#FAF7F2',
            light: '#FFFFFF',
          },
          cream: {
            DEFAULT: '#F4EFEA',
            hover: '#EDE6DF',
            border: '#E7DFD5',
          },
          charcoal: {
            DEFAULT: '#1C1917',
            muted: '#57534E',
            faint: '#A8A29E',
          },
          green: {
            DEFAULT: '#4A6B53',
            light: '#6E9479',
            faint: '#EEF4EF',
          },
          indigo: {
            DEFAULT: '#3D4A5A',
            light: '#5A6A7D',
            faint: '#EEF2F6',
          }
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        serif: ['var(--font-display)', 'serif'],
        kannada: ['var(--font-kannada)', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(28, 25, 23, 0.05)',
        'card': '0 4px 20px -4px rgba(28, 25, 23, 0.07)',
        'lifted': '0 12px 32px -6px rgba(158, 71, 42, 0.12)',
      },
      borderRadius: {
        'brand': '12px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
};

export default config;
