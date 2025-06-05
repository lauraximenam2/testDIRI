import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
  theme: {
    extend: {
      colors: {
        'primary': '#4CAF50',
        'primary-dark': '#388E3C',
        'secondary': '#DCE775',
        'secondary-dark': '#c0ca33',
        'accent': '#03A9F4',
        'accent-dark': '#0288D1',
        'brand-background': '#F8F9FA',
        'brand-white': '#FFFFFF',
        'brand-black': '#000000',
        'text-primary': '#212529',
        'text-secondary': '#6C757D',
        'border-color': '#DEE2E6',
        'error': '#DC3545',
        'success': '#28a745',
        'warning': '#ffc107',
        'disabled-bg': '#e9ecef',
        'disabled-text': '#adb5bd',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
  ],
};

export default config;