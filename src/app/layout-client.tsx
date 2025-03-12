'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { SonnerProvider } from "@/components/sonner-provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
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
    )
} 