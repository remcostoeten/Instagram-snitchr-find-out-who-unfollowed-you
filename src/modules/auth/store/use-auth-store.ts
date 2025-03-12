import { create } from 'zustand'

export interface User {
    id: string
    name: string
    email: string
    instagramHandle: string
    role: 'admin' | 'user'
    avatarUrl?: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: {
        id: '1',
        name: 'Remco Stoeten',
        email: 'remcostoeten@hotmail.com',
        instagramHandle: 'yowremco',
        role: 'admin',
        avatarUrl: 'https://github.com/remcostoeten.png', // Using GitHub avatar as a placeholder
    },
    isAuthenticated: true, // Mocked as true
    setUser: (user) => set({ user, isAuthenticated: !!user }),
})) 