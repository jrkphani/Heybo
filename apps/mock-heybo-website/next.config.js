/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React 19 features - disabled for now due to babel plugin requirement
  experimental: {
    // reactCompiler: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable standalone output for deployment
  output: 'standalone',
  
  // Custom webpack config for widget integration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure proper handling of the chatbot widget
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Headers for widget integration
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
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
