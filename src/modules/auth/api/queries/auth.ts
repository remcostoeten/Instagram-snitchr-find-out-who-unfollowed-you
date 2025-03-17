"use server"

import { getTokenFromCookies, verifyToken } from "../utils/jwt"
import { findUserById } from "../store/users"
import { findSessionById } from "../store/sessions"

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser() {
  try {
    // Get token from cookies
    const token = getTokenFromCookies()
    if (!token) return null

    // Verify token
    const payload = await verifyToken(token)
    if (!payload) return null

    // Check if session exists and is valid
    const session = await findSessionById(payload.sessionId)
    if (!session) return null

    // Check if session is expired
    if (session.expiresAt < new Date()) return null

    // Get user
    const user = await findUserById(payload.sub)
    if (!user) return null

    // Return user info (excluding sensitive data)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      sessionId: session.id,
    }
  } catch (error) {
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

