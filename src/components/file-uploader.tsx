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

interface FileUploaderProps {
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
    borderColor: "var(--border)",
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

  const validateFiles = (files: FileList | null): boolean => {
    if (!files || files.length === 0) {
      toast.error("No files selected", {
        description: "Please select at least one CSV file to upload."
      })
      return false
    }

    const invalidFiles = Array.from(files).filter(file => !file.name.toLowerCase().endsWith('.csv'))
    if (invalidFiles.length > 0) {
      toast.error("Invalid file type", {
        description: "Please only upload CSV files."
      })
      return false
    }

    return true
  }

  const handleFileUpload = (files: FileList) => {
    if (validateFiles(files)) {
      toast.loading("Processing files...", {
        description: `Uploading ${files.length} file(s)`,
        id: "upload-toast"
      });

      onUpload(files);
      onUploadComplete();

      toast.success("Files uploaded", {
        description: `Successfully processed ${files.length} file(s)`,
        id: "upload-toast"
      });
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileUpload(event.target.files);
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
      <Card className="relative overflow-hidden bg-gradient-to-br from-background to-secondary/20 border-0 shadow-2xl">
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
                <CloudUpload
                  className="text-primary/5"
                  size={[24, 32, 40][i % 3]}
                  strokeWidth={1}
                />
              ) : (
                <File
                  className="text-primary/5"
                  size={[24, 32, 40][i % 3]}
                  strokeWidth={1}
                />
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
            "relative z-10 flex flex-col items-center justify-center p-12 text-center",
            "border-2 border-dashed rounded-lg m-4",
            "border-border/10 hover:border-primary/20 transition-colors duration-300",
            isDragging && "border-primary/40 bg-accent/30"
          )}
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

          <motion.div layout className="space-y-2 mb-2">
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
            onChange={handleInputChange}
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
              className="relative overflow-hidden group bg-primary/90 hover:bg-primary"
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

      {/* Progress and alerts */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 mt-4 border-0 shadow-lg bg-secondary/50">
              <h3 className="font-medium mb-2">Processing files...</h3>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
                    animate={{
                      x: ["0%", "100%"],
                      transition: { duration: 1, repeat: Infinity },
                    }}
                  />
                </div>
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
            <Alert className="mt-4 border-0 shadow-lg bg-secondary/50">
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