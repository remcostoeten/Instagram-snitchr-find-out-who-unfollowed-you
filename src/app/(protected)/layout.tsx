import { isAuthenticated } from '@/modules/auth/api/utils/auth-server'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
    children,
}: {
    children: PageProps
}) {
    const authenticated = await isAuthenticated()

    if (!authenticated) {
        redirect('/login')
    }

    return <>{children}</>
} 