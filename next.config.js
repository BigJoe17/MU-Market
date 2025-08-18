/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mwbbjubqxdwksxhzeqxh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/listings/**',
      },
      {
        protocol: 'https',
        hostname: 'mwbbjubqxdwksxhzeqxh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/profiles/**',
      },
    ],
  },
  webpack: (config) => {
    // Fix case sensitivity issues on Windows
    config.resolve.symlinks = false;
    return config;
  },
}

module.exports = nextConfig
