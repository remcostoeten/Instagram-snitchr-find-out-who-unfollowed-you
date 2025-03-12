"use client"

import { useEffect, useState } from "react"
import DemoSection from "./demo-section"
import { checkDemoAccess } from "@/app/actions"

export default function ProtectedDemoSection() {
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
    return (
      <div className="bg-secondary border border-border p-8 rounded-lg text-center">
        <div className="animate-pulse text-white/80">Checking access...</div>
      </div>
    )
  }

  // Only show demo section if user has access
  return hasAccess ? <DemoSection /> : null
} 