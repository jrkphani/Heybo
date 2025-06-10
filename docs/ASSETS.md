# HeyBo Brand Assets Documentation

This document outlines the brand assets and media files used in the HeyBo chatbot development environment.

## 📁 Asset Structure

```
apps/chatbot-widget/public/
├── brand/                    # Brand assets
│   ├── heybo-logo.png       # Main HeyBo logo
│   └── heybo-logo-large.png # Large version logo
├── food/                    # Food images
│   ├── kampong-table.png    # Signature bowl
│   ├── spice-trade.png      # Signature bowl
│   ├── sunday-roast.png     # Signature bowl
│   ├── shibuya-nights.png   # Signature bowl
│   ├── gochu-pop.png        # Signature bowl
│   └── muscle-beach.png     # Signature bowl
├── favicon-16x16.png        # Generated favicon
├── favicon-32x32.png        # Generated favicon
├── favicon-192x192.png      # Generated favicon
├── favicon-512x512.png      # Generated favicon
├── apple-touch-icon.png     # Apple touch icon
├── site.webmanifest         # Web app manifest
└── allergen-box.png         # Additional UI asset
```

## 🎨 Brand Assets

### Logos
- **Primary Logo**: `/brand/heybo-logo.png`
  - Source: https://heybo.sg/wp-content/uploads/2023/06/Heybo-logo.png
  - Usage: Header, footer, general branding
  
- **Large Logo**: `/brand/heybo-logo-large.png`
  - Source: https://heybo.sg/wp-content/uploads/2024/04/HEYBO-LOGO-1024x217.png
  - Usage: Hero sections, large displays

### Favicons
Generated from the main HeyBo logo:
- 16x16, 32x32, 192x192, 512x512 pixel versions
- Apple touch icon (180x180)
- Web app manifest for PWA support

## 🍲 Food Images

All signature bowl images sourced from heybo.sg:

### Kampong Table
- **File**: `/food/kampong-table.png`
- **Description**: Roasted lemongrass chicken, mixed grains, basil tofu, onsen egg
- **Calories**: 1048 kcal
- **Source**: https://heybo.sg/wp-content/uploads/2024/06/Kampong-Table.png

### Spice Trade
- **File**: `/food/spice-trade.png`
- **Description**: Falafels, cauliflower lentil rice, fried eggplant, spiced chickpeas
- **Calories**: 661 kcal
- **Source**: https://heybo.sg/wp-content/uploads/2024/06/Spice-Trade.png

### Sunday Roast
- **File**: `/food/sunday-roast.png`
- **Description**: Char-grilled steak, tri-colour quinoa, roasted pumpkin wedge
- **Calories**: 785 kcal
- **Source**: https://heybo.sg/wp-content/uploads/2024/06/Sunday-Roast.png

### Shibuya Nights
- **File**: `/food/shibuya-nights.png`
- **Description**: Baked salmon, green soba, onsen egg, grilled mushrooms
- **Calories**: 592 kcal
- **Source**: https://heybo.sg/wp-content/uploads/2024/06/Shibuya-Nights.png

### Gochu-Pop
- **File**: `/food/gochu-pop.png`
- **Description**: Sweet potato noodles, gochujang chicken, charred corn
- **Calories**: 768 kcal
- **Source**: https://heybo.sg/wp-content/uploads/2024/06/Gochu-Pop.png

### Muscle Beach
- **File**: `/food/muscle-beach.png`
- **Description**: Sous-vide chicken breast, tri-colour quinoa, charred broccoli
- **Calories**: 814 kcal
- **Source**: https://heybo.sg/wp-content/uploads/2024/06/Muscle-Beach.png

## 🛠️ Asset Management Scripts

### Fetch Assets Script
```bash
node scripts/fetch-assets.js
```
- Downloads all brand and food assets from heybo.sg
- Organizes files into appropriate directories
- Handles errors and provides progress feedback

### Generate Favicons Script
```bash
node scripts/generate-favicons.js
```
- Creates favicons from the main HeyBo logo
- Generates web app manifest
- Creates Apple touch icons

## 📝 Usage Guidelines

### In Components
```tsx
import Image from 'next/image'

// Brand logo
<Image
  src="/brand/heybo-logo.png"
  alt="HeyBo"
  width={120}
  height={40}
  className="h-8 w-auto"
/>

// Food images
<Image
  src="/food/kampong-table.png"
  alt="Kampong Table Bowl"
  width={400}
  height={300}
  className="w-full h-full object-cover"
/>
```

### Optimization
- All images are optimized by Next.js Image component
- WebP format served when supported
- Responsive sizing based on device capabilities
- Lazy loading for performance

## 🔄 Updating Assets

To update assets from the HeyBo website:

1. **Run the fetch script**:
   ```bash
   node scripts/fetch-assets.js
   ```

2. **Regenerate favicons** (if logo changed):
   ```bash
   node scripts/generate-favicons.js
   ```

3. **Commit changes**:
   ```bash
   git add apps/chatbot-widget/public/
   git commit -m "update: refresh HeyBo brand assets"
   ```

## ⚖️ Legal Considerations

- Assets are used for development purposes only
- All images remain property of HeyBo Singapore
- Not for commercial redistribution
- Remove assets if requested by HeyBo

## 🎯 Next Steps

- [ ] Add more seasonal bowl images when available
- [ ] Include beverage and side dish images
- [ ] Create ingredient-specific imagery
- [ ] Add promotional banner assets
- [ ] Generate different logo variations (dark mode, etc.)
