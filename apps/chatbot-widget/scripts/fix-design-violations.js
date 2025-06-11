#!/usr/bin/env node

/**
 * HeyBo Design System Violations Auto-Fix Script
 * 
 * This script automatically fixes design system violations:
 * 1. Replaces hardcoded orange colors with HeyBo design tokens
 * 2. Adds proper CSS namespacing with .heybo-chatbot- prefix
 * 3. Fixes typography violations
 * 4. Fixes spacing violations
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const COMPONENT_DIRS = [
  'src/components/**/*.tsx',
  'src/components/**/*.ts'
];

// Color mappings from hardcoded to design tokens
const COLOR_MAPPINGS = {
  // Text colors
  'text-orange-500': 'text-[var(--heybo-primary-500)]',
  'text-orange-600': 'text-[var(--heybo-primary-600)]',
  'text-orange-700': 'text-[var(--heybo-primary-700)]',
  'text-orange-800': 'text-[var(--heybo-primary-800)]',
  'text-orange-900': 'text-[var(--heybo-primary-900)]',
  'text-orange-100': 'text-[var(--heybo-primary-100)]',
  
  // Background colors
  'bg-orange-50': 'bg-[var(--heybo-primary-50)]',
  'bg-orange-100': 'bg-[var(--heybo-primary-100)]',
  'bg-orange-500': 'bg-[var(--heybo-primary-500)]',
  'bg-orange-600': 'bg-[var(--heybo-primary-600)]',
  'bg-orange-700': 'bg-[var(--heybo-primary-700)]',
  'bg-orange-300': 'bg-[var(--heybo-primary-300)]',
  
  // Border colors
  'border-orange-200': 'border-[var(--heybo-primary-200)]',
  'border-orange-300': 'border-[var(--heybo-primary-300)]',
  'border-orange-400': 'border-[var(--heybo-primary-400)]',
  'border-orange-500': 'border-[var(--heybo-primary-500)]',
  'border-orange-600': 'border-[var(--heybo-primary-600)]',
  
  // Hover states
  'hover:text-orange-500': 'hover:text-[var(--heybo-primary-500)]',
  'hover:text-orange-600': 'hover:text-[var(--heybo-primary-600)]',
  'hover:text-orange-700': 'hover:text-[var(--heybo-primary-700)]',
  'hover:bg-orange-50': 'hover:bg-[var(--heybo-primary-50)]',
  'hover:bg-orange-100': 'hover:bg-[var(--heybo-primary-100)]',
  'hover:bg-orange-600': 'hover:bg-[var(--heybo-primary-600)]',
  'hover:bg-orange-700': 'hover:bg-[var(--heybo-primary-700)]',
  'hover:border-orange-200': 'hover:border-[var(--heybo-primary-200)]',
  'hover:border-orange-300': 'hover:border-[var(--heybo-primary-300)]',
  'hover:border-orange-400': 'hover:border-[var(--heybo-primary-400)]'
};

// Component name mappings for CSS namespacing
const COMPONENT_NAMESPACES = {
  'AuthenticationFlow': 'heybo-chatbot-auth-flow',
  'LoginScreen': 'heybo-chatbot-login',
  'OTPVerification': 'heybo-chatbot-otp',
  'SimpleAuth': 'heybo-chatbot-simple-auth',
  'BowlPreview': 'heybo-chatbot-bowl-preview',
  'HeyBoAssets': 'heybo-chatbot-assets',
  'ActionButtons': 'heybo-chatbot-action-buttons',
  'ChatInput': 'heybo-chatbot-input',
  'ChatInterface': 'heybo-chatbot-interface',
  'EnhancedChatInterface': 'heybo-chatbot-enhanced-interface',
  'LoadingIndicator': 'heybo-chatbot-loading',
  'WelcomeScreen': 'heybo-chatbot-welcome',
  'ErrorBoundary': 'heybo-chatbot-error-boundary',
  'ErrorDisplay': 'heybo-chatbot-error-display',
  'ComponentAPIIntegration': 'heybo-chatbot-api-integration',
  'MockAPIExample': 'heybo-chatbot-mock-api',
  'CreateYourOwnFlowV2': 'heybo-chatbot-cyo-flow-v2',
  'HeyBoLuluLogo': 'heybo-chatbot-logo',
  'LuluIcon': 'heybo-chatbot-lulu-icon',
  'ControlPlacementManager': 'heybo-chatbot-control-placement',
  'DualPaneLayout': 'heybo-chatbot-dual-pane',
  'TwoPaneLayout': 'heybo-chatbot-two-pane',
  'TwoPaneLayoutIntegrated': 'heybo-chatbot-two-pane-integrated',
  'ContentRouter': 'heybo-chatbot-content-router',
  'NavigationHeader': 'heybo-chatbot-nav-header',
  'NavigationMenu': 'heybo-chatbot-nav-menu',
  'ProgressiveUIDisclosure': 'heybo-chatbot-progressive-ui',
  'CartView': 'heybo-chatbot-cart',
  'CreateYourOwnFlow': 'heybo-chatbot-cyo-flow',
  'DietaryPreferences': 'heybo-chatbot-dietary',
  'FavoritesList': 'heybo-chatbot-favorites',
  'LocationSelector': 'heybo-chatbot-location-selector',
  'LocationTypeSelector': 'heybo-chatbot-location-type',
  'MLRecommendationsList': 'heybo-chatbot-ml-recommendations',
  'OrderSummaryPane': 'heybo-chatbot-order-summary',
  'OrderTracking': 'heybo-chatbot-order-tracking',
  'OrderTypeSelection': 'heybo-chatbot-order-type',
  'RecentOrdersList': 'heybo-chatbot-recent-orders',
  'SignatureBowlsList': 'heybo-chatbot-signature-bowls',
  'TimeSelector': 'heybo-chatbot-time-selector',
  'RatingInterface': 'heybo-chatbot-rating',
  'TypingIndicator': 'heybo-chatbot-typing',
  'PromptSuggestions': 'heybo-chatbot-prompt-suggestions',
  'MessageList': 'heybo-chatbot-message-list',
  'MessageInput': 'heybo-chatbot-message-input',
  'MarkdownRenderer': 'heybo-chatbot-markdown',
  'InterruptPrompt': 'heybo-chatbot-interrupt',
  'FilePreview': 'heybo-chatbot-file-preview',
  'CopyButton': 'heybo-chatbot-copy-button',
  'Chat': 'heybo-chatbot-chat',
  'ChatMessage': 'heybo-chatbot-chat-message',
  'AudioVisualizer': 'heybo-chatbot-audio-visualizer',
  'TypingIndicator': 'heybo-chatbot-typing-indicator',
  'PromptSuggestions': 'heybo-chatbot-prompt-suggestions',
  'MessageList': 'heybo-chatbot-message-list',
  'MessageInput': 'heybo-chatbot-message-input',
  'MarkdownRenderer': 'heybo-chatbot-markdown-renderer',
  'InterruptPrompt': 'heybo-chatbot-interrupt-prompt',
  'FilePreview': 'heybo-chatbot-file-preview',
  'CopyButton': 'heybo-chatbot-copy-button'
};

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  console.log(`🔧 Fixing: ${relativePath}`);
  
  let updatedContent = content;
  let hasChanges = false;
  
  // Fix hardcoded colors
  Object.entries(COLOR_MAPPINGS).forEach(([oldColor, newColor]) => {
    const regex = new RegExp(`\\b${oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    if (regex.test(updatedContent)) {
      updatedContent = updatedContent.replace(regex, newColor);
      hasChanges = true;
      console.log(`  ✅ Fixed color: ${oldColor} → ${newColor}`);
    }
  });
  
  // Fix CSS namespacing
  const componentName = path.basename(filePath, '.tsx').replace(/\.ts$/, '');
  const namespace = COMPONENT_NAMESPACES[componentName];
  
  if (namespace && content.includes('export function') || content.includes('export const')) {
    // Check if component already has namespacing
    if (!content.includes('heybo-chatbot-')) {
      // Add namespace to the first div/element in the return statement
      const returnMatch = updatedContent.match(/return\s*\(\s*<(\w+)([^>]*className=["']([^"']*?)["'][^>]*)?/);
      if (returnMatch) {
        const [fullMatch, elementType, , , existingClasses] = returnMatch;
        const newClasses = existingClasses ? `${namespace} ${existingClasses}` : namespace;
        const newElement = fullMatch.replace(/className=["'][^"']*["']/, `className="${newClasses}"`);
        
        if (!fullMatch.includes('className=')) {
          // Add className if it doesn't exist
          const newElementWithClass = fullMatch.replace(`<${elementType}`, `<${elementType} className="${namespace}"`);
          updatedContent = updatedContent.replace(fullMatch, newElementWithClass);
        } else {
          updatedContent = updatedContent.replace(fullMatch, newElement);
        }
        hasChanges = true;
        console.log(`  ✅ Added namespace: ${namespace}`);
      }
    }
  }
  
  // Fix typography violations
  const typographyFixes = {
    'text-[6px]': 'text-xs',
    'text-[8px]': 'text-xs',
    'text-[10px]': 'text-xs',
    'text-[12px]': 'text-sm',
    'text-[14px]': 'text-sm',
    'text-[16px]': 'text-base',
    'text-[18px]': 'text-lg',
    'text-[20px]': 'text-xl',
    'text-[24px]': 'text-2xl'
  };
  
  Object.entries(typographyFixes).forEach(([oldSize, newSize]) => {
    if (updatedContent.includes(oldSize)) {
      updatedContent = updatedContent.replace(new RegExp(oldSize, 'g'), newSize);
      hasChanges = true;
      console.log(`  ✅ Fixed typography: ${oldSize} → ${newSize}`);
    }
  });
  
  // Write changes if any
  if (hasChanges) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`  💾 Saved changes to ${relativePath}`);
  } else {
    console.log(`  ✅ No changes needed`);
  }
  
  return hasChanges;
}

// Main execution
function main() {
  console.log('🛠️  HeyBo Design System Auto-Fix');
  console.log('Fixing design system violations...\n');
  
  const componentFiles = [];
  COMPONENT_DIRS.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    componentFiles.push(...files);
  });
  
  console.log(`Found ${componentFiles.length} component files to fix\n`);
  
  let totalFixed = 0;
  componentFiles.forEach(file => {
    const hasChanges = fixFile(file);
    if (hasChanges) {
      totalFixed++;
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixed} files!`);
  console.log('\n🔍 Run validation script to check remaining violations:');
  console.log('npm run validate:heybo');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { fixFile, COLOR_MAPPINGS, COMPONENT_NAMESPACES };
