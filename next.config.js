/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['mwbbjubqxdwksxhzeqxh.supabase.co'],
  },
  webpack: (config) => {
    // Fix case sensitivity issues on Windows
    config.resolve.symlinks = false;
    return config;
  },
}

module.exports = nextConfig
