#!/usr/bin/env node

/**
 * HeyBo Chatbot Development Troubleshooting Script
 * Helps diagnose and fix common development issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 HeyBo Chatbot Development Troubleshoot\n');

// Check Node.js version
console.log('📋 System Check:');
const nodeVersion = process.version;
console.log(`   Node.js: ${nodeVersion}`);

if (parseInt(nodeVersion.slice(1)) < 20) {
  console.log('   ⚠️  Warning: Node.js 20+ recommended for Next.js 15');
}

// Check package.json dependencies
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(`   Next.js: ${pkg.dependencies.next}`);
  console.log(`   React: ${pkg.dependencies.react}`);
  console.log(`   TypeScript: ${pkg.devDependencies.typescript}`);
}

// Check for common issues
console.log('\n🔍 Issue Detection:');

// Check for port conflicts
try {
  execSync('lsof -ti:3000', { stdio: 'pipe' });
  console.log('   ⚠️  Port 3000 is in use');
  console.log('      Run: kill -9 $(lsof -ti:3000) to free it');
} catch {
  console.log('   ✅ Port 3000 is available');
}

// Check .next cache
const nextCachePath = path.join(__dirname, '..', '.next');
if (fs.existsSync(nextCachePath)) {
  console.log('   ⚠️  .next cache exists');
  console.log('      Consider: rm -rf .next to clear cache');
} else {
  console.log('   ✅ No .next cache found');
}

// Check node_modules
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ node_modules exists');
} else {
  console.log('   ❌ node_modules missing - run npm install');
}

// Solutions for common errors
console.log('\n🛠️  Common Solutions:');
console.log('   RSC Payload Errors:');
console.log('     • Clear .next cache: rm -rf .next');
console.log('     • Restart dev server: npm run dev');
console.log('     • Check browser console for details');

console.log('\n   Font Loading Errors:');
console.log('     • Clear browser cache');
console.log('     • Check network connectivity');
console.log('     • Verify font imports in layout.tsx');

console.log('\n   Network Errors:');
console.log('     • Check if development server is running');
console.log('     • Verify API routes are accessible');
console.log('     • Check browser network tab for failed requests');

console.log('\n🚀 Quick Fix Commands:');
console.log('   npm run dev:clean    # Clean restart');
console.log('   npm run dev:debug    # Debug mode');
console.log('   npm run type-check   # Check TypeScript');

console.log('\n✨ All checks complete!');
