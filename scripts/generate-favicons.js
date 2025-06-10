#!/usr/bin/env node

/**
 * HeyBo Favicon Generator
 * Creates favicons and app icons from the HeyBo logo
 */

const fs = require('fs');
const path = require('path');

// Paths
const publicDir = path.join(__dirname, '../apps/mock-heybo-website/public');
const logoPath = path.join(publicDir, 'brand/heybo-logo.png');

// Create basic favicon.ico placeholder (since we can't easily convert PNG to ICO without external tools)
function createFaviconPlaceholder() {
  const faviconPath = path.join(publicDir, 'favicon.ico');
  
  // Create a simple text file as placeholder - in real project you'd use imagemagick or similar
  const placeholder = `<!-- HeyBo Favicon Placeholder -->
<!-- In production, convert brand/heybo-logo.png to favicon.ico -->
<!-- Use online tools like favicon.io or imagemagick -->`;
  
  fs.writeFileSync(faviconPath.replace('.ico', '-placeholder.txt'), placeholder);
  console.log('📝 Created favicon placeholder instructions');
}

// Create web app manifest
function createWebAppManifest() {
  const manifest = {
    name: "HeyBo - Warm Grain Bowls",
    short_name: "HeyBo",
    description: "Order delicious, customizable warm grain bowls from HeyBo",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F7",
    theme_color: "#F97316",
    icons: [
      {
        src: "/brand/heybo-logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    categories: ["food", "lifestyle"],
    lang: "en-SG",
    orientation: "portrait-primary"
  };
  
  const manifestPath = path.join(publicDir, 'site.webmanifest');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('📱 Created web app manifest');
}

// Create Apple touch icon placeholder
function createAppleTouchIcon() {
  const appleTouchPath = path.join(publicDir, 'apple-touch-icon.png');
  
  // Copy the logo as apple touch icon (in production, you'd resize to 180x180)
  if (fs.existsSync(logoPath)) {
    fs.copyFileSync(logoPath, appleTouchPath);
    console.log('🍎 Created Apple touch icon');
  }
}

// Create different sized favicons (placeholders)
function createFaviconSizes() {
  const sizes = [16, 32, 192, 512];
  
  sizes.forEach(size => {
    const filename = `favicon-${size}x${size}.png`;
    const filepath = path.join(publicDir, filename);
    
    // Copy logo as placeholder (in production, resize to exact dimensions)
    if (fs.existsSync(logoPath)) {
      fs.copyFileSync(logoPath, filepath);
      console.log(`📐 Created ${size}x${size} favicon`);
    }
  });
}

// Main function
function generateFavicons() {
  console.log('🎨 HeyBo Favicon Generator');
  console.log('==========================');
  
  if (!fs.existsSync(logoPath)) {
    console.error('❌ Logo not found. Run fetch-assets.js first.');
    process.exit(1);
  }
  
  createFaviconPlaceholder();
  createWebAppManifest();
  createAppleTouchIcon();
  createFaviconSizes();
  
  console.log('\n✅ Favicons generated successfully!');
  console.log('\n📝 Note: For production, use proper image resizing tools to create');
  console.log('   exact favicon sizes from the HeyBo logo.');
}

// Run the script
generateFavicons();
