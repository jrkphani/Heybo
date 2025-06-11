#!/usr/bin/env node

/**
 * HeyBo Chatbot Build Performance Analyzer
 * Analyzes what's causing slow compilation times
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 HeyBo Chatbot Build Performance Analysis');
console.log('============================================');

const projectRoot = process.cwd();

// Analyze package.json dependencies
function analyzeDependencies() {
  console.log('\n📦 Dependency Analysis:');
  
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const heavyDeps = [
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu', 
    '@tanstack/react-query',
    '@trpc/client',
    'framer-motion',
    'next',
    'react',
    'tailwindcss'
  ];
  
  console.log('   Heavy dependencies found:');
  heavyDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`   ✓ ${dep}: ${deps[dep]}`);
    }
  });
}

// Analyze file structure
function analyzeFileStructure() {
  console.log('\n📁 File Structure Analysis:');
  
  const srcDir = path.join(projectRoot, 'src');
  if (!fs.existsSync(srcDir)) {
    console.log('   ⚠️  src directory not found');
    return;
  }
  
  let totalFiles = 0;
  let totalSize = 0;
  
  function walkDir(dir, depth = 0) {
    if (depth > 3) return; // Limit recursion
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        walkDir(filePath, depth + 1);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        totalFiles++;
        totalSize += stat.size;
      }
    });
  }
  
  walkDir(srcDir);
  
  console.log(`   Total TypeScript files: ${totalFiles}`);
  console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (totalFiles > 100) {
    console.log('   ⚠️  Large number of files may slow compilation');
  }
}

// Check for performance issues
function checkPerformanceIssues() {
  console.log('\n⚡ Performance Issues Check:');
  
  // Check for large CSS files
  const cssFiles = [
    'src/styles/heybo-design-tokens.css',
    'src/app/globals.css'
  ];
  
  cssFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      const sizeKB = (stat.size / 1024).toFixed(2);
      console.log(`   ${file}: ${sizeKB} KB`);
      
      if (stat.size > 50000) { // 50KB
        console.log(`   ⚠️  Large CSS file detected: ${file}`);
      }
    }
  });
  
  // Check for demo page complexity
  const demoPagePath = path.join(projectRoot, 'src/app/demo/page.tsx');
  if (fs.existsSync(demoPagePath)) {
    const stat = fs.statSync(demoPagePath);
    const sizeKB = (stat.size / 1024).toFixed(2);
    console.log(`   Demo page: ${sizeKB} KB`);
    
    if (stat.size > 20000) { // 20KB
      console.log('   ⚠️  Large demo page may slow compilation');
    }
  }
}

// Provide recommendations
function provideRecommendations() {
  console.log('\n💡 Performance Recommendations:');
  console.log('   1. Use `npm run dev:fast` for faster development');
  console.log('   2. Run `npm run dev:optimize` to clear caches');
  console.log('   3. Consider code splitting for large components');
  console.log('   4. Use dynamic imports for heavy dependencies');
  console.log('   5. Disable unnecessary Next.js features in development');
  
  console.log('\n🚀 Quick Fixes:');
  console.log('   - NEXT_TELEMETRY_DISABLED=1 (already applied)');
  console.log('   - Increased Node.js memory limit (already applied)');
  console.log('   - TypeScript incremental compilation (already applied)');
  console.log('   - Optimized webpack config (already applied)');
}

// Run analysis
analyzeDependencies();
analyzeFileStructure();
checkPerformanceIssues();
provideRecommendations();

console.log('\n✅ Analysis complete!');
