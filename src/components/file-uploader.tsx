"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Upload, FileText, File } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  isLoading: boolean
  progress: number
  filesCount: number
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUploadComplete: () => void
}

// Floating file animation variants
const floatingFileVariants = {
  initial: (custom: number) => ({
    opacity: 0,
    y: 20,
    x: custom,
    rotate: custom > 0 ? 15 : -15,
  }),
  animate: (custom: number) => ({
    opacity: [0, 0.2, 0.1],
    y: [20, -20, 20],
    x: [custom, custom + (custom > 0 ? 20 : -20), custom],
    rotate: [custom > 0 ? 15 : -15, custom > 0 ? -5 : 5, custom > 0 ? 15 : -15],
    transition: {
      duration: 5 + Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
}

// File drop animation variants
const dropZoneVariants = {
  idle: {
    scale: 1,
    opacity: 1,
    borderColor: "var(--muted-foreground)",
    backgroundColor: "var(--background)",
  },
  hover: {
    scale: 1.02,
    opacity: 1,
    borderColor: "var(--primary)",
    backgroundColor: "var(--accent)",
  },
}

export default function FileUploader({
  isLoading,
  progress,
  filesCount,
  onUpload,
  onUploadComplete,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      toast.loading("Processing files...", {
        description: `Uploading ${event.target.files.length} file(s)`,
        id: "upload-toast"
      })

      onUpload(event)
      onUploadComplete()

      toast.success("Files uploaded", {
        description: `Successfully processed ${event.target.files.length} file(s)`,
        id: "upload-toast"
      })
    } else {
      toast.error("No files selected", {
        description: "Please select at least one CSV file to upload."
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      const dataTransfer = new DataTransfer()
      droppedFiles.forEach(file => dataTransfer.items.add(file))

      const event = {
        target: {
          files: dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>

      handleFileUpload(event)
    }
  }

  return (
    <>
      <Card className="p-8 relative overflow-hidden bg-gradient-to-br from-background to-secondary/50">
        {/* Animated floating files background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              custom={[-150, -100, -50, 50, 100, 150][i]}
              variants={floatingFileVariants}
              initial="initial"
              animate="animate"
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <File
                className={cn(
                  "text-muted-foreground/10",
                  i % 2 === 0 ? "rotate-12" : "-rotate-12"
                )}
                size={[32, 40, 48][i % 3]}
              />
            </motion.div>
          ))}
        </div>

        {/* Upload drop zone */}
        <motion.div
          variants={dropZoneVariants}
          initial="idle"
          animate={isDragging ? "hover" : "idle"}
          className="relative z-10 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            className="mb-4 p-4 rounded-full bg-primary/10"
          >
            <Upload className="h-10 w-10 text-primary" />
          </motion.div>

          <motion.div layout className="space-y-2 mb-6">
            <h2 className="text-2xl font-semibold">Upload CSV Files</h2>
            <p className="text-muted-foreground">
              Drag and drop your CSV files here, or click to browse
            </p>
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="relative overflow-hidden group bg-primary hover:bg-primary/90"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0"
                animate={{
                  x: ["0%", "200%"],
                  transition: { duration: 2, repeat: Infinity },
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Select Files
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </Card>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 mt-4">
              <h3 className="font-medium mb-2">Processing files...</h3>
              <div className="relative">
                <Progress value={progress} className="h-2" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
                  animate={{
                    x: ["0%", "100%"],
                    transition: { duration: 1, repeat: Infinity },
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
            </Card>
          </motion.div>
        )}

        {filesCount > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="mt-4">
              <FileText className="h-4 w-4" />
              <AlertTitle>Files uploaded</AlertTitle>
              <AlertDescription>
                You have {filesCount} file(s) uploaded. Go to the "Manage Files" tab to compare them or "Analyze File" to
                examine a single file.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}