"use client"

import { useState } from "react"
import Link from "next/link"
import { Moon, Sun, Rocket, Home, LayoutDashboard, User, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/modules/auth/hooks/use-auth"
interface HeaderProps {
    isDarkMode: boolean
    onToggleDarkMode: () => void
    user: any
    onSignOut: () => void
}

export function Header({ isDarkMode, onToggleDarkMode, user, onSignOut }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { register } = useAuth()

    const navItems = [
        { label: "Home", href: "/", icon: Home },
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Profile", href: "/profile", icon: User },
        { label: "Settings", href: "/settings", icon: Settings },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-1.5 shadow-lg shadow-purple-500/20">
                        <Rocket className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-lg">
                        Instagram{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Snitch'r</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-zinc-800/50"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleDarkMode}
                        className="rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9 border border-zinc-800">
                                        <AvatarImage src={user.image || "/placeholder-user.jpg"} alt={user.name || "User"} />
                                        <AvatarFallback className="bg-zinc-800 text-zinc-400">
                                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-zinc-900 border border-zinc-800" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium text-white">{user.name || "User"}</p>
                                        <p className="text-xs text-zinc-400 truncate">{user.email || ""}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                {navItems.map((item) => (
                                    <DropdownMenuItem
                                        key={item.label}
                                        className="text-zinc-400 focus:text-white focus:bg-zinc-800"
                                        asChild
                                    >
                                        <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-zinc-800" onClick={onSignOut}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
                        >
                            Sign In
                        </Button>
                    )}

                    {/* Mobile menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-zinc-900 border-l border-zinc-800 p-0">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                        <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-1.5">
                                            <Rocket className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="font-bold text-white">Instagram Snitch'r</span>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    >
                                        <X className="h-5 w-5" />
                                        <span className="sr-only">Close menu</span>
                                    </Button>
                                </div>
                                <nav className="flex flex-col p-4 gap-1">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-zinc-800/50"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="mt-auto p-4 border-t border-zinc-800">
                                    {user ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-zinc-800">
                                                    <AvatarImage src={user.image || "/placeholder-user.jpg"} alt={user.name || "User"} />
                                                    <AvatarFallback className="bg-zinc-800 text-zinc-400">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{user.name || "User"}</p>
                                                    <p className="text-xs text-zinc-400 truncate">{user.email || ""}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                onClick={() => {
                                                    onSignOut()
                                                    setIsOpen(false)
                                                }}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Log out
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="default"
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Sign In
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

