/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Don't bundle server-only modules on the client side
            config.resolve.fallback = {
                ...config.resolve.fallback,
                tls: false,
                fs: false,
                net: false,
                dns: false,
                'pg-native': false,
            }
        }
        return config
    },
}

module.exports = nextConfig 