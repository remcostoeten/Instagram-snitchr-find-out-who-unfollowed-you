"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout, logoutAll } from "../mutations/auth"

type UseAuthOptions = {
  redirectTo?: string
  redirectIfFound?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
  const { redirectTo, redirectIfFound } = options
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadUserFromAPI() {
      try {
        const res = await fetch("/api/user")
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserFromAPI()
  }, [])

  useEffect(() => {
    if (!redirectTo || isLoading) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user)
    ) {
      router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, router, user, isLoading])

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      setUser(null)
      router.push("/login")
      router.refresh()
    }
    return result
  }

  const handleLogoutAll = async () => {
    const result = await logoutAll()
    if (result.success) {
      setUser(null)
      router.push("/login")
      router.refresh()
    }
    return result
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: handleLogout,
    logoutAll: handleLogoutAll,
  }
}

