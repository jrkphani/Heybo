# HeyBo Design System Compliance Checklist

**Document Version:** 1.0  
**Date:** June 2025  
**Prepared By:** 1CloudHub Design & Development Team  
**Status:** Current Compliance Standards for HeyBo Chatbot

---

## Overview

This checklist ensures all HeyBo chatbot components and interfaces adhere to the HeyBo Design System standards. Use this document for code reviews, new feature development, chatbot widget integration, and design system audits.

---

## ✅ Color System Compliance

### Primary Brand Colors

- [ ] Uses `--orange-500` (#F97316) for main brand elements
- [ ] Uses `--orange-600` (#EA580C) for primary buttons and CTAs
- [ ] Uses `--secondary-500` (#F59E0B) for accent elements
- [ ] No hardcoded hex colors in chatbot components
- [ ] No dynamic Tailwind color classes (e.g., `bg-${color}-500`)

### Food Service Semantic Colors

- [ ] Uses `--green-500` (#22C55E) for healthy/success states
- [ ] Uses `--yellow-500` (#F59E0B) for attention/warning states
- [ ] Uses `--brown-500` (#A16B47) for bowl representations
- [ ] Uses `--blue-500` (#3B82F6) for information states
- [ ] Uses semantic food tokens instead of generic colors

### Warm Neutral Palette

- [ ] Uses `--gray-900` (#1C1917) for headings in warm tone
- [ ] Uses `--gray-700` (#44403C) for body text
- [ ] Uses `--gray-600` (#57534E) for secondary text
- [ ] Uses `--gray-200` (#E8E5E1) for warm borders and dividers

### ❌ Common Violations to Avoid

```typescript
// ❌ Don't use dynamic classes
className={`bg-${color}-500`}

// ❌ Don't use hardcoded colors
className="bg-orange-500"

// ❌ Don't use generic semantic colors
className="bg-blue-500" // Use semantic food colors instead

// ✅ Use HeyBo semantic tokens
className="bg-primary-500"
className="text-healthy" // for green success states
className="bg-bowl-brown" // for bowl representations
```

---

## ✅ Typography Compliance

### Font Family

- [ ] Uses Inter font for all chatbot UI elements
- [ ] Uses JetBrains Mono for order IDs and nutritional data
- [ ] Inherits font family from parent HeyBo website when embedded
- [ ] No custom font imports outside design system

### Food Service Text Sizes

- [ ] Uses `text-xs` (12px) for allergen info and captions
- [ ] Uses `text-sm` (14px) for ingredient names and body text
- [ ] Uses `text-base` (16px) for default chat messages
- [ ] Uses `text-lg` (18px) for ingredient categories
- [ ] Uses `text-xl` (20px) for section headers like "Select Protein"
- [ ] Uses `text-2xl` (24px) for "Create Your Bowl" titles
- [ ] No arbitrary text sizes (e.g., `text-[15px]`)

### Font Weights for Food Context

- [ ] Uses `font-normal` (400) for descriptions and instructions
- [ ] Uses `font-medium` (500) for buttons and ingredient labels
- [ ] Uses `font-semibold` (600) for category headers
- [ ] Uses `font-bold` (700) for hero text and main headings

### ❌ Common Violations to Avoid

```typescript
// ❌ Don't use arbitrary sizes
className="text-[15px]"

// ❌ Don't use non-food-service appropriate weights
className="font-black"

// ✅ Use HeyBo food service scales
className="text-sm font-medium" // For ingredient labels
className="text-lg font-semibold" // For category headers
```

---

## ✅ Spacing System Compliance

### 8px Grid System for Food Interface

- [ ] Uses multiples of 8px for all spacing
- [ ] Uses `space-2` (8px) for ingredient spacing
- [ ] Uses `space-4` (16px) for default component spacing
- [ ] Uses `space-6` (24px) for category spacing
- [ ] Uses `space-8` (32px) for major section spacing

### Food Service Layout Spacing

- [ ] Uses `gap-3` (12px) for ingredient grid gaps
- [ ] Uses `gap-4` (16px) for bowl option cards
- [ ] Uses consistent container padding
- [ ] Uses 44px minimum touch targets for mobile ordering

### ❌ Common Violations to Avoid

```typescript
// ❌ Don't use arbitrary spacing
className="p-[12px]"

// ❌ Don't use non-grid spacing
className="p-3 m-5" // Not 8px multiples

// ✅ Use HeyBo 8px grid system
className="p-4 m-2 space-y-4" // For ingredient sections
className="gap-3" // For ingredient grids
```

---

## ✅ Chatbot Widget Compliance

### Widget Container

- [ ] Uses `.heybo-chatbot-widget` namespace for all styles
- [ ] Implements proper z-index management (--widget-z-index: 1000)
- [ ] Uses responsive positioning (mobile: full screen, desktop: corner)
- [ ] Prevents CSS conflicts with parent HeyBo website

### Widget States

- [ ] Implements collapsed FAB state (56×56px)
- [ ] Uses proper expansion animations (300ms ease-out)
- [ ] Handles mobile fullscreen overlay correctly
- [ ] Maintains widget state during parent page navigation

### Chat Interface Components

- [ ] Uses `.heybo-chatbot-header` with orange gradient
- [ ] Implements `.heybo-message-bubble` with proper styling
- [ ] Uses `.heybo-typing-indicator` for loading states
- [ ] Includes proper scroll behavior in chat body

### ❌ Common Widget Violations

```typescript
// ❌ Don't use generic widget classes
className="chatbot-widget"

// ❌ Don't hardcode widget positioning
style={{ position: 'fixed', bottom: '20px' }}

// ✅ Use HeyBo widget system
className="heybo-chatbot-widget"
className="heybo-message-bubble user"
```

---

## ✅ Food Service Component Compliance

### Bowl Building Interface

- [ ] Uses `.heybo-ingredient-grid` for ingredient layouts
- [ ] Implements `.heybo-ingredient-card` with proper states
- [ ] Uses proper selection states (selected, unavailable, hover)
- [ ] Includes weight tracking warnings at 720g threshold

### Ingredient Components

- [ ] Uses proper ingredient categorization display
- [ ] Implements dietary filter indicators
- [ ] Shows nutritional information when required
- [ ] Uses proper unavailable ingredient styling

### Bowl Visualization

- [ ] Uses brand-specific ingredient layering for HeyBo
- [ ] Implements realistic bowl representation
- [ ] Shows proper portion visualization
- [ ] Uses warm grain bowl styling (not salad styling)

### ❌ Food Service Violations

```typescript
// ❌ Don't use generic food components
<IngredientCard /> // Too generic

// ❌ Don't mix SaladStop and HeyBo styling
className="salad-bowl-view" // Wrong brand

// ✅ Use HeyBo-specific components
<HeyBoIngredientCard />
className="heybo-grain-bowl-preview"
```

---

## ✅ Mobile Ordering Compliance

### Touch Optimization

- [ ] Uses minimum 44px touch targets for ingredients
- [ ] Implements 48px height for quantity controls
- [ ] Uses proper thumb-friendly button sizing
- [ ] Includes adequate spacing between selectable elements

### Mobile Chat Interface

- [ ] Uses full-screen overlay on mobile (<640px)
- [ ] Implements slide-up animation for mobile
- [ ] Uses proper mobile keyboard handling
- [ ] Prevents zoom on input focus

### Performance for Mobile Ordering

- [ ] Implements lazy loading for ingredient images
- [ ] Uses progressive enhancement for ML features
- [ ] Optimizes for slow network connections
- [ ] Minimizes initial chatbot bundle size

---

## ✅ Accessibility Compliance for Food Ordering

### Food-Specific ARIA Labels

- [ ] Uses proper ARIA labels for ingredient selection
- [ ] Implements screen reader friendly bowl descriptions
- [ ] Uses semantic HTML for dietary restriction indicators
- [ ] Includes proper allergen information labeling

### Voice Ordering Support

- [ ] Implements ARIA live regions for bowl updates
- [ ] Uses proper announcements for ingredient additions
- [ ] Includes screen reader friendly nutritional info
- [ ] Uses semantic markup for order progression

### Visual Accessibility

- [ ] Meets WCAG 2.1 AA contrast for orange brand colors
- [ ] Uses patterns in addition to color for dietary indicators
- [ ] Implements high contrast mode support
- [ ] Uses proper focus indicators for ingredient selection

---

## ✅ Brand Integration Compliance

### HeyBo Website Integration

- [ ] Inherits font family from parent HeyBo website
- [ ] Uses `font-family: inherit` in widget root
- [ ] Respects parent website's color harmony
- [ ] Maintains HeyBo accessibility standards

### Multi-Brand Support

- [ ] Uses HeyBo-specific warm grain bowl imagery
- [ ] Implements HeyBo category rules (base required, protein optional)
- [ ] Uses HeyBo menu structure (not SaladStop)
- [ ] Shows HeyBo-specific nutritional information

### CSS Isolation

- [ ] All styles prefixed with `.heybo-chatbot-`
- [ ] Uses CSS custom properties for theming
- [ ] Prevents style leakage to parent website
- [ ] Implements proper CSS scoping

---

## ✅ Type Safety Compliance

### TypeScript Configuration Standards

- [ ] Uses `strict: true` in all TypeScript configurations
- [ ] Implements `noUncheckedIndexedAccess: true` for array safety
- [ ] Uses `noImplicitReturns: true` for function consistency
- [ ] Uses `exactOptionalPropertyTypes: true` for precise interfaces
- [ ] Uses `useUnknownInCatchVariables: true` for error handling
- [ ] No TypeScript comment directives (`@ts-ignore`, `@ts-expect-error`)

### Food Service Type Definitions

- [ ] Uses proper `HeyBoIngredient` interface for all ingredient data
- [ ] Implements `BowlComposition` with required base ingredient
- [ ] Uses typed `IngredientCategory` for proper categorization
- [ ] Implements `DietaryRestriction` and `Allergen` union types
- [ ] Uses `OrderStatus` enum for order tracking states
- [ ] All ingredient weights typed as `number` (grams)

### API Response Type Safety

- [ ] No `any` types in API response interfaces
- [ ] Uses generic `APIResponse<T>` for consistent response typing
- [ ] Implements proper error response interfaces
- [ ] Uses Zod schemas for runtime validation
- [ ] Types all ML recommendation responses
- [ ] Validates session management API responses

### ❌ Type Safety Violations to Avoid

```typescript
// ❌ Don't use any types
onOrderComplete?: (order: any) => void;
bowlValidation: any | null;

// ❌ Don't use type assertions to any
return result as any;
mlSource: source as any;

// ❌ Don't leave parameters untyped
.map((ingredient, index) => { // Parameters implicitly any

// ✅ Use proper HeyBo food service types
onOrderComplete?: (order: OrderSummary) => void;
bowlValidation: BowlValidationResult | null;
return result as MockAPIResponse<BowlComposition[]>;
mlSource: source as MLRecommendationSource;
.map((ingredient: HeyBoIngredient, index: number) => {
```

### User Authentication Type Safety

- [ ] Uses `User` interface consistently across auth flow
- [ ] Types OTP verification responses properly
- [ ] Implements `UserType` union ('registered' | 'guest' | 'unauthenticated')
- [ ] Uses `UserPreferences` interface for dietary restrictions
- [ ] No `any` types in authentication callbacks
- [ ] Types session validation responses

### Cart and Order Type Safety

- [ ] Uses `CartItem` interface for all cart operations
- [ ] Implements `OrderSummary` for checkout flow
- [ ] Types ingredient selection state properly
- [ ] Uses `BowlValidationResult` for weight/price validation
- [ ] Implements `CartValidationResult` for checkout validation
- [ ] No unsafe array access in cart operations

### Error Handling Type Safety

- [ ] Uses `unknown` type in catch blocks, not `any`
- [ ] Implements `ChatbotError` interface for all errors
- [ ] Uses `ErrorCategory` union for error classification
- [ ] Types recovery actions properly
- [ ] No implicit error types in async operations
- [ ] Uses type guards for error type checking

```typescript
// ✅ Proper error handling pattern
try {
  const recommendations = await mlAPI.getRecommendations(params);
} catch (error: unknown) {
  if (error instanceof Error) {
    handleAPIError({
      code: 'ML_API_ERROR',
      message: error.message,
      category: 'ml' as ErrorCategory,
      recoverable: true
    });
  }
}
```

## ✅ Performance & Integration Compliance

### API Integration

- [ ] Uses proper SageMaker ML endpoint integration
- [ ] Implements 3-second timeout with fallback
- [ ] Uses best-effort ingredient availability checking
- [ ] Handles vendor database read-only access correctly
- [ ] All API calls properly typed with response interfaces
- [ ] Uses type-safe error handling for API failures

### Caching Strategy

- [ ] Implements 5-15 minute cache for ingredient data
- [ ] Uses CloudFront caching for menu data
- [ ] Accepts acceptable staleness with user notification
- [ ] No real-time inventory locking
- [ ] Cached data maintains type safety
- [ ] Cache invalidation properly typed

### Session Management

- [ ] Uses device-specific sessions (24-hour cleanup)
- [ ] Implements proper cart recovery
- [ ] Handles guest user OTP flow correctly
- [ ] Maintains session state during widget close/open
- [ ] Session data strictly typed with `SessionData` interface
- [ ] Type-safe session validation and updates

---

## 🔍 HeyBo-Specific Review Checklist

### Before Code Review

- [ ] Run chatbot in embedded HeyBo website context
- [ ] Test ingredient selection flow end-to-end
- [ ] Verify warm grain bowl categorization
- [ ] Check mobile ordering experience
- [ ] Test with HeyBo authentication flow

### During Code Review

- [ ] Check for hardcoded food colors or spacing
- [ ] Verify proper HeyBo component usage
- [ ] Ensure consistent patterns with food service UX
- [ ] Review ML recommendation implementation
- [ ] Check widget responsive behavior
- [ ] **Verify no `any` types in new code**
- [ ] **Check all function parameters are properly typed**
- [ ] **Ensure API responses use proper interfaces**
- [ ] **Validate error handling uses `unknown` type**
- [ ] **Confirm ingredient/bowl data uses HeyBo types**

### Before Deployment

- [ ] Test integration with HeyBo website
- [ ] Verify chatbot widget positioning
- [ ] Check cross-device session handling
- [ ] Test with actual HeyBo menu data
- [ ] Validate order handoff to platform

---

## 🚨 Critical HeyBo Violations

### Immediate Fix Required

1. **Wrong Brand Colors**: Using SaladStop colors in HeyBo interface
2. **Incorrect Food Categorization**: Using salad rules for grain bowls
3. **Widget Conflicts**: CSS conflicts with HeyBo website
4. **Mobile Ordering Issues**: Poor touch targets for ingredient selection
5. **Authentication Bypass**: Not handling HeyBo user sessions
6. **🔴 Any Type Usage**: Using `any` types that bypass type safety
7. **🔴 Missing Type Exports**: Referenced types not exported from modules

### High Priority Fixes

1. **Inconsistent Food Spacing**: Non-8px grid in ingredient grids
2. **Typography Issues**: Wrong font weights for food context
3. **Widget Integration**: Poor responsive behavior in parent site
4. **Performance Issues**: Slow ML recommendations without fallback
5. **🟡 Type Assertion Abuse**: Overuse of `as any` type assertions
6. **🟡 Incomplete Interfaces**: Missing required properties in type definitions
7. **🟡 Unsafe Array Access**: Array access without bounds checking

---

## 📋 Automated HeyBo Checks

### ESLint Rules for Food Service

```json
{
  "rules": {
    "no-hardcoded-food-colors": "error",
    "prefer-heybo-tokens": "error",
    "require-ingredient-aria": "warn",
    "no-salad-components-in-heybo": "error",
    "proper-widget-namespacing": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-return": "error"
  }
}
```

### TypeScript Strict Mode Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "useUnknownInCatchVariables": true
  }
}
```

### Pre-commit Hooks

- TypeScript compilation check
- **TypeScript strict mode validation**
- **ESLint type safety rules check**
- **Zod schema validation test**
- HeyBo widget integration test
- Ingredient selection accessibility scan
- Mobile ordering flow validation
- **Type coverage analysis (minimum 95%)**

---

## 📚 HeyBo Resources

### Design System Documentation

- [HeyBo Design System & Style Guide](./HeyBo_Design_System_Style_Guide.md)
- [SaladStop Chatbot Functional Specification](./SaladStop_Chatbot_Functional_Specification.md)
- [HeyBo Brand Guidelines](./Brand_Guidelines/)

### Food Service Tools

- [Ingredient Accessibility Checker](https://www.tpgi.com/color-contrast-checker/)
- [Mobile Ordering Simulator](https://responsively.app/)
- [Voice Ordering Testing](https://www.deque.com/axe/devtools/)

### Type Safety Tools

- [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [Type Coverage Tool](https://github.com/plantain-00/type-coverage)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
- [Zod Runtime Validation](https://github.com/colinhacks/zod)
- [TypeScript Strict Mode Guide](https://www.typescriptlang.org/tsconfig#strict)

### API Documentation

- [HeyBo Menu API](https://d2o7qvkenn9k24.cloudfront.net/api/v1/gglocation-menus/)
- [SageMaker ML Recommendations](./api/ml-recommendations.md)
- [Vendor Database Schema](./database/vendor-db-schema.md)

---

## 🎯 HeyBo Success Metrics

### User Experience Metrics

- [ ] Ingredient selection completion rate >85%
- [ ] Mobile ordering flow completion >80%
- [ ] Widget load time <2 seconds
- [ ] ML recommendation acceptance rate >40%

### Technical Metrics

- [ ] Zero CSS conflicts with parent website
- [ ] 100% touch target accessibility compliance
- [ ] <3 second fallback activation time
- [ ] 24-hour session persistence rate >95%
- [ ] **Type safety coverage >95%**
- [ ] **Zero TypeScript strict mode errors**
- [ ] **Zero `any` types in production code**

### Brand Consistency Metrics

- [ ] 100% HeyBo color compliance
- [ ] Proper warm grain bowl categorization
- [ ] Consistent with HeyBo website experience
- [ ] Proper dietary indicator implementation

### Code Quality Metrics

- [ ] **TypeScript strict mode compliance: 100%**
- [ ] **API response type coverage: 100%**
- [ ] **Error handling type safety: 100%**
- [ ] **Food service type accuracy: 100%**
- [ ] **Zero unsafe type assertions in critical paths**

---

## Conclusion

Maintaining HeyBo design system compliance ensures a consistent, accessible, and brand-appropriate food ordering experience. This checklist specifically addresses the unique requirements of warm grain bowl customization, mobile ordering optimization, and seamless website integration.

**Remember**: HeyBo focuses on warm, energetic, and wholesome nutrition. Every design decision should reflect the brand's bold yet approachable personality while maintaining optimal usability for on-the-go grain bowl ordering.

**Type Safety First**: All code must maintain strict type safety to ensure reliable food ordering experiences. No `any` types should compromise the integrity of ingredient selection, bowl composition, or order processing.

**For 1CloudHub Team**: When implementing new features, always consider the food service context, mobile-first ordering experience, and type safety requirements that define HeyBo's reliable customer journey. Every ingredient selection, every bowl composition, and every order must be type-safe from start to finish.
