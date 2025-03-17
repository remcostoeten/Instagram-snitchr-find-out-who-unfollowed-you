import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { register as registerAction, login as loginAction, logout as logoutAction } from '../api/mutations/auth'
import { getCsrfToken } from '../utils/csrf'

interface User {
    id: string
    name?: string
    email: string
    instagramHandle: string
}

interface AuthState {
    user: User | null
    isLoading: boolean
    error: string | null
    register: (email: string, password: string, name: string, instagramHandle: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    setUser: (user: User | null) => void
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            error: null,
            register: async (email: string, password: string, name: string, instagramHandle: string) => {
                set({ isLoading: true, error: null })
                try {
                    const csrfToken = await getCsrfToken()
                    const result = await registerAction({
                        email,
                        password,
                        name,
                        instagramHandle,
                        csrfToken
                    })

                    if (result.success) {
                        set({ user: result.user, isLoading: false })
                        toast.success('Registration successful! Welcome aboard!')
                    } else {
                        set({ error: result.error || 'Registration failed', isLoading: false })
                        toast.error(result.error || 'Registration failed')
                    }
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Failed to register'
                    set({ error: message, isLoading: false })
                    toast.error(message)
                }
            },
            signIn: async (email: string, password: string) => {
                set({ isLoading: true, error: null })
                try {
                    const csrfToken = await getCsrfToken()
                    const result = await loginAction({
                        email,
                        password,
                        csrfToken
                    })

                    if (result.success) {
                        set({ user: result.user, isLoading: false })
                        toast.success('Welcome back!')
                    } else {
                        set({ error: result.error || 'Login failed', isLoading: false })
                        toast.error(result.error || 'Login failed')
                    }
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Failed to sign in'
                    set({ error: message, isLoading: false })
                    toast.error(message)
                }
            },
            signOut: async () => {
                try {
                    const result = await logoutAction()
                    if (result.success) {
                        set({ user: null, error: null })
                        toast.success('Successfully logged out')
                    } else {
                        toast.error(result.error || 'Failed to log out')
                    }
                } catch (error) {
                    toast.error('Failed to log out')
                }
            },
            setUser: (user) => {
                set({ user })
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user })
        }
    )
) 