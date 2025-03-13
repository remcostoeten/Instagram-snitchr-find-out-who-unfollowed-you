"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Home, LayoutDashboard, User, Settings } from "lucide-react"

const routes = [
    {
        href: "/",
        label: "Home",
        icon: Home
    },
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard
    },
    {
        href: "/profile",
        label: "Profile",
        icon: User
    },
    {
        href: "/settings",
        label: "Settings",
        icon: Settings
    },
]

export function Nav() {
    const pathname = usePathname()

    return (
        <nav className="flex items-center space-x-1">
            {routes.map((route) => {
                const isActive = pathname === route.href
                const Icon = route.icon

                return (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isActive
                                ? "bg-secondary text-foreground"
                                : "hover:bg-secondary/80 text-muted-foreground"
                        )}
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        {route.label}
                    </Link>
                )
            })}
        </nav>
    )
} 