# HeyBo Brand Components

## Overview

This directory contains reusable brand components for the HeyBo chatbot widget. All components use authentic HeyBo assets from the official website and CDN, ensuring consistent branding across the entire application.

## Components

### 1. HeyBoLogo

Reusable HeyBo logo component with multiple variants and themes.

```tsx
import { HeyBoLogo } from './brand/HeyBoAssets';

// Website logo (high-quality PNG)
<HeyBoLogo variant="website" size="lg" theme="light" />

// Header logo (optimized SVG)
<HeyBoLogo variant="header" size="md" theme="dark" />
```

**Props:**
- `variant`: `'website' | 'header'` - Logo type
- `size`: `'sm' | 'md' | 'lg' | 'xl'` - Size preset
- `theme`: `'light' | 'dark' | 'auto'` - Color theme
- `className`: Additional CSS classes
- `alt`: Alt text for accessibility

### 2. HeyBoIcon

Optimized icon component for buttons and small UI elements.

```tsx
import { HeyBoIcon } from './brand/HeyBoAssets';

// FAB button icon
<HeyBoIcon size={32} theme="dark" />

// Small navigation icon
<HeyBoIcon size={16} theme="auto" />
```

**Props:**
- `size`: `number | string` - Icon size in pixels
- `theme`: `'light' | 'dark' | 'auto'` - Color theme
- `className`: Additional CSS classes
- `alt`: Alt text for accessibility

### 3. LuluText

LULU text component with brand-compliant typography.

```tsx
import { LuluText } from './brand/HeyBoAssets';

// Dark background
<LuluText size="lg" theme="dark" />

// Light background
<LuluText size="md" theme="light" />
```

**Props:**
- `size`: `'sm' | 'md' | 'lg' | 'xl'` - Text size
- `theme`: `'light' | 'dark'` - Color theme
- `className`: Additional CSS classes

**Typography Specifications:**
- Font Family: Inter
- Font Weight: 600
- Letter Spacing: -0.03em
- Colors: #FFFCF8 (dark theme), #572021 (light theme)

### 4. HeyBoLuluBrand

Combined HeyBo logo + LULU text component for official branding.

```tsx
import { HeyBoLuluBrand } from './brand/HeyBoAssets';

// Chat header
<HeyBoLuluBrand 
  logoVariant="header"
  size="sm" 
  theme="dark" 
  spacing="normal"
/>

// Welcome screen
<HeyBoLuluBrand 
  logoVariant="website"
  size="lg" 
  theme="light" 
  spacing="normal"
/>
```

**Props:**
- `logoVariant`: `'website' | 'header'` - Logo type to use
- `size`: `'sm' | 'md' | 'lg' | 'xl'` - Overall size
- `theme`: `'light' | 'dark'` - Color theme
- `spacing`: `'tight' | 'normal' | 'loose'` - Space between logo and text
- `className`: Additional CSS classes

## Asset URLs

All assets are centralized in the `HEYBO_ASSETS` constant:

```tsx
import { HEYBO_ASSETS } from './brand/HeyBoAssets';

// Access asset URLs directly if needed
const websiteLogo = HEYBO_ASSETS.logos.website;
const headerLogo = HEYBO_ASSETS.logos.header;
const favicon = HEYBO_ASSETS.favicon;
```

**Asset Sources:**
- Website Logo: `https://heybo.sg/wp-content/uploads/2023/06/Heybo-logo.png`
- Header Logo: `https://d1cz3dbw9lrv6.cloudfront.net/static/media/logo-header.995a0bcfebba1f72f6d587fb23d63ec8.svg`
- Favicon: `https://d1cz3dbw9lrv6.cloudfront.net/favicon.png`

## Convenience Components

Pre-configured components for common use cases:

```tsx
import { 
  HeyBoLogoSmall,
  HeyBoLogoMedium,
  HeyBoLogoLarge,
  HeyBoIconSmall,
  HeyBoIconMedium,
  HeyBoIconLarge,
  HeyBoLuluBrandDark,
  HeyBoLuluBrandLight
} from './brand/HeyBoAssets';

// Quick usage
<HeyBoLogoSmall variant="header" theme="dark" />
<HeyBoIconLarge theme="light" />
<HeyBoLuluBrandDark size="md" />
```

## Theme System

### Auto Theme
Components automatically adapt to their context when `theme="auto"` is used.

### Dark Theme
- Uses light colors (#FFFCF8) for visibility on dark backgrounds
- Applies `filter: brightness(0) invert(1)` to logos
- Perfect for chat headers, dark buttons

### Light Theme
- Uses dark colors (#572021) for contrast on light backgrounds
- No filter applied to logos
- Ideal for welcome screens, forms, light interfaces

## Best Practices

### 1. Use Appropriate Variants
- **Website Logo**: High-quality PNG for detailed displays
- **Header Logo**: Optimized SVG for icons and headers

### 2. Choose Correct Sizes
- **sm**: Navigation, compact headers
- **md**: Standard headers, cards
- **lg**: Welcome screens, hero sections
- **xl**: Landing pages, large displays

### 3. Theme Consistency
- Always specify theme for predictable results
- Use `dark` theme on colored backgrounds
- Use `light` theme on white/light backgrounds

### 4. Performance
- Components load assets from CDN for optimal performance
- SVG assets scale without quality loss
- PNG assets provide high-quality rendering

## Integration Examples

### Chatbot FAB Button
```tsx
<button className="chatbot-fab">
  <HeyBoIcon size={32} theme="dark" />
</button>
```

### Chat Header
```tsx
<header className="chat-header">
  <HeyBoLuluBrand 
    logoVariant="header"
    size="sm" 
    theme="dark" 
  />
</header>
```

### Welcome Screen
```tsx
<div className="welcome-screen">
  <HeyBoLuluBrand 
    logoVariant="website"
    size="lg" 
    theme="light" 
  />
  <h1>Welcome to HeyBo!</h1>
</div>
```

## Maintenance

### Updating Assets
To update brand assets, modify the `HEYBO_ASSETS` constant in `HeyBoAssets.tsx`. All components will automatically use the new assets.

### Adding New Variants
1. Add new asset URL to `HEYBO_ASSETS`
2. Update component prop types
3. Add handling in component logic
4. Update documentation

This centralized approach ensures consistent branding and makes maintenance simple across the entire application.
