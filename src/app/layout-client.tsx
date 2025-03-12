"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SonnerProvider } from "@/components/sonner-provider"
import { UserMenu } from "@/components/user-menu"
import { useAuthStore } from "@/modules/auth/store/use-auth-store"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = useAuthStore()

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <body className={`${inter.className} antialiased`}>
          <header className="border-b border-border bg-secondary p-4">
            <div className="container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-medium">
                  <span className="text-primary">CSV</span> Comparison Tool
                </h1>
                {user && (
                  <span className="text-sm text-muted-foreground">
                    ({user.instagramHandle}'s space)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <UserMenu />
              </div>
            </div>
          </header>
          <style jsx global>{`
            * {
              transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
          `}</style>
          <SonnerProvider />
          {children}
        </body>
      </ThemeProvider>
    </html>
  )
}

