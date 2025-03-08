"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DemoSection from "./demo-section"
import DemoPasswordForm from "./demo-password-form"
import { checkDemoAccess } from "@/app/actions"

export default function ProtectedDemoSection() {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      try {
        const access = await checkDemoAccess()
        setHasAccess(access)
      } catch (error) {
        console.error("Error checking demo access:", error)
        setHasAccess(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [])

  // Show loading state while checking access
  if (isLoading) {
    return <div className="text-center py-8">Checking access...</div>
  }

  if (!hasAccess) {
    return <DemoPasswordForm />
  }

  return <DemoSection />
} 