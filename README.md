# HeyBo Chatbot - 1CloudHub

AI-powered conversational ordering system for HeyBo warm grain bowls.

## 🏗️ Project Structure

```
heybo-chatbot/
├── apps/
│   ├── chatbot-widget/          # Main chatbot application
│   └── design-system-docs/      # Storybook for design system
├── packages/
│   ├── ui/                      # Shared UI components
│   ├── design-tokens/           # Design tokens package
│   ├── types/                   # Shared TypeScript types
│   └── api/                     # tRPC API definitions
├── tooling/
│   ├── eslint-config/
│   ├── typescript-config/
│   └── tailwind-config/
└── docs/                        # Project documentation
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
```

## 📱 Applications

- **chatbot-widget**: Main HeyBo chatbot interface
- **design-system-docs**: Component documentation and design system

## 📦 Packages

- **@heybo/ui**: Shared UI components with HeyBo design system
- **@heybo/design-tokens**: Design tokens and theme configuration
- **@heybo/types**: Shared TypeScript types for food ordering
- **@heybo/api**: tRPC API layer for type-safe communication

## 🛠️ Technology Stack

- **Framework**: Next.js 15 + React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Type Safety**: TypeScript 5.6 + tRPC + Zod
- **State Management**: Zustand
- **Testing**: Vitest + Playwright
- **Package Manager**: pnpm + Turborepo

## 📚 Documentation

See the `docs/` folder for detailed project documentation.

---

Built with ❤️ by 1CloudHub
