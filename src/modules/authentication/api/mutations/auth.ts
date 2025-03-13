"use server"
import { z } from "zod"
import { headers } from "next/headers"
import { registerInputSchema, loginInputSchema } from "../models/schema"
import { hashPassword, comparePassword } from "../utils/password"
import { createUser, findUserByEmail } from "../store/users"
import { createSession, deleteSession, deleteUserSessions } from "../store/sessions"
import { createToken, setTokenCookie, removeTokenCookie } from "../utils/jwt"
import { getCurrentUser } from "../queries/auth"
import { validateCsrfToken } from "../utils/csrf"
import { rateLimitLogin, resetLoginAttempts } from "../utils/rate-limit"

/**
 * Registers a new user
 */
export async function register(formData: FormData) {
  // Validate CSRF token
  const csrfToken = formData.get("csrfToken") as string
  if (!validateCsrfToken(csrfToken)) {
    return { success: false, error: "Invalid request" }
  }

  const rawInput = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    name: formData.get("name"),
    instagramHandle: formData.get("instagramHandle"),
  }

  try {
    const input = registerInputSchema.parse(rawInput)

    // Check if user already exists
    const existingUser = await findUserByEmail(input.email)
    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password)

    // Create user
    const user = await createUser(input.email, hashedPassword, input.name, input.instagramHandle)

    // Create session
    const session = await createSession(user.id)

    // Create JWT token
    const token = await createToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      instagramHandle: user.instagramHandle,
      sessionId: session.id,
    })

    // Set token cookie
    setTokenCookie(token)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce(
        (acc, curr) => {
          const field = curr.path[0] as string
          acc[field] = curr.message
          return acc
        },
        {} as Record<string, string>,
      )

      return { success: false, fieldErrors }
    }

    return { success: false, error: "Registration failed" }
  }
}

/**
 * Logs in a user
 */
export async function login(formData: FormData) {
  // Validate CSRF token
  const csrfToken = formData.get("csrfToken") as string
  if (!validateCsrfToken(csrfToken)) {
    return { success: false, error: "Invalid request" }
  }

  // Parse and validate input
  const rawInput = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  // Check for remember me option
  const rememberMe = formData.get("rememberMe") === "true"

  try {
    const input = loginInputSchema.parse(rawInput)

    // Get client IP for rate limiting
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"

    // Apply rate limiting for login attempts
    if (!rateLimitLogin(input.email)) {
      return {
        success: false,
        error: "Too many login attempts. Please try again later.",
      }
    }

    // Find user
    const user = await findUserByEmail(input.email)
    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Verify password
    const isPasswordValid = await comparePassword(input.password, user.password)
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Reset login attempts on successful login
    resetLoginAttempts(input.email)

    // Create session
    const session = await createSession(user.id)

    // Create JWT token
    const token = await createToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      instagramHandle: user.instagramHandle,
      sessionId: session.id,
    })

    // Set token cookie
    setTokenCookie(token)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce(
        (acc, curr) => {
          const field = curr.path[0] as string
          acc[field] = curr.message
          return acc
        },
        {} as Record<string, string>,
      )

      return { success: false, fieldErrors }
    }

    return { success: false, error: "Login failed" }
  }
}

/**
 * Logs out a user
 */
export async function logout() {
  try {
    const user = await getCurrentUser()

    if (user) {
      // Delete the current session
      const sessionId = user.sessionId
      if (sessionId) {
        await deleteSession(sessionId)
      }
    }

    // Remove token cookie
    removeTokenCookie()

    return { success: true }
  } catch (error) {
    return { success: false, error: "Logout failed" }
  }
}

/**
 * Logs out a user from all devices
 */
export async function logoutAll() {
  try {
    const user = await getCurrentUser()

    if (user) {
      // Delete all user sessions
      await deleteUserSessions(user.id)
    }

    // Remove token cookie
    removeTokenCookie()

    return { success: true }
  } catch (error) {
    return { success: false, error: "Logout failed" }
  }
}

