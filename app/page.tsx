"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import FileUploader from "@/components/file-uploader"
import FileManager from "@/components/file-manager"
import FileAnalyzer from "@/components/file-analyzer"
import ComparisonResults from "@/components/comparison-results"
import ProtectedDemoSection from "@/components/protected-demo-section"
import { useCSVFiles } from "@/hooks/use-csv-files"
import { useComparison } from "@/hooks/use-comparison"

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [showAllColumns, setShowAllColumns] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)

  const { files, isLoading, progress, uploadFiles, removeFile, activeFileId, setActiveFileId } = useCSVFiles()

  const { selectedFiles, toggleFileSelection, comparisonField, setComparisonField, comparisonResult, compareFiles } =
    useComparison(files)

  // Handle file upload completion
  const handleUploadComplete = () => {
    setActiveTab("files")
  }

  // Handle file selection for analysis
  const handleViewFile = (id: string) => {
    setActiveFileId(id)
    setActiveTab("analyze")
  }

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("light", !isDarkMode)
  }

  // Add a function to handle comparison and tab switching
  const handleCompareFiles = () => {
    compareFiles()
    // Switch to the results tab after comparison
    setActiveTab("results")
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${isDarkMode ? "" : "light"}`}>
      <header className="border-b bg-card p-4">
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold">Advanced CSV Comparison Tool</h1>
          <div className="flex items-center gap-2">
            <Label htmlFor="dark-mode" className="text-sm">
              Dark Mode
            </Label>
            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleToggleDarkMode} />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="files">Manage Files</TabsTrigger>
            <TabsTrigger value="analyze">Analyze File</TabsTrigger>
            <TabsTrigger value="results">Compare Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <FileUploader
              isLoading={isLoading}
              progress={progress}
              filesCount={files.length}
              onUpload={uploadFiles}
              onUploadComplete={handleUploadComplete}
            />
            <ProtectedDemoSection />
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <FileManager
              files={files}
              selectedFiles={selectedFiles}
              comparisonField={comparisonField}
              onToggleSelection={toggleFileSelection}
              onComparisonFieldChange={setComparisonField}
              onCompare={handleCompareFiles}
              onRemoveFile={removeFile}
              onViewFile={handleViewFile}
            />
          </TabsContent>

          <TabsContent value="analyze" className="space-y-4">
            <FileAnalyzer
              files={files}
              activeFileId={activeFileId}
              showAllColumns={showAllColumns}
              onToggleShowAllColumns={setShowAllColumns}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <ComparisonResults
              comparisonResult={comparisonResult}
              showAllColumns={showAllColumns}
              onToggleShowAllColumns={setShowAllColumns}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-card p-4 text-center text-sm text-muted-foreground">
        Advanced CSV Comparison Tool - Compare and analyze your CSV data with powerful features
      </footer>
    </div>
  )
}

