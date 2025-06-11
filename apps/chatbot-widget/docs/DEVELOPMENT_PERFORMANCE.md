# HeyBo Chatbot Development Performance Guide

## 🚀 Quick Start - Faster Development

### Ultra-Fast Development Commands

```bash
# Standard optimized development (recommended)
npm run dev:fast

# Ultra-fast with cache clearing
npm run dev:ultra

# Lightning mode (experimental - maximum speed)
npm run dev:lightning
```

## 📊 Performance Analysis Results

### Current Project Stats
- **Total TypeScript files**: 111 files (0.94 MB)
- **Heavy dependencies**: 8 major packages
- **CSS bundle size**: 30.51 KB total
- **Compilation time**: ~18-78 seconds

### Root Causes of Slow Builds

1. **Large file count** (111 TypeScript files)
2. **Heavy dependencies** (Radix UI, tRPC, Framer Motion)
3. **Complex design token system** (23KB CSS file)
4. **Next.js 15 + React 19** (bleeding edge = slower)
5. **Comprehensive demo pages** with many components

## ⚡ Applied Optimizations

### 1. Next.js Configuration
- ✅ Disabled telemetry (`NEXT_TELEMETRY_DISABLED=1`)
- ✅ Enabled Turbo mode (`--turbo`)
- ✅ Optimized package imports
- ✅ Webpack build worker enabled
- ✅ Reduced chunk splitting in development
- ✅ Fixed deprecated `devIndicators` warnings

### 2. TypeScript Optimizations
- ✅ Incremental compilation enabled
- ✅ `skipLibCheck: true` for faster type checking
- ✅ Build info caching (`.tsbuildinfo`)
- ✅ Excluded unnecessary directories

### 3. Memory & Process Optimizations
- ✅ Increased Node.js memory limit (4-6GB)
- ✅ Disabled ESLint during development
- ✅ Reduced logging verbosity
- ✅ Optimized cache strategies

### 4. Development Environment
- ✅ Environment variables for faster builds
- ✅ Cache clearing scripts
- ✅ Performance analysis tools
- ✅ Proper `.gitignore` for build artifacts

## 🛠 Available Scripts

| Script | Purpose | Speed | Use Case |
|--------|---------|-------|----------|
| `npm run dev` | Standard development | Normal | Production-like development |
| `npm run dev:fast` | Optimized development | Fast | Daily development |
| `npm run dev:ultra` | Cache-cleared + optimized | Faster | After dependency changes |
| `npm run dev:lightning` | Maximum speed mode | Fastest | Quick iterations |
| `npm run dev:optimize` | Clear all caches | - | Troubleshooting |

## 📈 Expected Performance Improvements

### Before Optimizations
- Initial ready: ~18.6s
- Demo page compilation: ~78.3s
- Memory usage: High

### After Optimizations
- Initial ready: ~8-12s (33-50% faster)
- Demo page compilation: ~25-40s (50-68% faster)
- Memory usage: Optimized with 4-6GB limit

## 🔧 Troubleshooting Slow Builds

### If builds are still slow:

1. **Clear all caches**:
   ```bash
   npm run dev:optimize
   ```

2. **Check system resources**:
   - Close unnecessary applications
   - Ensure 8GB+ RAM available
   - Check disk space (>5GB free)

3. **Use lightning mode**:
   ```bash
   npm run dev:lightning
   ```

4. **Analyze performance**:
   ```bash
   node scripts/analyze-build-performance.js
   ```

### Common Issues

- **Out of memory**: Use `dev:ultra` with 6GB limit
- **TypeScript errors**: Run `npm run type-check`
- **Cache corruption**: Run `npm run dev:optimize`
- **Dependency conflicts**: Clear `node_modules` and reinstall

## 🎯 Best Practices

1. **Use the right script** for your needs
2. **Clear caches** after dependency changes
3. **Monitor memory usage** during development
4. **Use code splitting** for large components
5. **Lazy load** heavy dependencies when possible

## 📝 Notes

- Lightning mode uses experimental config (may be unstable)
- Source maps disabled in ultra-fast mode (enable for debugging)
- Some optimizations trade build features for speed
- Always test production builds before deployment
