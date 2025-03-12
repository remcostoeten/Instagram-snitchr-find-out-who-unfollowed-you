import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SonnerProvider } from "@/components/sonner-provider"
import { siteConfig } from "@/core/config/site-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <body className={`${inter.className} antialiased`}>
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

