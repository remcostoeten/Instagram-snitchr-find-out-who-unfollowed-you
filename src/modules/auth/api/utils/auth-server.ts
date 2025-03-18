'use server'

import { findSessionById, getTokenFromCookies, verifyToken } from './jwt'
import { findUserById } from '../store/users'
import type { User } from '../models/z.user'

export async function getServerSession() {
    try {
        const token = await getTokenFromCookies()
        if (!token) return null

        const payload = await verifyToken(token)
        if (!payload) return null

        const session = await findSessionById(payload.sessionId)
        if (!session || session.expiresAt < new Date()) return null

        const user = await findUserById(payload.sub)
        if (!user) return null

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                instagramHandle: user.instagramHandle,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            sessionId: session.id,
        }
    } catch (error) {
        console.error('Error getting server session:', error)
        return null
    }
}

export async function getCurrentUser(): Promise<Omit<User, 'password'> | null> {
    const session = await getServerSession()
    return session?.user || null
}

export async function isAuthenticated(): Promise<boolean> {
    const session = await getServerSession()
    return !!session
} 