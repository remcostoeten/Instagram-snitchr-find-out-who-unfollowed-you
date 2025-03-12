'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { SonnerProvider } from "@/components/sonner-provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <body className={`${inter.className} antialiased min-h-screen bg-background font-sans`}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange={false}
            >
                <style jsx global>{`
          :root {
            --transition-duration: 0.3s;
          }
          * {
            transition: background-color var(--transition-duration) ease,
                      border-color var(--transition-duration) ease,
                      color var(--transition-duration) ease,
                      opacity var(--transition-duration) ease;
          }
        `}</style>
                <SonnerProvider />
                {children}
            </ThemeProvider>
        </body>
    )
} 