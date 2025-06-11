import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    p: 'p',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock the chatbot store functions that might not be available in test environment
vi.mock('../store/chatbot-store', async () => {
  const actual = await vi.importActual('../store/chatbot-store');
  return {
    ...actual,
    useChatbotStore: () => ({
      widgetState: 'collapsed',
      setWidgetState: vi.fn(),
      currentStep: 'welcome',
      setCurrentStep: vi.fn(),
      addMessage: vi.fn(),
      resetChat: vi.fn(),
      auth: {
        isAuthenticated: false,
        authenticationStep: 'login'
      },
      initializeAuth: vi.fn().mockResolvedValue(undefined),
      authenticateUser: vi.fn().mockResolvedValue(undefined),
      errors: [],
      warnings: [],
      unratedOrders: [],
      showRatingInterface: false,
      setUnratedOrders: vi.fn(),
      setShowRatingInterface: vi.fn(),
      addError: vi.fn(),
      removeError: vi.fn(),
      addWarning: vi.fn(),
      removeWarning: vi.fn(),
      submitRating: vi.fn(),
      skipRating: vi.fn(),
      user: null
    })
  };
});

// Setup environment variables for testing
process.env.NEXT_PUBLIC_USE_MOCK_API = 'true';
process.env.NEXT_PUBLIC_DEV_MODE = 'true';
// NODE_ENV is automatically set to 'test' by the test runner
