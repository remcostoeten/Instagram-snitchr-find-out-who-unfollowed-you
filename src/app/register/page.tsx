"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, UserPlus, Instagram, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Icon */}
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 rounded-full bg-accent"
          >
            <UserPlus className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2"
          >
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/90 underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 shadow-lg rounded-lg p-6 backdrop-blur-sm"
        >
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="bg-secondary/50"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-secondary/50"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="instagram"
                  name="instagram"
                  type="text"
                  placeholder="username"
                  required
                  className="pl-10 bg-secondary/50"
                />
              </div>
              {errors.instagram && <p className="text-sm text-destructive">{errors.instagram}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pr-10 bg-secondary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="pr-10 bg-secondary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0"
                animate={{
                  x: ["0%", "200%"],
                  transition: { duration: 2, repeat: Infinity },
                }}
              />
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <motion.div
                      className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:text-primary/90 underline-offset-4 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:text-primary/90 underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

