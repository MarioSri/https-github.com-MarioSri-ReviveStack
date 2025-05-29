/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['via.placeholder.com', 'blob.v0.dev'],
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Add this to handle client-side only code
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ensure we don't try to bundle server-only packages
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  // Add output configuration for static export compatibility
  output: 'standalone',
}

export default nextConfig
