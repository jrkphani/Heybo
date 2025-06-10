/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@heybo/ui", "@heybo/design-tokens", "@heybo/types", "@heybo/api"],
  experimental: {
    optimizePackageImports: ["@heybo/ui"],
  },
  // Widget optimization
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          heybo: {
            test: /[\\/]packages[\\/]/,
            name: 'heybo',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
