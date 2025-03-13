import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://instagram-snitchr.vercel.app'

    const routes = [
        '',
        '/login',
        '/register',
        '/forgot-password',
        '/dashboard',
        '/profile',
        '/settings',
        '/settings/change-password',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return routes
} 