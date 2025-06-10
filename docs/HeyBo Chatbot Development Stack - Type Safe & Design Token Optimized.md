# HeyBo Chatbot Development Stack

## Type Safe & Design Token Optimized

### 🏗️ **Core Foundation Stack**

## ✅ **Fully Compatible Stack Versions - June 2025**

| Component | Version | Status | Compatibility | Documentation |
|-----------|---------|--------|---------------|---------------|
| **Next.js** | 15.2+ | ✅ Stable | Full React 19 + Tailwind v4 support | [Next.js 15 Docs](https://nextjs.org/docs) |
| **React** | 19.x | ✅ Stable | Native Next.js 15 support | [React 19 Docs](https://react.dev/blog/2024/04/25/react-19) |
| **Tailwind CSS** | 4.1.x | ✅ Stable | Zero-config, performance optimized | [Tailwind v4 Docs](https://tailwindcss.com/docs) |
| **shadcn/ui** | Latest | ✅ Stable | Full v4 + React 19 support | [shadcn/ui Docs](https://ui.shadcn.com/docs) |
| **shadcn-chatbot-kit** | Latest | ✅ Compatible | Works with shadcn/ui ecosystem | [Chatbot Kit Docs](https://shadcn-chatbot-kit.vercel.app/docs) |
| **TypeScript** | 5.6+ | ✅ Stable | Enhanced React 19 types | [TypeScript 5.6 Docs](https://www.typescriptlang.org/docs/) |
| **tRPC** | 11.x | ✅ Stable | Type-safe API layer | [tRPC Docs](https://trpc.io/docs) |
| **Zod** | 3.x | ✅ Stable | Runtime validation | [Zod Docs](https://zod.dev/) |
| **Zustand** | 5.x | ✅ Stable | State management | [Zustand Docs](https://zustand.docs.pmnd.rs/) |

### **🔗 Additional Integration Guides**

| Integration | Documentation Link | Notes |
|-------------|-------------------|-------|
| **Next.js 15 + React 19** | [Migration Guide](https://ui.shadcn.com/docs/react-19) | Official shadcn/ui React 19 support |
| **Tailwind v4 Setup** | [Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4) | shadcn/ui + Tailwind v4 integration |
| **Next.js + Tailwind** | [Next.js Styling](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css) | Official Next.js Tailwind guide |
| **Tailwind v4 Upgrade** | [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) | Official Tailwind v3 → v4 migration |
| **React 19 Migration** | [React Codemods](https://react.dev/blog/2024/04/25/react-19#how-to-upgrade) | Automated migration tools |

### **📦 Installation Commands - Verified Working**

```bash
# Create Next.js 15 project with all latest versions
npx create-next-app@latest heybo-chatbot --typescript --tailwind --app

# Upgrade to Tailwind v4 (recommended)
npm install tailwindcss@4 @tailwindcss/postcss

# Install shadcn/ui with v4 support  
npx shadcn@latest init

# Install chatbot components
npx shadcn@latest add https://shadcn-chatbot-kit.vercel.app/r/chat.json

# Install food ordering dependencies
npm install zod @trpc/client @trpc/server zustand class-variance-authority
```

**Why This Combination:**

- **Next.js 15**: Latest App Router, built-in optimizations, perfect for chatbot widgets
- **React 19**: Latest features, better performance for real-time chat
- **TypeScript 5.6+**: Advanced type inference, perfect for food ordering type safety
- **Node 20 LTS**: Stable, long-term support for production deployment

#### **Type Safety Layer**

```json
{
  "validation": "Zod",
  "codeGeneration": "tRPC",
  "apiTypes": "OpenAPI + TypeScript",
  "stateManagement": "Zustand + TypeScript"
}
```

### 🎨 **Design System & Styling**

#### **Design System & Styling - Cutting Edge**

```json
{
  "componentLibrary": "shadcn/ui (with Tailwind v4 + React 19 support)",
  "chatComponents": "shadcn-chatbot-kit (v4 compatible)",
  "styling": "Tailwind CSS v4.1",
  "designTokens": "CSS @theme directive + CVA",
  "animations": "tw-animate-css (replaces tailwindcss-animate)"
}
```

#### **Tailwind v4 Design Token Architecture (New CSS-First Approach)**

```css
/* HeyBo Design Tokens - Tailwind v4 CSS-First Configuration */
@import "tailwindcss";

@theme {
  /* HeyBo Brand Colors - Using modern CSS features */
  --color-primary-50: oklch(96% 0.02 65);    /* Light orange */
  --color-primary-500: oklch(69% 0.15 65);   /* #F97316 Orange */
  --color-primary-600: oklch(63% 0.15 65);   /* #EA580C Dark orange */
  
  --color-secondary-500: oklch(78% 0.15 85);  /* #F59E0B Yellow */
  
  /* Food Service Semantic Colors */
  --color-healthy: oklch(65% 0.15 145);       /* Fresh green */
  --color-spicy: oklch(60% 0.20 25);          /* Spice indicator */
  --color-grain: oklch(45% 0.08 65);          /* Bowl brown */
  
  /* Spacing Scale for Food Interface */
  --spacing-ingredient: 0.5rem;    /* 8px - between ingredients */
  --spacing-category: 1.5rem;      /* 24px - between categories */
  --spacing-section: 2rem;         /* 32px - major sections */
  --spacing-touch-target: 2.75rem; /* 44px - minimum touch */
  
  /* Typography - Food Service Optimized */
  --font-family-sans: "Inter", system-ui, sans-serif;
  --font-family-mono: "JetBrains Mono", ui-monospace, monospace;
}

/* Custom HeyBo utilities */
@layer utilities {
  .ingredient-spacing { gap: theme(spacing.ingredient); }
  .category-spacing { gap: theme(spacing.category); }
  .touch-friendly { min-height: theme(spacing.touch-target); }
}
```

#### **Component Variants (CVA)**

```typescript
import { cva, type VariantProps } from "class-variance-authority";

// Type-safe ingredient card variants
export const ingredientCardVariants = cva(
  "rounded-lg border-2 transition-all cursor-pointer",
  {
    variants: {
      state: {
        default: "border-gray-200 bg-white hover:border-primary-300",
        selected: "border-primary-500 bg-primary-50",
        unavailable: "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed",
      },
      size: {
        sm: "p-2 min-h-[60px]",
        md: "p-3 min-h-[80px]",
        lg: "p-4 min-h-[100px]",
      },
      category: {
        protein: "border-l-4 border-l-orange-500",
        greens: "border-l-4 border-l-green-500",
        toppings: "border-l-4 border-l-yellow-500",
        sauce: "border-l-4 border-l-blue-500",
      }
    },
    defaultVariants: {
      state: "default",
      size: "md",
    }
  }
);

export type IngredientCardProps = VariantProps<typeof ingredientCardVariants>;
```

### 🔧 **Type Safety for Food Ordering**

#### **Food Domain Types**

```typescript
// Comprehensive food ordering types
export interface HeyBoIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  subcategory: IngredientSubcategory;
  isAvailable: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: Allergen[];
  nutritionalInfo: NutritionalInfo;
  weight: number; // in grams
  price: number; // in cents
}

export type IngredientCategory = 
  | "base" 
  | "protein" 
  | "greens" 
  | "toppings" 
  | "sauce" 
  | "garnish";

export interface BowlComposition {
  base: HeyBoIngredient; // Required for HeyBo
  protein?: HeyBoIngredient; // Optional for HeyBo
  extraProtein: HeyBoIngredient[];
  sides: HeyBoIngredient[]; // Max 3
  extraSides: HeyBoIngredient[];
  sauce?: HeyBoIngredient; // Max 1
  garnish?: HeyBoIngredient; // Max 1
  totalWeight: number;
  totalPrice: number;
}

// Validation schemas
export const bowlCompositionSchema = z.object({
  base: ingredientSchema,
  protein: ingredientSchema.optional(),
  extraProtein: z.array(ingredientSchema),
  sides: z.array(ingredientSchema).max(3),
  extraSides: z.array(ingredientSchema),
  sauce: ingredientSchema.optional(),
  garnish: ingredientSchema.optional(),
}).refine((bowl) => {
  const totalWeight = calculateBowlWeight(bowl);
  return totalWeight <= 900; // 900g max
}, { message: "Bowl exceeds maximum weight of 900g" });
```

#### **API Layer with tRPC**

```typescript
// Type-safe API procedures
export const chatbotRouter = router({
  getIngredients: publicProcedure
    .input(z.object({
      locationId: z.string(),
      categoryFilter: z.array(z.enum(ingredientCategories)).optional(),
    }))
    .output(z.array(ingredientSchema))
    .query(async ({ input }) => {
      // Type-safe ingredient fetching
    }),
  
  buildBowl: publicProcedure
    .input(bowlCompositionSchema)
    .output(z.object({
      bowl: bowlCompositionSchema,
      warnings: z.array(z.string()),
      totalPrice: z.number(),
    }))
    .mutation(async ({ input }) => {
      // Type-safe bowl building
    }),
  
  mlRecommendations: publicProcedure
    .input(z.object({
      userId: z.string().optional(),
      dietaryFilters: z.array(z.enum(dietaryFilters)),
      allergenFilters: z.array(z.enum(allergens)),
      locationId: z.string(),
    }))
    .output(z.array(bowlCompositionSchema))
    .query(async ({ input }) => {
      // Type-safe ML recommendations
    }),
});

export type ChatbotRouter = typeof chatbotRouter;
```

### 🔄 **State Management**

#### **Zustand with TypeScript**

```typescript
interface ChatbotState {
  // User session
  user: User | null;
  sessionType: 'registered' | 'guest' | 'unauthenticated';
  
  // Order state
  currentStep: OrderStep;
  selectedLocation: Location | null;
  orderTime: Date | null;
  currentBowl: BowlComposition | null;
  cart: CartItem[];
  
  // UI state
  isWidgetOpen: boolean;
  isLoading: boolean;
  errors: ErrorState[];
  
  // Actions (type-safe)
  actions: {
    setUser: (user: User | null) => void;
    updateBowl: (ingredient: HeyBoIngredient, action: 'add' | 'remove') => void;
    addToCart: (bowl: BowlComposition) => void;
    clearErrors: () => void;
  };
}

export const useChatbotStore = create<ChatbotState>()((set, get) => ({
  // Initial state
  user: null,
  sessionType: 'unauthenticated',
  currentStep: 'welcome',
  // ... rest of state
  
  actions: {
    updateBowl: (ingredient, action) => set((state) => {
      const currentBowl = state.currentBowl;
      if (!currentBowl) return state;
      
      // Type-safe bowl updates with validation
      const updatedBowl = action === 'add' 
        ? addIngredientToBowl(currentBowl, ingredient)
        : removeIngredientFromBowl(currentBowl, ingredient);
      
      // Validate against business rules
      const validation = bowlCompositionSchema.safeParse(updatedBowl);
      if (!validation.success) {
        return {
          ...state,
          errors: [...state.errors, { type: 'validation', message: validation.error.message }]
        };
      }
      
      return { ...state, currentBowl: updatedBowl };
    }),
  }
}));
```

### 🧪 **Development & Testing**

#### **Testing Stack**

```json
{
  "unitTesting": "Vitest",
  "componentTesting": "@testing-library/react",
  "e2eTesting": "Playwright",
  "typeChecking": "TypeScript strict mode",
  "codeQuality": "ESLint + Prettier + Biome"
}
```

#### **Food Service Specific Tests**

```typescript
// Type-safe test helpers
export const createTestBowl = (overrides?: Partial<BowlComposition>): BowlComposition => ({
  base: createTestIngredient({ category: 'base', name: 'Brown Rice' }),
  protein: createTestIngredient({ category: 'protein', name: 'Grilled Chicken' }),
  sides: [
    createTestIngredient({ category: 'toppings', name: 'Roasted Vegetables' })
  ],
  extraSides: [],
  extraProtein: [],
  totalWeight: 450,
  totalPrice: 1599, // in cents
  ...overrides
});

// Bowl composition validation tests
describe('Bowl Composition Validation', () => {
  test('should enforce maximum weight limit', () => {
    const heavyBowl = createTestBowl({ totalWeight: 950 });
    const result = bowlCompositionSchema.safeParse(heavyBowl);
    expect(result.success).toBe(false);
  });
  
  test('should require base for HeyBo bowls', () => {
    const bowlWithoutBase = { ...createTestBowl() };
    delete bowlWithoutBase.base;
    const result = bowlCompositionSchema.safeParse(bowlWithoutBase);
    expect(result.success).toBe(false);
  });
});
```

### 📦 **Package Management & Build**

#### **Modern Package Management**

```json
{
  "packageManager": "pnpm",
  "monorepoTool": "Turborepo",
  "bundler": "Next.js built-in (Turbopack)",
  "deployment": "Vercel"
}
```

#### **Project Structure**

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
```

### 🎯 **HeyBo-Specific Optimizations**

#### **Food Service Type Safety**

```typescript
// Dietary restriction types
export type DietaryRestriction = 
  | 'vegan' 
  | 'vegetarian' 
  | 'gluten-free' 
  | 'dairy-free' 
  | 'nut-free';

// Location-specific ingredient availability
export interface LocationIngredient extends HeyBoIngredient {
  locationId: string;
  isAvailableAtLocation: boolean;
  estimatedRestockTime?: Date;
  alternativeSuggestions: string[]; // Ingredient IDs
}

// ML recommendation input/output types
export interface MLRecommendationInput {
  userId?: string;
  dietaryFilters: DietaryRestriction[];
  allergenFilters: Allergen[];
  locationContext: {
    locationId: string;
    availableIngredients: string[];
  };
  preferenceHistory?: UserPreference[];
}

export interface MLRecommendationOutput {
  recommendations: BowlComposition[];
  confidence: number;
  reasoning: string;
  fallbackUsed: boolean;
}
```

### 🚀 **Deployment & Performance**

#### **Widget Optimization**

```typescript
// Lazy loading for optimal performance
const HeyBoIngredientSelector = lazy(() => 
  import('@/components/heybo/ingredient-selector')
);

const HeyboBowlPreview = lazy(() => 
  import('@/components/heybo/bowl-preview')
);

// Bundle splitting for widget embedding
export const HeyboChatbotWidget = dynamic(() => 
  import('@/components/chatbot/widget'), {
  ssr: false, // Client-side only for widget
  loading: () => <ChatbotSkeleton />
});
```

### 🎨 **Design Token Integration**

#### **CSS Variables + TypeScript**

```typescript
// Generate CSS variables from TypeScript tokens
export const generateCSSVariables = (tokens: HeyBoTokens) => {
  const cssVars: Record<string, string> = {};
  
  Object.entries(tokens.colors).forEach(([colorName, colorScale]) => {
    if (typeof colorScale === 'object') {
      Object.entries(colorScale).forEach(([shade, value]) => {
        cssVars[`--color-${colorName}-${shade}`] = value;
      });
    } else {
      cssVars[`--color-${colorName}`] = colorScale;
    }
  });
  
  return cssVars;
};

// Type-safe color usage
export const useHeyBoColor = (color: keyof HeyBoTokens['colors']) => {
  return `hsl(var(--color-${color}))`;
};
```

### 📋 **Development Workflow**

#### **Type Safety Checks**

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "lint": "eslint . --ext .ts,.tsx",
    "test:types": "vitest run --typecheck",
    "build": "next build && tsc --noEmit"
  }
}
```

This stack provides maximum type safety for your complex food ordering domain while maintaining optimal performance and developer experience for the 1CloudHub team.
