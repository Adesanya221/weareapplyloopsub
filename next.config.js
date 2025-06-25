/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    'react-native',
    'react-native-web',
    '@react-native',
    '@react-native-community',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-svg'
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    };
    return config;
  }
};

module.exports = nextConfig;
