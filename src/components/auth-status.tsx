"use client"

import { useAuth } from "@/modules/authentication/api/hooks/use-auth"
import Link from "next/link"

export default function AuthStatus() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Sign up
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">
        Signed in as <span className="font-medium">{user.name}</span>
      </span>
      <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-500">
        Dashboard
      </Link>
      <button onClick={() => logout()} className="text-sm font-medium text-red-600 hover:text-red-500">
        Sign out
      </button>
    </div>
  )
}

