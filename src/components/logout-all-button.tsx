"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { logoutAll } from "@/modules/authentication/api/mutations/auth"

export default function LogoutAllButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogoutAll() {
    setIsLoading(true)
    const result = await logoutAll()
    setIsLoading(false)

    if (result.success) {
      router.push("/login")
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleLogoutAll}
      disabled={isLoading}
      className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-75"
    >
      {isLoading ? "Logging out..." : "Logout from all devices"}
    </button>
  )
}

