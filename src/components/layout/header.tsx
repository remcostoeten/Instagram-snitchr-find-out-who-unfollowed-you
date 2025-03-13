"use client"

import { useTheme } from "next-themes"
import { Nav } from "@/components/layout/nav"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { LineShadowText } from "@/components/shared/text-effect"
import { siteConfig } from "@/core/config/site-config"
import { UserMenu } from "@/components/layout/user-menu"

interface HeaderProps {
    isDarkMode: boolean
    onToggleDarkMode: () => void
    user?: {
        name?: string
        email: string
    } | null
    onSignOut?: () => void
}

export function Header({ isDarkMode, onToggleDarkMode, user, onSignOut }: HeaderProps) {
    const theme = useTheme()
    const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black"

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm"
        >
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-6">
                    <a href="/" className="flex items-center">
                        <h1 className="text-lg font-semibold tracking-tight">
                            {siteConfig.namePlatform}
                            <LineShadowText className="italic ml-1" shadowColor={shadowColor}>
                                {siteConfig.nameShort}
                            </LineShadowText>
                        </h1>
                    </a>
                    <Nav />
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleDarkMode}
                        className="h-9 w-9 rounded-md"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {user && onSignOut && (
                        <UserMenu user={user} onSignOut={onSignOut} />
                    )}
                </div>
            </div>
        </motion.header>
    )
} 