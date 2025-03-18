'use client'

import { createContext, useContext, useEffect } from 'react'
import { useAuth } from '../hooks/use-auth'
import { getCurrentUser } from '../api/queries/auth'

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuth()

    useEffect(() => {
        async function initAuth() {
            try {
                const user = await getCurrentUser()
                if (user) {
                    auth.setUser(user)
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error)
            }
        }

        initAuth()
    }, [auth])

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
} 