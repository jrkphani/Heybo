# HeyBo + LULU Combined Logo

## Overview

The HeyBo + LULU combined logo represents the official branding for the HeyBo AI chatbot assistant. It combines the authentic HeyBo logo with the "LULU" text to create a cohesive brand identity for the chatbot widget. LULU is the friendly AI assistant that helps customers create their perfect warm grain bowl experience.

## Design Concept

The LULU icon is designed to:
- **Represent the "O" from HeyBo** - Maintaining brand consistency
- **Evoke a warm grain bowl** - Circular shape with layered depth
- **Feel approachable and friendly** - Soft gradients and warm colors
- **Work at multiple sizes** - From 16px favicon to 64px hero icons

## Icon Variants

### 1. Logo (Dark Backgrounds)
```tsx
<LuluIcon variant="logo" size="auto" className="h-6" />
```
- **Usage**: Chat headers, dark backgrounds, primary branding
- **Features**: Official LULU text logo in light color (#FFFCF8)
- **Best for**: Headers, dark themed interfaces

### 2. Logo Contrast (Light Backgrounds)
```tsx
<LuluIcon variant="logo-contrast" size="auto" className="h-6" />
```
- **Usage**: Welcome screens, light backgrounds, authentication flows
- **Features**: High contrast LULU text logo in dark color (#572021)
- **Best for**: Light backgrounds, welcome screens, forms

### 3. Gradient (Default)
```tsx
<LuluIcon variant="gradient" size={32} />
```
- **Usage**: Primary chatbot widget button, hero sections
- **Features**: Full gradient with depth, highlights, and grain center
- **Best for**: Larger sizes (24px+)

### 4. Outline
```tsx
<LuluIcon variant="outline" size={24} />
```
- **Usage**: Header icons, secondary buttons, light backgrounds
- **Features**: Clean outline style, minimal detail
- **Best for**: Small to medium sizes (16px-32px)

### 5. Solid
```tsx
<LuluIcon variant="solid" size={20} />
```
- **Usage**: Monochrome contexts, print materials
- **Features**: Single color fill with subtle highlight
- **Best for**: Any size, high contrast needed

### 6. Default
```tsx
<LuluIcon size={24} />
```
- **Usage**: General purpose, balanced detail
- **Features**: Moderate detail level, good for most contexts
- **Best for**: Medium sizes (20px-40px)

## Size Presets

Convenient size presets are available:

```tsx
import { 
  LuluIconSmall,    // 16px
  LuluIconMedium,   // 24px  
  LuluIconLarge,    // 32px
  LuluIconXL,       // 48px
  LuluIconHero      // 64px
} from './LuluIcon';

// Usage
<LuluIconSmall variant="outline" />
<LuluIconHero variant="gradient" />
```

## Color Palette

The LULU icon uses HeyBo's brand colors:

- **Primary Orange**: `#F97316` - Main brand color
- **Secondary Orange**: `#EA580C` - Darker accent
- **Accent Yellow**: `#F59E0B` - Warm highlight
- **Bowl Brown**: `#A16B47` - Grain/ingredient representation
- **Light Cream**: `#FED7AA`, `#FDBA74` - Inner bowl colors
- **Highlight**: `#FFF7ED` - Subtle depth highlight

## Usage Guidelines

### ✅ Do
- Use for HeyBo chatbot widget identification
- Maintain aspect ratio (always square)
- Use appropriate variant for context
- Ensure sufficient contrast with background
- Use consistent sizing within the same interface

### ❌ Don't
- Stretch or distort the icon
- Change the color scheme outside brand guidelines
- Use as a generic "chat" icon for other brands
- Make smaller than 16px (readability issues)
- Overlay text directly on the icon

## Technical Implementation

### SVG Structure
The icon is built with:
- **Outer circle**: Main brand gradient
- **Inner circle**: Bowl interior with lighter tones
- **Center dot**: Grain/ingredient representation
- **Highlight ellipse**: Depth and dimension

### Accessibility
- Includes proper ARIA labels
- Maintains contrast ratios
- Scalable for different screen densities
- Works with screen readers

## File Locations

- **Component**: `src/components/icons/LuluIcon.tsx`
- **Favicon**: `public/favicon.svg`
- **Standalone SVG**: `public/lulu-icon.svg`

## Integration Examples

### Chatbot Widget Button
```tsx
<button aria-label="Open LULU - HeyBo Assistant">
  <LuluIcon variant="gradient" size={32} />
</button>
```

### Header Icon
```tsx
<div className="flex items-center space-x-2">
  <LuluIcon variant="outline" size={24} />
  <span>LULU - HeyBo Assistant</span>
</div>
```

### Loading State
```tsx
<div className="animate-pulse">
  <LuluIcon variant="solid" size={20} className="opacity-50" />
</div>
```

## Brand Consistency

The LULU icon maintains consistency with HeyBo's brand by:
- Using the official color palette
- Reflecting the circular, bowl-like brand elements
- Maintaining the warm, approachable brand personality
- Integrating seamlessly with existing HeyBo visual identity

---

*LULU represents the friendly, intelligent assistant that helps customers create their perfect warm grain bowl experience at HeyBo.*
