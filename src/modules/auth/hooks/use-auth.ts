import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    name?: string
    email: string
}

interface AuthState {
    user: User | null
    isLoading: boolean
    error: string | null
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => void
    setUser: (user: User | null) => void
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            error: null,
            signIn: async (email: string, password: string) => {
                set({ isLoading: true, error: null })
                try {
                    // Here you would typically make an API call to your auth endpoint
                    // For now, we'll simulate a successful login
                    const user = {
                        id: '1',
                        email,
                        name: 'Demo User'
                    }
                    set({ user, isLoading: false })
                } catch (error) {
                    set({ error: 'Failed to sign in', isLoading: false })
                }
            },
            signOut: () => {
                set({ user: null, error: null })
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