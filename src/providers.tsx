'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { FontProvider } from "@/modules/font-switcher"
import { SonnerProvider } from "@/components/sonner-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Space_Grotesk } from "next/font/google"
import { AuthProvider } from "@/modules/auth/providers/auth-provider"

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-space-grotesk',
})

export function Providers({ children }: PageProps) {
    return (
        <AuthProvider>
            <FontProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TooltipProvider delayDuration={0}>
                        <div className={`${spaceGrotesk.variable} antialiased min-h-screen bg-background font-sans`}>
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
                                html {
                                    font-family: var(--font-space-grotesk);
                                }
                            `}</style>
                            {children}
                            <SonnerProvider />
                        </div>
                    </TooltipProvider>
                </ThemeProvider>
            </FontProvider>
        </AuthProvider>
    )
} 