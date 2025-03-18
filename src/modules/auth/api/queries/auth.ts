"use server"

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { getTokenFromCookies, verifyToken } from "../utils/jwt"
import { findUserById } from "../store/users"
import { getSession } from "../utils/session"

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )

    if (!payload.sub) {
      return null
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub as string),
      columns: {
        id: true,
        email: true,
        name: true,
        instagramHandle: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Checks if the user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

