const config = require("@heybo/tailwind-config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...config.theme,
    extend: {
      ...config.theme?.extend,
      // HeyBo-specific widget customizations
      colors: {
        ...config.theme?.extend?.colors,
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        secondary: {
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
        },
        healthy: 'var(--color-healthy)',
        spicy: 'var(--color-spicy)',
        grain: 'var(--color-grain)',
        premium: 'var(--color-premium)',
      },
      spacing: {
        'ingredient': 'var(--spacing-ingredient)',
        'category': 'var(--spacing-category)',
        'section': 'var(--spacing-section)',
        'touch-target': 'var(--spacing-touch-target)',
      },
      animation: {
        'bounce-delayed-1': 'bounce 1s infinite 0.1s',
        'bounce-delayed-2': 'bounce 1s infinite 0.2s',
      },
    },
  },
};
