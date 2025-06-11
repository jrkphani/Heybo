// HeyBo Design Tokens
export const colors = {
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main brand color
    600: '#EA580C', // Primary buttons
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  secondary: {
    50: '#FEFCE8',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Accent color
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
} as const

export const spacing = {
  1: '0.25rem', // 4px
  2: '0.5rem',  // 8px
  3: '0.75rem', // 12px
  4: '1rem',    // 16px
  5: '1.25rem', // 20px
  6: '1.5rem',  // 24px
  8: '2rem',    // 32px
  10: '2.5rem', // 40px
  12: '3rem',   // 48px
  16: '4rem',   // 64px
} as const

export const widgetDimensions = {
  sm: {
    width: '100vw',
    height: '100vh',
    margin: '0px',
    radius: '0px',
  },
  md: {
    width: '420px',
    height: '600px',
    margin: '24px',
    radius: '16px',
  },
  lg: {
    width: '480px',
    height: '640px',
    margin: '32px',
    radius: '20px',
  },
  xl: {
    width: '720px',
    height: '800px',
    margin: '40px',
    radius: '24px',
  },
  dualPane: {
    lg: {
      width: '75vw',
      height: '80vh',
      maxWidth: '1200px',
      maxHeight: '800px',
    },
    xl: {
      width: '60vw',
      height: '75vh',
      maxWidth: '1400px',
      maxHeight: '900px',
    },
  },
} as const

export const breakpoints = {
  sm: 640,   // SM: ≤640px - Mobile devices
  md: 1024,  // MD: 641-1024px - Tablets & small laptops
  lg: 1440,  // LG: 1025-1440px - Desktop monitors
  xl: 1441,  // XL: ≥1441px - Large desktop monitors
} as const
