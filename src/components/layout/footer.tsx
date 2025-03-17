import Link from "next/link"
import { Rocket } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 bg-black py-6 px-4 md:px-8">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-1.5 shadow-lg shadow-purple-500/20">
                        <Rocket className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-zinc-400">
                        © {new Date().getFullYear()} Instagram Snitch'r. All rights reserved.
                    </span>
                </div>

                <nav className="flex items-center gap-6">
                    <Link href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors">
                        Terms
                    </Link>
                    <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white transition-colors">
                        Privacy
                    </Link>
                    <Link href="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">
                        Contact
                    </Link>
                </nav>
            </div>
        </footer>
    )
}

