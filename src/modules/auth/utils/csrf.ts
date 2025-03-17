'use client'

/**
 * Gets a CSRF token from the server
 */
export async function getCsrfToken(): Promise<string> {
    const response = await fetch('/api/csrf')
    const { csrfToken } = await response.json()
    return csrfToken
} 