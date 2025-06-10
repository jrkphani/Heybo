#!/usr/bin/env node

/**
 * HeyBo Design System Compliance Validation Script
 * 
 * This script validates that all components follow HeyBo Design System guidelines:
 * 1. No hardcoded orange colors (use design tokens)
 * 2. Proper CSS namespacing with .heybo-chatbot- prefix
 * 3. Correct typography usage
 * 4. Proper spacing system compliance
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const COMPONENT_DIRS = [
  'src/components/**/*.tsx',
  'src/components/**/*.ts'
];

const VIOLATIONS = {
  HARDCODED_COLORS: [],
  MISSING_NAMESPACING: [],
  INCORRECT_TYPOGRAPHY: [],
  SPACING_VIOLATIONS: []
};

// Patterns to detect violations
const PATTERNS = {
  // Hardcoded orange colors
  HARDCODED_ORANGE: [
    /text-orange-\d+/g,
    /bg-orange-\d+/g,
    /border-orange-\d+/g,
    /hover:text-orange-\d+/g,
    /hover:bg-orange-\d+/g,
    /hover:border-orange-\d+/g
  ],
  
  // Missing HeyBo namespacing
  MISSING_NAMESPACE: /className=["'][^"']*(?!.*heybo-chatbot-)/g,
  
  // Incorrect typography (arbitrary sizes)
  ARBITRARY_TEXT_SIZE: /text-\[\d+px\]/g,
  
  // Non-8px spacing
  ARBITRARY_SPACING: /[pm]-\[\d+px\]/g
};

// HeyBo compliant alternatives
const COMPLIANT_ALTERNATIVES = {
  'text-orange-600': 'heybo-text-primary-600',
  'text-orange-700': 'heybo-text-primary-700',
  'bg-orange-500': 'heybo-bg-primary-500',
  'bg-orange-600': 'heybo-bg-primary-600',
  'border-orange-300': 'heybo-border-primary-300',
  'border-orange-400': 'heybo-border-primary-400',
  'border-orange-500': 'heybo-border-primary-500',
  'hover:text-orange-700': 'heybo-hover-text-primary-700',
  'hover:bg-orange-700': 'heybo-hover-bg-primary-700',
  'hover:border-orange-300': 'heybo-hover-border-primary-300',
  'hover:border-orange-400': 'heybo-hover-border-primary-400'
};

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  console.log(`\n🔍 Validating: ${relativePath}`);
  
  let hasViolations = false;
  
  // Check for hardcoded orange colors
  PATTERNS.HARDCODED_ORANGE.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      hasViolations = true;
      matches.forEach(match => {
        VIOLATIONS.HARDCODED_COLORS.push({
          file: relativePath,
          violation: match,
          suggestion: COMPLIANT_ALTERNATIVES[match] || 'Use HeyBo design token'
        });
        console.log(`  ❌ Hardcoded color: ${match}`);
      });
    }
  });
  
  // Check for missing namespacing in main component containers
  if (content.includes('export function') || content.includes('export const')) {
    const hasNamespacing = content.includes('heybo-chatbot-');
    if (!hasNamespacing) {
      hasViolations = true;
      VIOLATIONS.MISSING_NAMESPACING.push({
        file: relativePath,
        violation: 'Missing .heybo-chatbot- namespace',
        suggestion: 'Add .heybo-chatbot-[component-name] class to root element'
      });
      console.log(`  ❌ Missing CSS namespacing`);
    }
  }
  
  // Check for arbitrary text sizes
  const arbitraryTextMatches = content.match(PATTERNS.ARBITRARY_TEXT_SIZE);
  if (arbitraryTextMatches) {
    hasViolations = true;
    arbitraryTextMatches.forEach(match => {
      VIOLATIONS.INCORRECT_TYPOGRAPHY.push({
        file: relativePath,
        violation: match,
        suggestion: 'Use HeyBo typography scale (text-sm, text-base, text-lg, etc.)'
      });
      console.log(`  ❌ Arbitrary text size: ${match}`);
    });
  }
  
  // Check for arbitrary spacing
  const arbitrarySpacingMatches = content.match(PATTERNS.ARBITRARY_SPACING);
  if (arbitrarySpacingMatches) {
    hasViolations = true;
    arbitrarySpacingMatches.forEach(match => {
      VIOLATIONS.SPACING_VIOLATIONS.push({
        file: relativePath,
        violation: match,
        suggestion: 'Use 8px grid system (p-2, p-4, p-6, etc.)'
      });
      console.log(`  ❌ Arbitrary spacing: ${match}`);
    });
  }
  
  if (!hasViolations) {
    console.log(`  ✅ No violations found`);
  }
  
  return hasViolations;
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('🚨 HEYBO DESIGN SYSTEM COMPLIANCE REPORT');
  console.log('='.repeat(80));
  
  const totalViolations = 
    VIOLATIONS.HARDCODED_COLORS.length +
    VIOLATIONS.MISSING_NAMESPACING.length +
    VIOLATIONS.INCORRECT_TYPOGRAPHY.length +
    VIOLATIONS.SPACING_VIOLATIONS.length;
  
  if (totalViolations === 0) {
    console.log('\n🎉 ALL COMPONENTS ARE COMPLIANT! 🎉');
    console.log('✅ No design system violations found.');
    return true;
  }
  
  console.log(`\n📊 SUMMARY: ${totalViolations} violations found\n`);
  
  // Hardcoded Colors Report
  if (VIOLATIONS.HARDCODED_COLORS.length > 0) {
    console.log(`❌ HARDCODED COLORS (${VIOLATIONS.HARDCODED_COLORS.length} violations):`);
    VIOLATIONS.HARDCODED_COLORS.forEach(v => {
      console.log(`   ${v.file}: ${v.violation} → ${v.suggestion}`);
    });
    console.log('');
  }
  
  // Missing Namespacing Report
  if (VIOLATIONS.MISSING_NAMESPACING.length > 0) {
    console.log(`❌ MISSING NAMESPACING (${VIOLATIONS.MISSING_NAMESPACING.length} violations):`);
    VIOLATIONS.MISSING_NAMESPACING.forEach(v => {
      console.log(`   ${v.file}: ${v.violation}`);
      console.log(`   → ${v.suggestion}`);
    });
    console.log('');
  }
  
  // Typography Report
  if (VIOLATIONS.INCORRECT_TYPOGRAPHY.length > 0) {
    console.log(`❌ TYPOGRAPHY VIOLATIONS (${VIOLATIONS.INCORRECT_TYPOGRAPHY.length} violations):`);
    VIOLATIONS.INCORRECT_TYPOGRAPHY.forEach(v => {
      console.log(`   ${v.file}: ${v.violation} → ${v.suggestion}`);
    });
    console.log('');
  }
  
  // Spacing Report
  if (VIOLATIONS.SPACING_VIOLATIONS.length > 0) {
    console.log(`❌ SPACING VIOLATIONS (${VIOLATIONS.SPACING_VIOLATIONS.length} violations):`);
    VIOLATIONS.SPACING_VIOLATIONS.forEach(v => {
      console.log(`   ${v.file}: ${v.violation} → ${v.suggestion}`);
    });
    console.log('');
  }
  
  console.log('🛠️  FIX RECOMMENDATIONS:');
  console.log('1. Replace hardcoded colors with HeyBo design tokens');
  console.log('2. Add .heybo-chatbot- namespace to all component root elements');
  console.log('3. Use HeyBo typography scale instead of arbitrary sizes');
  console.log('4. Follow 8px grid system for spacing');
  console.log('\n📚 See: docs/HeyBo Design System Compliance Checklist.md');
  
  return false;
}

// Main execution
function main() {
  console.log('🔍 HeyBo Design System Compliance Validator');
  console.log('Checking components for design system violations...\n');
  
  const componentFiles = [];
  COMPONENT_DIRS.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    componentFiles.push(...files);
  });
  
  console.log(`Found ${componentFiles.length} component files to validate`);
  
  let hasAnyViolations = false;
  componentFiles.forEach(file => {
    const hasViolations = validateFile(file);
    if (hasViolations) {
      hasAnyViolations = true;
    }
  });
  
  const isCompliant = generateReport();
  
  if (!isCompliant) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateFile, generateReport, VIOLATIONS };
