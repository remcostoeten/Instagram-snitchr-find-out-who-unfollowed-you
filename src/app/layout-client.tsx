'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { HeroPill } from "@/components/hero-pill"
import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-space-grotesk',
})

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toaster position="top-center" richColors />
            <div className={`${spaceGrotesk.variable} antialiased min-h-screen bg-background font-sans`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
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
                        html {
                            font-family: var(--font-space-grotesk);
                        }
                    `}</style>
                    <HeroPill
                        id="beta-announcement"
                        href="#"
                        label="Beta version - Still under active development, expect bugs"
                        announcement="🚧 Beta"
                        autoShowDelay={1000} />
                    {children}
                    <Toaster />
                </ThemeProvider>
            </div>
        </>
    )
} 