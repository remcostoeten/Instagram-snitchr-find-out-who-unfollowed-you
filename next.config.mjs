/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  distDir: '.next',
  dir: './src',
  publicRuntimeConfig: {
    publicDir: 'src/public',
  },
  outputFileTracing: true,
}

export default nextConfig
