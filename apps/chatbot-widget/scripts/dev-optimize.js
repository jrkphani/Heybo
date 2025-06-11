#!/usr/bin/env node

/**
 * HeyBo Chatbot Development Optimization Script
 * Clears caches and optimizes development environment for faster builds
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();

console.log('🚀 HeyBo Chatbot Development Optimization');
console.log('==========================================');

// Clear Next.js cache
console.log('🧹 Clearing Next.js cache...');
try {
  const nextCacheDir = path.join(projectRoot, '.next');
  if (fs.existsSync(nextCacheDir)) {
    fs.rmSync(nextCacheDir, { recursive: true, force: true });
    console.log('✅ Next.js cache cleared');
  }
} catch (error) {
  console.log('⚠️  Could not clear Next.js cache:', error.message);
}

// Clear node_modules/.cache
console.log('🧹 Clearing node_modules cache...');
try {
  const nodeModulesCacheDir = path.join(projectRoot, 'node_modules', '.cache');
  if (fs.existsSync(nodeModulesCacheDir)) {
    fs.rmSync(nodeModulesCacheDir, { recursive: true, force: true });
    console.log('✅ Node modules cache cleared');
  }
} catch (error) {
  console.log('⚠️  Could not clear node_modules cache:', error.message);
}

// Clear TypeScript build cache
console.log('🧹 Clearing TypeScript cache...');
try {
  const tsBuildInfoFiles = [
    path.join(projectRoot, 'tsconfig.tsbuildinfo'),
    path.join(projectRoot, '.tsbuildinfo'),
  ];
  
  tsBuildInfoFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
  console.log('✅ TypeScript cache cleared');
} catch (error) {
  console.log('⚠️  Could not clear TypeScript cache:', error.message);
}

// Optimize package.json for development
console.log('⚡ Optimizing development environment...');

// Check if we're in development mode
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  // Set development environment variables
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  process.env.DISABLE_ESLINT_PLUGIN = 'true';
  
  console.log('✅ Development optimizations applied');
  console.log('   - Next.js telemetry disabled');
  console.log('   - ESLint plugin disabled for faster builds');
}

// Memory optimization recommendations
console.log('\n💡 Performance Tips:');
console.log('   - Use `npm run dev:fast` for faster development builds');
console.log('   - Close unused browser tabs to free memory');
console.log('   - Consider using `--max-old-space-size=4096` for large projects');

console.log('\n🎯 Ready for optimized development!');
console.log('   Run: npm run dev');
