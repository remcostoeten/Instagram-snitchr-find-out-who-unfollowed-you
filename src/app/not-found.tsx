'use client'

import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
            >
                <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                >
                    <FileQuestion className="h-24 w-24 text-muted-foreground mx-auto" />
                </motion.div>
                <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
                <p className="text-muted-foreground max-w-[500px] mx-auto">
                    Sorry, we couldn't find the page you're looking for. The page might have been removed or the link might be broken.
                </p>
                <Button asChild className="mt-8">
                    <Link href="/">Return Home</Link>
                </Button>
            </motion.div>
        </div>
    )
} 