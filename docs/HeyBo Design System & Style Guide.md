# HeyBo Design System & Style Guide

**Version:** 1.0  
**Date:** June 2025  
**Status:** Official Design System for HeyBo Brand

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Brand Foundations](#2-brand-foundations)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Components](#6-components)
7. [Iconography](#7-iconography)
8. [Motion & Animation](#8-motion--animation)
9. [Dark Mode](#9-dark-mode)
10. [Accessibility](#10-accessibility)
11. [Implementation Guide](#11-implementation-guide)
12. [Design Tokens](#12-design-tokens)

---

## 1. Introduction

### Purpose

This design system serves as the comprehensive guide for HeyBo's visual identity and user experience across all digital touchpoints, particularly the AI-powered chatbot ordering system. It ensures brand consistency while maintaining optimal usability for warm grain bowl customization and ordering.

### Design Principles

1. **Warm & Welcoming** - Colors and interactions that evoke comfort and nourishment
2. **Bold & Confident** - Vibrant palette that stands out and energizes
3. **Natural & Organic** - Design elements that reflect healthy, wholesome food
4. **Accessible & Inclusive** - WCAG 2.1 AA compliance as baseline standard
5. **Mobile-First Experience** - Optimized for on-the-go ordering and customization

### Technology Stack

- **Frontend Framework:** React 18+
- **Component Library:** shadcn/ui (customized for HeyBo)
- **Styling:** Tailwind CSS with HeyBo theme
- **Mobile:** React Native
- **Icons:** Lucide React
- **AI Integration:** Amazon Bedrock, SageMaker ML

---

## 2. Brand Foundations

### 2.1 Brand Personality

**HeyBo** represents bold, energetic, and wholesome nutrition through warm grain bowls. The brand speaks to health-conscious individuals seeking satisfying, customizable meals with a focus on protein-packed, homemade, slow-cooked offerings.

**Voice & Tone:**

- Friendly and approachable
- Confident but not aggressive
- Health-focused without being preachy
- Energetic and uplifting
- Professional yet warm for corporate dining

### 2.2 Chatbot Widget Integration Strategy

**Widget Responsive Behavior:**

- **Desktop (1024px+):** Fixed bottom-right position, 400px width, up to 600px height
- **Tablet (640-1023px):** Adaptive positioning, 360px width, adjustable height
- **Mobile (<640px):** Full-screen overlay when opened, slide-up animation

**Website Integration Guidelines:**

- Must not interfere with existing HeyBo website navigation
- Maintains website's existing color harmony
- Inherits font stack from parent website
- Preserves accessibility standards of main site

### 2.3 Grid System - Widget Optimized

**Chatbot Widget Grid System**

| Device | Widget Width | Content Grid | Padding | Scroll Behavior |
|---------|--------------|--------------|---------|----------------|
| Mobile | 100vw | Single column | 16px | Full scroll |
| Tablet | 360px | Single column | 20px | Internal scroll |
| Desktop | 400px | Single column | 24px | Internal scroll |
| Large Desktop | 400px | Single column | 24px | Internal scroll |

### 2.4 Responsive Breakpoints - Widget Focused

```css
/* Chatbot Widget Responsive Strategy */
$widget-mobile: 320px;    /* Full-screen overlay */
$widget-tablet: 640px;    /* Fixed-width sidebar */
$widget-desktop: 1024px;  /* Corner widget */
$widget-wide: 1280px;     /* Enhanced corner widget */

/* Widget positioning variables */
--widget-mobile-position: fixed bottom-0 left-0 right-0;
--widget-tablet-position: fixed bottom-4 right-4;
--widget-desktop-position: fixed bottom-6 right-6;
--widget-z-index: 1000; /* Above website content */
```

### 2.5 Website Integration Compatibility

**CSS Isolation Strategy:**

- All chatbot styles prefixed with `.heybo-chatbot-`
- CSS-in-JS or scoped styles to prevent conflicts
- Custom CSS properties for theming
- Respects parent website's scroll behavior

**Performance Considerations:**

- Lazy loading of chatbot components
- Progressive enhancement approach
- Minimal initial bundle size
- Async loading of ML recommendation engine

---

## 3. Color System

### 3.1 Primary Brand Colors

#### Sunset Orange (Primary)

Warm, energetic, and appetite-appealing

| Token | Hex | Pantone | Usage |
|-------|-----|---------|-------|
| primary-50 | #FFF7ED | - | Light backgrounds |
| primary-100 | #FFEDD5 | - | Hover backgrounds |
| primary-200 | #FED7AA | - | Active backgrounds |
| primary-300 | #FDBA74 | - | Disabled states |
| primary-400 | #FB923C | - | Secondary actions |
| **primary-500** | **#F97316** | **Orange 021C** | **Main brand color** |
| primary-600 | #EA580C | - | Primary buttons |
| primary-700 | #C2410C | - | Hover states |
| primary-800 | #9A3412 | - | Active states |
| primary-900 | #7C2D12 | - | Dark accents |

#### Vibrant Yellow (Secondary)

Energy, freshness, and optimism

| Token | Hex | Pantone | Usage |
|-------|-----|---------|-------|
| secondary-50 | #FEFCE8 | - | Light backgrounds |
| secondary-100 | #FEF3C7 | - | Accent backgrounds |
| secondary-200 | #FDE68A | - | Hover states |
| secondary-300 | #FCD34D | - | Active elements |
| secondary-400 | #FBBF24 | - | Highlights |
| **secondary-500** | **#F59E0B** | **Yellow C** | **Accent color** |
| secondary-600 | #D97706 | - | Accent hover |
| secondary-700 | #B45309 | - | Accent active |
| secondary-800 | #92400E | - | Dark accent |
| secondary-900 | #78350F | - | Deepest yellow |

#### Forest Green (Supporting)

Natural, healthy, fresh ingredients

| Token | Hex | Pantone | Usage |
|-------|-----|---------|-------|
| green-50 | #F0FDF4 | - | Success backgrounds |
| green-100 | #DCFCE7 | - | Light states |
| green-200 | #BBF7D0 | - | Hover states |
| green-300 | #86EFAC | - | Active states |
| green-400 | #4ADE80 | - | Success elements |
| **green-500** | **#22C55E** | **Green 7482** | **Success/Healthy** |
| green-600 | #16A34A | - | Success hover |
| green-700 | #15803D | - | Success active |
| green-800 | #166534 | - | Dark success |
| green-900 | #14532D | - | Deepest green |

#### Bright Blue (Accent)

Trust, reliability, freshness

| Token | Hex | Pantone | Usage |
|-------|-----|---------|-------|
| blue-50 | #EFF6FF | - | Info backgrounds |
| blue-100 | #DBEAFE | - | Light info |
| blue-200 | #BFDBFE | - | Info hover |
| blue-300 | #93C5FD | - | Info active |
| blue-400 | #60A5FA | - | Info elements |
| **blue-500** | **#3B82F6** | **Blue 2925** | **Information** |
| blue-600 | #2563EB | - | Info hover |
| blue-700 | #1D4ED8 | - | Info active |
| blue-800 | #1E40AF | - | Dark info |
| blue-900 | #1E3A8A | - | Deepest blue |

### 3.2 Supporting Brand Colors

#### Rich Brown (Grounding)

Representing grain bowls, warmth, and comfort

| Token | Hex | Pantone | Usage |
|-------|-----|---------|-------|
| brown-50 | #FEFDFB | - | Subtle backgrounds |
| brown-100 | #FEF7E6 | - | Light warm backgrounds |
| brown-200 | #F5E6D3 | - | Warm hover states |
| brown-300 | #E7C4A0 | - | Warm accents |
| brown-400 | #D4956D | - | Bowl representations |
| **brown-500** | **#A16B47** | **Brown 7526** | **Grain bowl color** |
| brown-600 | #8B4513 | - | Deep bowl tones |
| brown-700 | #723A0F | - | Rich grain colors |
| brown-800 | #5A2D0C | - | Dark warm tones |
| brown-900 | #422209 | - | Deepest brown |

### 3.3 Semantic Colors

```css
/* Status Colors - HeyBo Brand Aligned */
--color-success: #22C55E;   /* Fresh green */
--color-warning: #F59E0B;   /* Vibrant yellow */
--color-error: #DC2626;     /* Red (not primary brand) */
--color-info: #3B82F6;      /* Bright blue */

/* With light/dark variants */
--color-success-light: #DCFCE7;
--color-success-dark: #14532D;

--color-warning-light: #FEF3C7;
--color-warning-dark: #78350F;

--color-error-light: #FEE2E2;
--color-error-dark: #991B1B;

--color-info-light: #DBEAFE;
--color-info-dark: #1E3A8A;
```

### 3.4 Neutral Palette (Warm-toned)

```css
/* Warm Gray Scale - Aligned with HeyBo's warm aesthetic */
--gray-50: #FAF9F7;   /* Warm white backgrounds */
--gray-100: #F5F3F0;  /* Subtle warm backgrounds */
--gray-200: #E8E5E1;  /* Warm borders */
--gray-300: #D6D1CC;  /* Disabled warm borders */
--gray-400: #A8A29E;  /* Placeholder text */
--gray-500: #78716C;  /* Secondary text */
--gray-600: #57534E;  /* Icons */
--gray-700: #44403C;  /* Body text */
--gray-800: #292524;  /* Headings */
--gray-900: #1C1917;  /* Maximum contrast */
```

### 3.5 Application Colors

| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background Primary | #FEFDFB | #1C1917 |
| Background Secondary | #FAF9F7 | #292524 |
| Background Tertiary | #F5F3F0 | #44403C |
| Text Primary | #292524 | #F5F3F0 |
| Text Secondary | #78716C | #D6D1CC |
| Border Default | #E8E5E1 | #44403C |
| Border Subtle | #F5F3F0 | #292524 |

---

## 4. Typography

### 4.1 Font Stack

```css
/* Primary Font Family - Friendly and Modern */
--font-sans: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* Accent Font for Headlines */
--font-display: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 
                'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* Monospace for Order IDs and Data */
--font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 
             'Roboto Mono', Consolas, monospace;
```

### 4.2 Type Scale - Food Service Optimized

| Style | Mobile | Desktop | Weight | Line Height | Usage |
|-------|--------|---------|--------|-------------|-------|
| Hero | 32px | 48px | 700 | 1.1 | App headers, welcome |
| H1 | 28px | 36px | 700 | 1.2 | Page titles, "Create Your Bowl" |
| H2 | 24px | 30px | 600 | 1.3 | Section headers, "Select Protein" |
| H3 | 20px | 24px | 600 | 1.4 | Category headers, "Toppings" |
| H4 | 18px | 20px | 500 | 1.4 | Item names, ingredient labels |
| Body Large | 16px | 18px | 400 | 1.7 | Descriptions, nutritional info |
| Body | 14px | 16px | 400 | 1.5 | Default text, instructions |
| Body Small | 12px | 14px | 400 | 1.5 | Captions, allergen info |
| Button | 14px | 14px | 500 | 1.2 | All CTA buttons |
| Label | 14px | 14px | 500 | 1.4 | Form labels, prices |

### 4.3 Font Weights

```css
--font-regular: 400;  /* Body text, descriptions */
--font-medium: 500;   /* Emphasis, buttons, labels */
--font-semibold: 600; /* Subheadings, categories */
--font-bold: 700;     /* Headings, hero text */
```

---

## 5. Spacing & Layout

### 5.1 Spacing Scale (8px base unit)

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| space-0 | 0 | 0px | No spacing |
| space-1 | 0.25rem | 4px | Tight ingredient spacing |
| space-2 | 0.5rem | 8px | Component padding |
| space-3 | 0.75rem | 12px | Related ingredient groups |
| space-4 | 1rem | 16px | Default section spacing |
| space-5 | 1.25rem | 20px | Between categories |
| space-6 | 1.5rem | 24px | Major sections |
| space-8 | 2rem | 32px | Page sections |
| space-10 | 2.5rem | 40px | Major layout divisions |
| space-12 | 3rem | 48px | Hero spacing |
| space-16 | 4rem | 64px | Page margins |

### 5.2 Food Service Spacing Patterns

```css
/* Bowl Building Interface */
--spacing-ingredient: var(--space-2);   /* 8px between ingredients */
--spacing-category: var(--space-6);     /* 24px between categories */
--spacing-section: var(--space-8);      /* 32px between major sections */

/* Card spacing for bowl options */
--card-padding: var(--space-4);         /* 16px internal padding */
--card-gap: var(--space-4);             /* 16px between bowl cards */

/* Button spacing */
--button-padding-x: var(--space-4);     /* 16px horizontal */
--button-padding-y: var(--space-3);     /* 12px vertical */
--button-gap: var(--space-3);           /* 12px between buttons */
```

---

## 6. Components - Chatbot Widget Focused

### 6.1 Chatbot Widget Container

#### Widget States

| State | Behavior | Dimensions | Animation |
|-------|----------|------------|-----------|
| Collapsed | Floating action button | 56×56px | Subtle pulse |
| Expanding | Slide-up/fade-in | Target size | 300ms ease-out |
| Expanded | Full interface | Responsive | None |
| Closing | Slide-down/fade-out | To FAB | 250ms ease-in |

#### Widget Positioning

```css
.heybo-chatbot-widget {
  position: fixed;
  z-index: var(--widget-z-index);
  font-family: inherit; /* Inherit from parent website */
  
  /* Mobile: Full overlay */
  @media (max-width: 639px) {
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh;
    border-radius: 0;
  }
  
  /* Tablet & Desktop: Corner widget */
  @media (min-width: 640px) {
    bottom: 20px;
    right: 20px;
    width: 380px;
    max-height: 600px;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  /* Large Desktop: Enhanced positioning */
  @media (min-width: 1280px) {
    bottom: 32px;
    right: 32px;
    width: 400px;
  }
}
```

### 6.2 Floating Action Button (FAB)

```css
.heybo-chatbot-fab {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--orange-500) 0%, var(--orange-600) 100%);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  transition: all 200ms ease-out;
  position: relative;
  overflow: hidden;
}

.heybo-chatbot-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.5);
}

.heybo-chatbot-fab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
```

### 6.3 Chat Interface Components

#### Chat Header

```css
.heybo-chatbot-header {
  background: linear-gradient(135deg, var(--orange-500) 0%, var(--orange-600) 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  /* Mobile: Full width */
  @media (max-width: 639px) {
    border-radius: 0;
    padding: 20px 16px;
  }
}

.heybo-chatbot-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.heybo-chatbot-subtitle {
  font-size: 14px;
  opacity: 0.9;
  color: white;
}
```

#### Chat Body

```css
.heybo-chatbot-body {
  background: linear-gradient(to bottom, #FAF9F7, #FEFDFB);
  padding: 16px;
  height: 400px;
  overflow-y: auto;
  
  /* Mobile: Full height minus header and input */
  @media (max-width: 639px) {
    height: calc(100vh - 140px);
    padding: 20px 16px;
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--gray-100);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--orange-300);
    border-radius: 2px;
  }
}
```

#### Message Bubbles

```css
.heybo-message {
  margin-bottom: 12px;
  display: flex;
  max-width: 100%;
}

.heybo-message.user {
  justify-content: flex-end;
}

.heybo-message.bot {
  justify-content: flex-start;
}

.heybo-message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  
  /* User messages */
  &.user {
    background: var(--orange-500);
    color: white;
    border-bottom-right-radius: 4px;
  }
  
  /* Bot messages */
  &.bot {
    background: white;
    color: var(--brown-800);
    border: 1px solid var(--gray-200);
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}
```

### 6.4 Bowl Building Interface - Widget Optimized

#### Ingredient Selection Cards

```css
.heybo-ingredient-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.heybo-ingredient-card {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 200ms ease-out;
  position: relative;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.heybo-ingredient-card:hover {
  border-color: var(--orange-300);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);
}

.heybo-ingredient-card.selected {
  border-color: var(--orange-500);
  background: var(--orange-50);
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.15);
}

.heybo-ingredient-card.unavailable {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(50%);
}

.heybo-ingredient-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--brown-800);
  margin-top: 4px;
  text-align: center;
}
```

### 6.5 Action Buttons - Widget Specific

```css
.heybo-button {
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 200ms ease-out;
  min-height: 40px;
  padding: 0 16px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Primary action button */
.heybo-button-primary {
  background: var(--orange-600);
  color: white;
}

.heybo-button-primary:hover {
  background: var(--orange-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

/* Secondary button */
.heybo-button-secondary {
  background: white;
  color: var(--orange-700);
  border: 1px solid var(--orange-200);
}

.heybo-button-secondary:hover {
  background: var(--orange-50);
  border-color: var(--orange-300);
}

/* Quick action buttons */
.heybo-quick-actions {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  flex-wrap: wrap;
}

.heybo-quick-action {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.heybo-quick-action:hover {
  background: var(--orange-50);
  color: var(--orange-700);
  border-color: var(--orange-300);
}
```

### 6.6 Input Components - Widget Specific

```css
.heybo-input-container {
  background: white;
  border-top: 1px solid var(--gray-200);
  padding: 12px 16px;
  
  /* Mobile: Adjusted padding */
  @media (max-width: 639px) {
    padding: 16px;
  }
}

.heybo-input {
  width: 100%;
  border: 1px solid var(--gray-300);
  border-radius: 24px;
  padding: 10px 16px;
  font-size: 14px;
  background: var(--gray-50);
  transition: all 150ms ease-out;
  resize: none;
  min-height: 40px;
  max-height: 120px;
}

.heybo-input:focus {
  outline: none;
  border-color: var(--orange-500);
  background: white;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.heybo-input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.heybo-send-button {
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--orange-500);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease-out;
}

.heybo-send-button:hover {
  background: var(--orange-600);
  transform: scale(1.05);
}

.heybo-send-button:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
  transform: none;
}
```

### 6.7 Loading & Status Components

```css
.heybo-typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border-radius: 18px;
  border: 1px solid var(--gray-200);
  margin-bottom: 12px;
  max-width: fit-content;
}

.heybo-typing-dot {
  width: 6px;
  height: 6px;
  background: var(--gray-400);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.heybo-typing-dot:nth-child(1) { animation-delay: 0s; }
.heybo-typing-dot:nth-child(2) { animation-delay: 0.2s; }
.heybo-typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.heybo-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.heybo-status-success {
  background: var(--green-100);
  color: var(--green-800);
}

.heybo-status-warning {
  background: var(--yellow-100);
  color: var(--yellow-800);
}

.heybo-status-error {
  background: rgba(220, 38, 38, 0.1);
  color: #991B1B;
}
```

---

## 7. Iconography

### Icon Library: Lucide React + Custom Food Icons

- **Style:** Outline with 2px stroke for food items
- **Grid:** 24×24px viewBox
- **Alignment:** Pixel-perfect with HeyBo warmth

### Icon Sizes - Food Service

| Size | Class | Dimensions | Usage |
|------|-------|------------|-------|
| Extra Small | icon-xs | 16×16px | Inline ingredient labels |
| Small | icon-sm | 20×20px | Buttons, form inputs |
| Medium | icon-md | 24×24px | Default UI icons |
| Large | icon-lg | 32×32px | Category headers |
| Extra Large | icon-xl | 48×48px | Empty states, loading |
| Hero | icon-hero | 64×64px | Welcome screens |

### HeyBo-Specific Icon Colors

```css
.icon-heybo {
  color: var(--orange-600); /* Default brand color */
}

.icon-ingredient { color: var(--brown-600); }
.icon-protein { color: var(--orange-500); }
.icon-healthy { color: var(--green-600); }
.icon-premium { color: var(--yellow-600); }
.icon-spicy { color: #DC2626; }
.icon-vegetarian { color: var(--green-500); }
```

### Custom Food Icons Needed

- Bowl/container icons
- Ingredient category icons (grains, proteins, vegetables)
- Dietary restriction icons (vegan, gluten-free, etc.)
- Temperature icons (warm, hot)
- Spice level indicators

---

## 8. Motion & Animation - Widget Optimized

### 8.1 Duration Scale - Chatbot Performance

```css
/* Optimized for widget responsiveness */
--duration-instant: 100ms;  /* Immediate feedback */
--duration-fast: 150ms;     /* Button interactions */
--duration-normal: 250ms;   /* Widget open/close */
--duration-slow: 350ms;     /* Content transitions */
--duration-slower: 500ms;   /* Full screen modal */
```

### 8.2 Widget-Specific Animations

#### Widget Entry Animation

```css
@keyframes widgetSlideUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes widgetSlideIn {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.heybo-widget-enter {
  /* Mobile: Slide up from bottom */
  @media (max-width: 639px) {
    animation: widgetSlideUp 300ms var(--ease-organic);
  }
  
  /* Desktop: Slide in from right */
  @media (min-width: 640px) {
    animation: widgetSlideIn 250ms var(--ease-organic);
  }
}
```

#### Message Animations

```css
@keyframes messageSlideIn {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.heybo-message-appear {
  animation: messageSlideIn 200ms var(--ease-warm);
}

@keyframes ingredientSelect {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.heybo-ingredient-selected {
  animation: ingredientSelect 200ms var(--ease-bounce);
}
```

### 8.3 Performance Optimizations

```css
/* GPU acceleration for smooth animations */
.heybo-chatbot-widget,
.heybo-message-bubble,
.heybo-ingredient-card {
  will-change: transform;
  transform: translateZ(0);
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .heybo-chatbot-widget *,
  .heybo-chatbot-widget *::before,
  .heybo-chatbot-widget *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Dark Mode

### 9.1 Dark Mode Color Mappings

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | #FEFDFB | #1C1917 |
| Surface | #FAF9F7 | #292524 |
| Text Primary | #292524 | #FAF9F7 |
| Text Secondary | #78716C | #D6D1CC |
| Border | #E8E5E1 | #44403C |
| Primary Orange | #F97316 | #FB923C |
| Success Green | #22C55E | #4ADE80 |
| Warning Yellow | #F59E0B | #FBBF24 |

### 9.2 Dark Mode Implementation

```css
/* HeyBo Dark Mode Variables */
:root {
  --background: 30 8% 97%;
  --foreground: 20 14% 16%;
}

[data-theme="dark"] {
  --background: 20 14% 11%;
  --foreground: 30 8% 97%;
  
  /* HeyBo specific dark adjustments */
  --orange-glow: rgba(251, 146, 60, 0.15);
  --warm-surface: 20 14% 16%;
}

/* Dark mode bowl preview */
.dark .bowl-preview {
  background: linear-gradient(145deg, #292524 0%, #44403C 100%);
  border-color: var(--brown-700);
}
```

---

## 10. Accessibility

### 10.1 HeyBo Color Contrast Requirements

| Text Type | Minimum Ratio | WCAG Level | HeyBo Application |
|-----------|---------------|------------|-------------------|
| Normal text | 4.5:1 | AA | Ingredient names, descriptions |
| Large text (18px+) | 3:1 | AA | Category headers, bowl names |
| UI components | 3:1 | AA | Buttons, form controls |
| Brand elements | 4.5:1 | AA | Logo text, primary CTAs |

### 10.2 Touch Accessibility

```css
/* Minimum touch target sizes */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* Ingredient selection - larger targets */
.ingredient-option {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
}

/* Quantity controls */
.quantity-button {
  width: 44px;
  height: 44px;
  border-radius: 8px;
}
```

### 10.3 Voice Ordering Support

```css
/* Screen reader friendly bowl descriptions */
.sr-bowl-description {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* Announce ingredient additions */
[aria-live="polite"] .ingredient-added::before {
  content: "Added " attr(data-ingredient-name) " to your bowl";
}
```

---

## 11. Implementation Guide - Chatbot Widget Integration

### 11.1 HeyBo Website Integration Setup

```javascript
// Widget initialization script for HeyBo website
(function() {
  // Prevent conflicts with existing HeyBo styles
  const WIDGET_NAMESPACE = 'heybo-chatbot-';
  
  // Create isolated CSS scope
  const createWidgetCSS = () => {
    const style = document.createElement('style');
    style.id = 'heybo-chatbot-styles';
    style.textContent = `
      /* All widget styles prefixed to prevent conflicts */
      .${WIDGET_NAMESPACE}widget {
        /* Widget-specific styles here */
        font-family: inherit; /* Inherit from HeyBo website */
        --heybo-primary: #F97316;
        --heybo-secondary: #F59E0B;
        /* ... other CSS variables */
      }
    `;
    document.head.appendChild(style);
  };
  
  // Widget positioning based on HeyBo website layout
  const getOptimalPosition = () => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Avoid HeyBo's navigation and footer
    const navHeight = document.querySelector('nav')?.offsetHeight || 0;
    const footerHeight = document.querySelector('footer')?.offsetHeight || 0;
    
    return {
      mobile: { bottom: 0, left: 0, right: 0 },
      desktop: { 
        bottom: Math.max(24, footerHeight + 24), 
        right: 24 
      }
    };
  };
  
  // Initialize widget with HeyBo branding
  window.initHeyBoChatbot = function(config = {}) {
    const defaultConfig = {
      apiUrl: config.apiUrl || '/api/chatbot',
      brand: 'heybo',
      colors: {
        primary: '#F97316',
        secondary: '#F59E0B',
        success: '#22C55E'
      },
      position: getOptimalPosition(),
      zIndex: 1000
    };
    
    // Merge with custom config
    const widgetConfig = { ...defaultConfig, ...config };
    
    // Create and inject widget
    createWidgetCSS();
    // ... widget creation logic
  };
  
  // Auto-initialize if config is present
  if (window.heyboChatbotConfig) {
    window.initHeyBoChatbot(window.heyboChatbotConfig);
  }
})();
```

### 11.2 Responsive Integration Strategy

```css
/* Widget responsiveness that adapts to HeyBo website */
.heybo-chatbot-widget {
  /* Base styles that inherit from parent */
  font-family: inherit;
  color: inherit;
  
  /* Responsive behavior */
  @media (max-width: 639px) {
    /* Mobile: Take full screen when active */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background: white;
  }
  
  @media (min-width: 640px) and (max-width: 1023px) {
    /* Tablet: Fixed corner position */
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 360px;
    max-height: 500px;
    z-index: 1000;
  }
  
  @media (min-width: 1024px) {
    /* Desktop: Enhanced corner widget */
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 400px;
    max-height: 600px;
    z-index: 1000;
  }
  
  /* Avoid conflicts with HeyBo's existing modals */
  &[data-mobile-fullscreen="true"] {
    z-index: 10000;
  }
}
```

### 11.3 Performance Optimization

```javascript
// Lazy loading strategy for HeyBo integration
const lazyLoadChatbot = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // User is likely to interact, load chatbot
        loadChatbotAssets();
        observer.disconnect();
      }
    });
  });
  
  // Observe scroll trigger points
  const triggers = document.querySelectorAll('.menu-section, .order-button');
  triggers.forEach(trigger => observer.observe(trigger));
};

// Progressive loading of ML features
const loadMLFeatures = async () => {
  try {
    // Load recommendation engine only when needed
    const { SageMakerRecommendations } = await import('./ml-recommendations.js');
    return new SageMakerRecommendations();
  } catch (error) {
    console.warn('ML features unavailable, using fallback recommendations');
    return null;
  }
};
```

### 11.4 Accessibility Integration

```css
/* Ensure widget respects HeyBo's accessibility standards */
.heybo-chatbot-widget {
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    --heybo-primary: #E65100;
    --heybo-secondary: #F57C00;
    border: 2px solid currentColor;
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* Focus management */
  &[aria-hidden="false"] {
    /* Widget is open, manage focus */
    .heybo-chatbot-input {
      /* Auto-focus for screen readers */
    }
  }
}

/* Screen reader announcements */
.heybo-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 11.5 Component Library Integration

```tsx
// React component example for HeyBo chatbot
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HeyBoChatbotProps {
  className?: string;
  onOrderStart?: () => void;
  onOrderComplete?: (order: any) => void;
  inheritStyles?: boolean;
}

export const HeyBoChatbot: React.FC<HeyBoChatbotProps> = ({
  className,
  onOrderStart,
  onOrderComplete,
  inheritStyles = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Initialize with HeyBo branding
    if (inheritStyles) {
      // Inherit font family and basic colors from parent
      const parentStyles = window.getComputedStyle(document.body);
      // Apply inherited styles to widget
    }
  }, [inheritStyles]);
  
  return (
    <div className={cn('heybo-chatbot-widget', className)}>
      {/* Widget implementation */}
    </div>
  );
};

// Usage in HeyBo website
<HeyBoChatbot 
  onOrderStart={() => console.log('Order started')}
  onOrderComplete={(order) => console.log('Order completed:', order)}
  inheritStyles={true}
/>
```

### 11.6 Widget State Management

```javascript
// Widget state that integrates with HeyBo's existing systems
const createWidgetStore = () => {
  return {
    // UI State
    isOpen: false,
    currentStep: 'welcome',
    selectedLocation: null,
    
    // Order State
    currentBowl: null,
    cart: [],
    
    // Integration State
    userAuthenticated: false,
    heyboPlatformData: null,
    
    // Methods
    toggleWidget() {
      this.isOpen = !this.isOpen;
      
      // Integrate with HeyBo's analytics
      if (window.heyboAnalytics) {
        window.heyboAnalytics.track('chatbot_toggled', {
          state: this.isOpen ? 'opened' : 'closed'
        });
      }
    },
    
    syncWithHeyBoAccount() {
      // Sync with existing HeyBo user session
      if (window.heyboUser) {
        this.userAuthenticated = true;
        this.heyboPlatformData = window.heyboUser;
      }
    }
  };
};
```

---

## 12. Design Tokens

### 12.1 Complete HeyBo Token Reference

```javascript
export const heyboTokens = {
  // Brand Colors
  colors: {
    orange: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316', // Primary
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    yellow: {
      50: '#FEFCE8',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Secondary
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    brown: {
      50: '#FEFDFB',
      100: '#FEF7E6',
      200: '#F5E6D3',
      300: '#E7C4A0',
      400: '#D4956D',
      500: '#A16B47', // Bowl representation
      600: '#8B4513',
      700: '#723A0F',
      800: '#5A2D0C',
      900: '#422209',
    },
    green: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E', // Success/Healthy
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    // Semantic colors for food service
    semantic: {
      success: '#22C55E',      // Fresh, healthy
      warning: '#F59E0B',      // Attention needed
      error: '#DC2626',        // Error states
      info: '#3B82F6',         // Information
      spicy: '#DC2626',        // Spice level indicator
      vegetarian: '#22C55E',   // Dietary indicator
      premium: '#F59E0B',      // Premium ingredients
    },
  },
  
  // Typography - Food Service Optimized
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      display: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '12px',    // Allergen info
      sm: '14px',    // Body text, descriptions
      base: '16px',  // Default
      lg: '18px',    // Large body, ingredients
      xl: '20px',    // Subheadings
      '2xl': '24px', // Category headers
      '3xl': '30px', // Section titles
      '4xl': '36px', // Page titles
      '5xl': '48px', // Hero text
    },
    fontWeight: {
      regular: 400,  // Body text
      medium: 500,   // Buttons, labels
      semibold: 600, // Subheadings
      bold: 700,     // Headings
    },
  },
  
  // Spacing - 8px base for consistency
  spacing: {
    0: '0px',
    1: '4px',     // Tight spacing
    2: '8px',     // Ingredient spacing
    3: '12px',    // Related elements
    4: '16px',    // Default spacing
    5: '20px',    // Medium spacing
    6: '24px',    // Category spacing
    8: '32px',    // Section spacing
    10: '40px',   // Large sections
    12: '48px',   // Hero spacing
    16: '64px',   // Page margins
  },
  
  // Border radius - Friendly and warm
  borderRadius: {
    none: '0px',
    sm: '4px',
    DEFAULT: '8px',   // Default buttons
    md: '12px',      // Cards
    lg: '16px',      // Large cards
    xl: '20px',      // Feature elements
    full: '9999px',  // Pills
  },
  
  // Shadows - Warm and inviting
  boxShadow: {
    xs: '0 1px 2px 0 rgba(249, 115, 22, 0.05)',
    sm: '0 1px 3px 0 rgba(249, 115, 22, 0.1)',
    DEFAULT: '0 4px 6px -1px rgba(249, 115, 22, 0.1)',
    md: '0 4px 12px 0 rgba(249, 115, 22, 0.15)',
    lg: '0 10px 15px -3px rgba(249, 115, 22, 0.1)',
    xl: '0 20px 25px -5px rgba(249, 115, 22, 0.1)',
    warm: '0 8px 30px rgba(249, 115, 22, 0.2)',
  },
  
  // Animation - Natural and appetizing
  animation: {
    duration: {
      instant: '150ms',  // Quick selections
      fast: '200ms',     // Hover states
      normal: '300ms',   // Transitions
      slow: '400ms',     // Complex animations
      slower: '600ms',   // Page changes
    },
    easing: {
      linear: 'linear',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      warm: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      organic: 'cubic-bezier(0.4, 0, 0.2, 1)',
      appetite: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
};
```

---

## Quick Reference Card - HeyBo Edition

### Essential Brand Colors

- **Primary Orange:** `#F97316` (Pantone Orange 021C)
- **Secondary Yellow:** `#F59E0B` (Pantone Yellow C)
- **Success Green:** `#22C55E` (Pantone Green 7482)
- **Bowl Brown:** `#A16B47` (Pantone Brown 7526)
- **Text Dark:** `#292524`
- **Border Warm:** `#E8E5E1`

### Key Spacing (Food Service)

- **Base unit:** 8px
- **Ingredient spacing:** 8px
- **Category spacing:** 24px
- **Section spacing:** 32px
- **Touch targets:** 44px minimum

### Typography

- **Font:** Inter
- **Body size:** 16px desktop, 14px mobile
- **Button size:** 14px all devices
- **Line height:** 1.5 body, 1.2 headings

### Component Specs

- **Button height:** 44px (touch-friendly)
- **Input height:** 48px (prevents zoom)
- **Border radius:** 8px default, 12px cards
- **Focus ring:** 3px solid orange-300

### Breakpoints

- **Mobile:** < 640px (phone ordering)
- **Tablet:** 640px - 1023px (tablet browsing)
- **Desktop:** 1024px+ (kiosk/counter)

### Chatbot-Specific

- **Chat bubble radius:** 18px
- **Message spacing:** 12px
- **Avatar size:** 40px
- **Input height:** 48px

---

**End of Document**

*This design system is specifically crafted for HeyBo's warm grain bowl experience. For implementation support, additional components, or updates to this design system, please contact the HeyBo design team at 1CloudHub.*
