/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal transpilation for faster builds
  transpilePackages: ["@heybo/ui"],
  
  experimental: {
    // Enable all performance optimizations
    optimizePackageImports: ["@heybo/ui", "lucide-react", "framer-motion", "@radix-ui/react-dialog"],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    webpackBuildWorker: true,
    // Disable features that slow down development
    optimizeCss: false,
    optimizeServerReact: false,
  },

  // Disable production optimizations in development
  compress: false,
  poweredByHeader: false,
  
  // Ultra-fast development settings
  onDemandEntries: {
    maxInactiveAge: 120 * 1000, // 2 minutes
    pagesBufferLength: 10,
  },
  
  // Minimal logging
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  
  // Simplified dev indicators
  devIndicators: {
    position: 'bottom-left',
  },

  // Minimal headers for development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },

  // Ultra-fast webpack config for development
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      // Maximum speed optimizations for development
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        usedExports: false,
        sideEffects: false,
        providedExports: false,
        concatenateModules: false,
        flagIncludedChunks: false,
        occurrenceOrder: false,
        mangleExports: false,
        innerGraph: false,
        realContentHash: false,
      };

      // Faster module resolution
      config.resolve.symlinks = false;
      config.resolve.cacheWithContext = false;
      
      // Disable source maps for faster builds (enable only when debugging)
      config.devtool = false;
      
      // Faster file watching
      config.watchOptions = {
        poll: false,
        ignored: /node_modules/,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
