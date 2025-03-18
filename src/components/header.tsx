"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/modules/auth/hooks/use-auth"
import { LogOut, User, Settings, Home, LayoutDashboard } from "lucide-react"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function Header() {
    const { user, signOut } = useAuth()
    const pathname = usePathname()

    const navigation = [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="flex flex-1 items-center justify-between">
                    <nav className="flex items-center space-x-6">
                        <Link href="/" className="font-cal text-xl font-bold tracking-tight">
                            Instagram Snitch
                        </Link>
                        <div className="hidden md:flex items-center space-x-6">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${pathname === item.href ? "text-foreground" : "text-foreground/60"
                                            }`}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </nav>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                                            <User className="h-4 w-4" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/register">Sign up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
} 