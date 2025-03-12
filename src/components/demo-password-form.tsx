"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateDemoPassword } from "@/app/actions"
import { toast } from "sonner"

interface DemoPasswordFormProps {
  onSuccess?: () => void;
}

export default function DemoPasswordForm({ onSuccess }: DemoPasswordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await validateDemoPassword(formData)

      if (!result.success) {
        setError(result.message || "Invalid password. Please try again.")
        toast.error("Access Denied", {
          description: result.message || "Invalid password. Please try again."
        })
        return
      }

      // Show success message
      toast.success("Access Granted", {
        description: "You now have access to the demo features."
      })

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Legacy behavior: force a refresh if no callback
        window.location.reload()
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      toast.error("Error", {
        description: "An error occurred while validating your password. Please try again."
      })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <span>Demo Access Required</span>
        </CardTitle>
        <CardDescription className="text-white/60">
          Enter the password to access the demo CSV files and examples.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-destructive/10 border border-destructive/20">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                required
                placeholder="Enter the demo access password"
                className="bg-muted border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white hover-effect"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Access Demo Files"}
          </Button>
        </CardFooter>
      </form>
    </>
  )
} 