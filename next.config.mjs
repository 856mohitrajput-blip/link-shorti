/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagsapi.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    // Externalize mongoose to prevent it from being bundled in middleware (Edge Runtime)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mongoose: false,
      };
    }
    
    // Add externals for mongoose and related packages
    config.externals = config.externals || [];
    if (typeof config.externals === 'function') {
      const originalExternals = config.externals;
      config.externals = [
        originalExternals,
        ({ request }, callback) => {
          if (request && request.includes('mongoose')) {
            return callback(null, 'commonjs ' + request);
          }
          callback();
        },
      ];
    } else if (Array.isArray(config.externals)) {
      config.externals.push(({ request }, callback) => {
        if (request && request.includes('mongoose')) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      });
    }
    
    return config;
  },
  // Exclude mongoose from server components external packages
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
};

export default nextConfig;
