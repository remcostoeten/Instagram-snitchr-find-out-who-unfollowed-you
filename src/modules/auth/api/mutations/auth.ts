"use server"
import { z } from "zod"
import { headers } from "next/headers"
import { registerInputSchema, loginInputSchema } from "../models/schema"
import { hashPassword, comparePassword, verifyPassword } from "../utils/password"
import { createUser, findUserByEmail } from "../store/users"
import { createSession, deleteSession, deleteUserSessions } from "../store/sessions"
import { createToken, setTokenCookie, removeTokenCookie, setAuthCookie, verifyToken } from "../utils/jwt"
import { getCurrentUser } from "../queries/auth"
import { validateCsrfToken } from "../utils/csrf"
import { rateLimitLogin, resetLoginAttempts } from "../utils/rate-limit"
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from "next/headers"
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { RateLimiter } from '../utils/rate-limit'

// Create rate limiters
const loginRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
})

const registrationRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
  csrfToken: z.string(),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  instagramHandle: z.string().min(1),
  csrfToken: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

/**
 * Registers a new user
 */
export async function register(input: RegisterInput) {
  try {
    const { email, password, name, instagramHandle, csrfToken } = registerSchema.parse(input)

    // Validate CSRF token
    if (!await validateCsrfToken(csrfToken)) {
      return { error: 'Invalid request' }
    }

    // Check rate limiting
    const rateLimitResult = registrationRateLimiter.attempt(email)
    if (!rateLimitResult.success) {
      return {
        error: `Too many registration attempts. Please try again after ${new Date(rateLimitResult.resetTime!).toLocaleString()}`,
        resetTime: rateLimitResult.resetTime,
      }
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (existingUser) {
      return { error: 'Email already registered' }
    }

    const hashedPassword = await hashPassword(password)

    const [user] = await db.insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        instagramHandle,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        instagramHandle: users.instagramHandle,
      })

    // Create session
    const session = await createSession(user.id)

    const token = await createToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      instagramHandle: user.instagramHandle,
      sessionId: session.id,
    })

    setTokenCookie(token)

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        instagramHandle: user.instagramHandle,
      },
    }
  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof z.ZodError) {
      return { fieldErrors: error.flatten().fieldErrors }
    }
    return { error: 'An error occurred during registration' }
  }
}

/**
 * Logs in a user
 */
export async function login(input: LoginInput) {
  try {
    const { email, password, csrfToken } = loginSchema.parse(input)

    // Validate CSRF token
    if (!await validateCsrfToken(csrfToken)) {
      return { error: 'Invalid request' }
    }

    // Check rate limiting
    const rateLimitResult = loginRateLimiter.attempt(email)
    if (!rateLimitResult.success) {
      return {
        error: `Too many login attempts. Please try again after ${new Date(rateLimitResult.resetTime!).toLocaleString()}`,
        resetTime: rateLimitResult.resetTime,
      }
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (!user) {
      return { error: 'Invalid email or password' }
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return { error: 'Invalid email or password' }
    }

    // Create session
    const session = await createSession(user.id)

    const token = await createToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      instagramHandle: user.instagramHandle,
      sessionId: session.id,
    })

    setTokenCookie(token)

    // Reset rate limiting on successful login
    loginRateLimiter.reset(email)

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        instagramHandle: user.instagramHandle,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof z.ZodError) {
      return { fieldErrors: error.flatten().fieldErrors }
    }
    return { error: 'An error occurred during login' }
  }
}

/**
 * Logs out a user
 */
export async function logout() {
  try {
    const cookieStore = cookies() as RequestCookies
    const cookieToken = cookieStore.get('auth_token')?.value
    if (cookieToken) {
      const payload = await verifyToken(cookieToken)
      if (payload?.sessionId) {
        await deleteSession(payload.sessionId)
      }
    }

    removeTokenCookie()
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { error: 'An error occurred during logout' }
  }
}

/**
 * Logs out a user from all devices
 */
export async function logoutAll() {
  try {
    const cookieStore = cookies() as RequestCookies
    const cookieToken = cookieStore.get('auth_token')?.value
    if (cookieToken) {
      const payload = await verifyToken(cookieToken)
      if (payload?.sub) {
        await deleteUserSessions(payload.sub)
      }
    }

    removeTokenCookie()
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { error: 'An error occurred during logout' }
  }
}

