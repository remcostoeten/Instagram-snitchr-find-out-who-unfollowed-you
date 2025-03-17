"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Upload, FileText, File, CloudUpload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface UploadTabProps {
    isLoading: boolean
    progress: number
    filesCount: number
    onUpload: (files: FileList) => void
    onUploadComplete: () => void
}

// Floating elements animation variants
const floatingVariants = {
    initial: (custom: number) => ({
        opacity: 0,
        y: 20,
        x: custom,
        rotate: custom > 0 ? 15 : -15,
    }),
    animate: (custom: number) => ({
        opacity: [0.3, 0.6, 0.3],
        y: [0, -15, 0],
        x: [custom, custom + (custom > 0 ? 10 : -10), custom],
        rotate: [custom > 0 ? 15 : -15, custom > 0 ? 5 : -5, custom > 0 ? 15 : -15],
        transition: {
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
        },
    }),
}

// File drop animation variants
const dropZoneVariants = {
    idle: {
        scale: 1,
        opacity: 1,
        borderColor: "rgba(82, 82, 91, 0.3)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    hover: {
        scale: 1.02,
        opacity: 1,
        borderColor: "rgba(168, 85, 247, 0.5)",
        backgroundColor: "rgba(168, 85, 247, 0.05)",
    },
}

export function UploadTab({ isLoading, progress, filesCount, onUpload, onUploadComplete }: UploadTabProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const validateFiles = (files: FileList | null): boolean => {
        if (!files || files.length === 0) {
            toast.error("No files selected", {
                description: "Please select at least one CSV file to upload.",
            })
            return false
        }

        const invalidFiles = Array.from(files).filter((file) => !file.name.toLowerCase().endsWith(".csv"))
        if (invalidFiles.length > 0) {
            toast.error("Invalid file type", {
                description: "Please only upload CSV files.",
            })
            return false
        }

        return true
    }

    const handleFileUpload = (files: FileList) => {
        if (validateFiles(files)) {
            toast.loading("Processing files...", {
                description: `Uploading ${files.length} file(s)`,
                id: "upload-toast",
            })

            onUpload(files)
            onUploadComplete()

            toast.success("Files uploaded", {
                description: `Successfully processed ${files.length} file(s)`,
                id: "upload-toast",
            })
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleFileUpload(event.target.files)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileUpload(e.dataTransfer.files)
    }

    return (
        <>
            <Card className="relative overflow-hidden bg-transparent border-0 shadow-2xl">
                {/* Glowing background effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-xl blur-xl opacity-30"></div>

                {/* Background floating elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            custom={[-200, -150, -100, -50, 50, 100, 150, 200][i]}
                            variants={floatingVariants}
                            initial="initial"
                            animate="animate"
                            className="absolute"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                            }}
                        >
                            {i % 2 === 0 ? (
                                <CloudUpload className="text-purple-500/10" size={[30, 40, 50][i % 3]} strokeWidth={1} />
                            ) : (
                                <File className="text-pink-500/10" size={[30, 40, 50][i % 3]} strokeWidth={1} />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Upload drop zone */}
                <motion.div
                    variants={dropZoneVariants}
                    initial="idle"
                    animate={isDragging ? "hover" : "idle"}
                    className={cn(
                        "relative z-10 flex flex-col items-center justify-center p-16 md:p-20 text-center",
                        "border-2 border-dashed rounded-xl m-6",
                        "transition-colors duration-300",
                        isDragging && "border-purple-500/40 bg-purple-500/5",
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-6 p-5 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20"
                    >
                        <Upload className="h-12 w-12 text-purple-500" />
                    </motion.div>

                    <motion.div layout className="space-y-3 mb-6">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Upload CSV Files</h2>
                        <p className="text-zinc-400 text-lg max-w-md mx-auto">
                            Drag and drop your CSV files here, or click to browse
                        </p>
                    </motion.div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        multiple
                        onChange={handleInputChange}
                        className="hidden"
                        id="file-upload"
                    />

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            size="lg"
                            className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/20 px-8 py-6 text-lg h-auto"
                        >
                            <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                animate={{
                                    x: ["0%", "200%"],
                                    transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                                }}
                            />
                            <span className="relative z-10 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Select Files
                            </span>
                        </Button>
                    </motion.div>
                </motion.div>
            </Card>

            {/* Progress and alerts */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <Card className="p-8 mt-6 border border-zinc-800 shadow-lg bg-gradient-to-br from-zinc-900 to-black rounded-xl">
                            <h3 className="font-medium mb-3 text-lg text-white">Processing files...</h3>
                            <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-800">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                                        animate={{
                                            x: ["0%", "100%"],
                                            transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-zinc-400 mt-3">{progress}% complete</p>
                        </Card>
                    </motion.div>
                )}

                {filesCount > 0 && !isLoading && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <Alert className="mt-6 border border-zinc-800 shadow-lg bg-gradient-to-br from-zinc-900 to-black rounded-xl p-6">
                            <FileText className="h-5 w-5 text-purple-500" />
                            <AlertTitle className="text-lg font-medium mb-2">Files uploaded</AlertTitle>
                            <AlertDescription className="text-zinc-400">
                                You have {filesCount} file(s) uploaded. Go to the "Manage Files" tab to compare them or "Analyze File"
                                to examine a single file.
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

