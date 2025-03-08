"use client"

import type React from "react"

import { useRef } from "react"
import { Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileUploaderProps {
  isLoading: boolean
  progress: number
  filesCount: number
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUploadComplete: () => void
}

export default function FileUploader({
  isLoading,
  progress,
  filesCount,
  onUpload,
  onUploadComplete,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(event)
    if (event.target.files && event.target.files.length > 0) {
      onUploadComplete()
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Upload CSV Files</h2>
          <p className="text-muted-foreground mb-4">Drag and drop your CSV files here, or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button onClick={() => fileInputRef.current?.click()}>Select Files</Button>
        </div>
      </Card>

      {isLoading && (
        <Card className="p-6">
          <h3 className="font-medium mb-2">Processing files...</h3>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
        </Card>
      )}

      {filesCount > 0 && (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>Files uploaded</AlertTitle>
          <AlertDescription>
            You have {filesCount} file(s) uploaded. Go to the "Manage Files" tab to compare them or "Analyze File" to
            examine a single file.
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}

