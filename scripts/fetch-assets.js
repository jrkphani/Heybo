#!/usr/bin/env node

/**
 * HeyBo Asset Fetcher
 * Downloads brand assets and food images from heybo.sg for development use
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories
const assetsDir = path.join(__dirname, '../apps/mock-heybo-website/public');
const brandDir = path.join(assetsDir, 'brand');
const foodDir = path.join(assetsDir, 'food');

// Ensure directories exist
[assetsDir, brandDir, foodDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Asset URLs from heybo.sg
const assets = {
  brand: {
    'heybo-logo.png': 'https://heybo.sg/wp-content/uploads/2023/06/Heybo-logo.png',
    'heybo-logo-large.png': 'https://heybo.sg/wp-content/uploads/2024/04/HEYBO-LOGO-1024x217.png',
  },
  food: {
    'kampong-table.png': 'https://heybo.sg/wp-content/uploads/2024/06/Kampong-Table.png',
    'spice-trade.png': 'https://heybo.sg/wp-content/uploads/2024/06/Spice-Trade.png',
    'sunday-roast.png': 'https://heybo.sg/wp-content/uploads/2024/06/Sunday-Roast.png',
    'shibuya-nights.png': 'https://heybo.sg/wp-content/uploads/2024/06/Shibuya-Nights.png',
    'gochu-pop.png': 'https://heybo.sg/wp-content/uploads/2024/06/Gochu-Pop.png',
    'muscle-beach.png': 'https://heybo.sg/wp-content/uploads/2024/06/Muscle-Beach.png',
  },
  additional: {
    'allergen-box.png': 'https://heybo.sg/wp-content/uploads/2024/07/HB-allergen-box-new.png',
  }
};

// Download function
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading: ${path.basename(filepath)}`);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        console.log(`❌ Failed to download ${url}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${url}:`, err.message);
      reject(err);
    });
  });
}

// Main download function
async function downloadAssets() {
  console.log('🎨 HeyBo Asset Fetcher');
  console.log('======================');
  
  try {
    // Download brand assets
    console.log('\n📱 Downloading brand assets...');
    for (const [filename, url] of Object.entries(assets.brand)) {
      const filepath = path.join(brandDir, filename);
      await downloadFile(url, filepath);
    }
    
    // Download food images
    console.log('\n🍲 Downloading food images...');
    for (const [filename, url] of Object.entries(assets.food)) {
      const filepath = path.join(foodDir, filename);
      await downloadFile(url, filepath);
    }

    // Download additional assets
    console.log('\n📦 Downloading additional assets...');
    for (const [filename, url] of Object.entries(assets.additional)) {
      const filepath = path.join(assetsDir, filename);
      await downloadFile(url, filepath);
    }
    
    console.log('\n🎉 All assets downloaded successfully!');
    console.log('\n📁 Assets saved to:');
    console.log(`   Brand: ${brandDir}`);
    console.log(`   Food:  ${foodDir}`);
    
  } catch (error) {
    console.error('\n❌ Error downloading assets:', error.message);
    process.exit(1);
  }
}

// Run the script
downloadAssets();
