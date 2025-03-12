'use client'

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-4"
            >
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Something went wrong!</AlertTitle>
                    <AlertDescription>
                        {error.message || "An unexpected error occurred. Please try again."}
                    </AlertDescription>
                </Alert>

                <div className="flex justify-center">
                    <Button
                        onClick={reset}
                        className="mt-4"
                        variant="outline"
                    >
                        Try again
                    </Button>
                </div>
            </motion.div>
        </div>
    )
} 