/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@heybo/ui", "@heybo/design-tokens", "@heybo/types", "@heybo/api"],
  experimental: {
    optimizePackageImports: ["@heybo/ui", "lucide-react", "framer-motion"],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Enable faster builds
    webpackBuildWorker: true,
  },
  // Widget optimization
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  compress: true,
  poweredByHeader: false,

  // Development improvements
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 60 * 1000, // Increased from 25s to 60s
      pagesBufferLength: 5, // Increased from 2 to 5
    },
    // Reduce logging for faster builds
    logging: {
      fetches: {
        fullUrl: false, // Reduced logging
      },
    },
    // Fix deprecated devIndicators
    devIndicators: {
      position: 'bottom-left', // Use new position property
    },
  }),
  
  // Enable for widget embedding
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' *.heybo.com",
          },
        ],
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'HeyBo Chatbot',
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },

  // Webpack optimizations for widget
  webpack: (config, { isServer, dev }) => {
    // Development optimizations
    if (dev) {
      // Faster builds in development
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;

      // Reduce bundle analysis overhead
      config.optimization.usedExports = false;
      config.optimization.sideEffects = false;
    }

    if (!isServer) {
      // Production chunk splitting
      if (!dev) {
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            heybo: {
              test: /[\\/]packages[\\/]/,
              name: 'heybo',
              chunks: 'all',
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
            },
          },
        };
      }

      // Optimize large dependencies
      config.resolve.alias = {
        ...config.resolve.alias,
        '@radix-ui/react-icons': '@radix-ui/react-icons/dist/index.js',
      };
    }

    return config;
  },
};

module.exports = nextConfig;
