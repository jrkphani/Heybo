# HeyBo Chatbot Development Environment

AI-powered chatbot for warm grain bowl ordering with SageMaker ML, real-time ingredient availability, and seamless website widget integration.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start mock HeyBo website (port 3001)
pnpm dev:website

# Start chatbot widget (port 3000)
pnpm dev:widget

# Start both applications
pnpm dev:all
```

## 📖 What's Included

### ✅ Mock HeyBo Website (`apps/mock-heybo-website`)
- **Next.js 15 + React 19** with latest features
- **Tailwind CSS v4.1** with HeyBo design system
- **Realistic HeyBo branding** and layout
- **Mobile-first responsive design**
- **Widget integration ready**

### 🤖 Chatbot Widget (`apps/chatbot-widget`)
- **shadcn-chatbot-kit** components ready for installation
- **Embeddable widget architecture**
- **HeyBo design system integration**
- **Real-time chat capabilities**

## 🏗️ Architecture

- **Frontend**: Next.js 15 + React 19 + TypeScript 5.6+
- **UI Framework**: shadcn/ui + shadcn-chatbot-kit + Tailwind CSS v4.1
- **State**: Zustand + tRPC + Zod validation
- **ML**: Amazon SageMaker (3sec timeout), Bedrock FAQ
- **Data**: PostgreSQL (vendor read-only), GenAI DB (sessions/cart)

## 📁 Project Structure

```text
apps/
├── mock-heybo-website/      # Mock HeyBo website for testing (port 3001)
├── chatbot-widget/          # Embeddable chatbot widget (port 3000)
└── design-system-docs/      # Storybook documentation (future)

packages/
├── api/                     # tRPC API definitions
├── design-tokens/           # HeyBo design system tokens
└── types/                   # Shared TypeScript types

tooling/
├── eslint-config/           # ESLint configuration
├── tailwind-config/         # Tailwind CSS configuration
└── typescript-config/       # TypeScript configuration
```

## 🛠️ Development

### Prerequisites

- **Node.js 18+**
- **pnpm 8+** (recommended for React 19 compatibility)

### Installation

```bash
# Option 1: Use the setup script
./install.sh

# Option 2: Manual installation
pnpm install
```

### Development Commands

```bash
# Start mock HeyBo website only
pnpm dev:website

# Start chatbot widget only
pnpm dev:widget

# Start both applications in parallel
pnpm dev:all

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check
```

### Setting Up Chatbot Components

```bash
# Run the chatbot setup script
./setup-chatbot.sh

# Or manually install shadcn-chatbot-kit components
cd apps/chatbot-widget
npx shadcn@latest init
npx shadcn@latest add https://shadcn-chatbot-kit.vercel.app/r/chat.json
```

## 🎨 Design System

### HeyBo Brand Colors

```css
--orange-500: #F97316     /* Primary brand */
--orange-600: #EA580C     /* Primary buttons */
--yellow-500: #F59E0B     /* Secondary accent */
--green-500: #22C55E      /* Success/healthy */
--brown-500: #A16B47      /* Bowl representation */
--gray-700: #44403C       /* Body text (warm) */
```

### Widget Integration

- **Namespace**: All styles prefixed with `.heybo-chatbot-`
- **Font**: Inherits from parent website
- **Layout**: Mobile overlay, Desktop corner widget (400px)
- **No CSS conflicts** with parent site

## 🌐 URLs

- **Mock HeyBo Website**: http://localhost:3001
- **Chatbot Widget**: http://localhost:3000
- **Real HeyBo Website**: https://order.heybo.sg (reference only)

## 📚 Documentation

- [Functional Specification](./docs/Heybo%20Chatbot%20Application%20-%20Complete%20Functional%20Specification.md)
- [Design System](./docs/HeyBo%20Design%20System%20&%20Style%20Guide.md)
- [Compliance Checklist](./docs/HeyBo%20Chatbot%20Compliance%20Checklist.md)
- [shadcn-chatbot-kit Docs](https://shadcn-chatbot-kit.vercel.app/docs)

## 🔧 Tech Stack References

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Features](https://react.dev/blog/2024/12/05/react-19)
- [Tailwind CSS v4.1](https://tailwindcss.com/docs/installation)
- [shadcn/ui React 19](https://ui.shadcn.com/docs/react-19)
- [shadcn-chatbot-kit](https://github.com/Blazity/shadcn-chatbot-kit)

## 🚧 Development Notes

- **React 19 Peer Dependency Warnings**: Expected and safe to ignore
- **Mock Website**: For development only, not production
- **Widget Testing**: Use mock website to test integration scenarios
- **No localStorage**: Use session-based storage for artifacts limitation

## 📄 License

Private - HeyBo Internal Use Only
