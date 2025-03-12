"use client"

import { useEffect, useState } from "react"
import { Toaster } from "sonner"

export function SonnerProvider() {
    const [theme, setTheme] = useState<"dark" | "light">("dark")

    // Watch for theme changes by observing the html element class changes
    useEffect(() => {
        const updateTheme = () => {
            const isDark = !document.documentElement.classList.contains("light")
            setTheme(isDark ? "dark" : "light")
        }

        // Set initial theme
        updateTheme()

        // Create observer to watch for class changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.attributeName === "class" &&
                    mutation.target === document.documentElement
                ) {
                    updateTheme()
                }
            })
        })

        // Start observing
        observer.observe(document.documentElement, { attributes: true })

        // Cleanup
        return () => observer.disconnect()
    }, [])

    return (
        <Toaster
            position="top-center"
            theme={theme}
            richColors
            closeButton
            toastOptions={{
                duration: 4000,
                className: "sonner-toast",
                style: {
                    background: theme === "dark" ? 'hsl(var(--secondary))' : 'white',
                    color: theme === "dark" ? 'hsl(var(--foreground))' : 'black',
                    border: theme === "dark"
                        ? '1px solid hsl(var(--border))'
                        : '1px solid hsl(210, 20%, 90%)',
                },
            }}
        />
    )
} 