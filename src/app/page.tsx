"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import FileUploader from "@/components/file-uploader"
import FileManager from "@/components/file-manager"
import FileAnalyzer from "@/components/file-analyzer"
import ComparisonResults from "@/components/comparison-results"
import DemoPasswordForm from "@/components/demo-password-form"
import DemoDataLoader from "@/components/demo-data-loader"
import ProtectedDemoSection from "@/components/protected-demo-section"
import { useCSVFiles } from "@/hooks/use-csv-files"
import { useComparison } from "@/hooks/use-comparison"
import { Switch } from "@/components/ui/switch"
import { BannerWithIcon } from "@/components/landing/banner-with-icon"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { toast } from "sonner"
import { siteConfig } from "@/core/config/site-config"

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [showAllColumns, setShowAllColumns] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  const [isDemoPasswordModalOpen, setIsDemoPasswordModalOpen] = useState<boolean>(false)

  const { files, isLoading, progress, uploadFiles, removeFile, activeFileId, setActiveFileId } = useCSVFiles()

  const { selectedFiles, toggleFileSelection, comparisonField, setComparisonField, comparisonResult, compareFiles } =
    useComparison(files)

  // Initialize dark mode on component mount
  useEffect(() => {
    // Apply the initial theme based on isDarkMode state
    // If isDarkMode is true, we don't need the "light" class
    document.documentElement.classList.toggle("light", !isDarkMode);
  }, []);

  // Handle Instagram demo data loading
  useEffect(() => {
    const handleDemoDataLoaded = (event: CustomEvent) => {
      // Wait for the file to be processed
      setTimeout(() => {
        if (files.length >= 2) {
          // Find the Instagram data files
          const instagramFiles = files.filter(file =>
            file.name.toLowerCase().includes('instagram') ||
            file.name.toLowerCase().includes('followers')
          );

          if (instagramFiles.length >= 2) {
            // Clear any existing selections
            selectedFiles.forEach(id => {
              toggleFileSelection(id);
            });

            // Select exactly two files for comparison
            toggleFileSelection(instagramFiles[0].id);
            toggleFileSelection(instagramFiles[1].id);

            // Set a comparison field (username is a good default for Instagram data)
            setComparisonField('Username');

            // Compare and go to results
            compareFiles();
            setActiveTab("results");
          }
        }
      }, 800);
    };

    // Add the event listener
    window.addEventListener('demoDataLoaded', handleDemoDataLoaded as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('demoDataLoaded', handleDemoDataLoaded as EventListener);
    };
  }, [files, toggleFileSelection, setComparisonField, compareFiles, setActiveTab, selectedFiles]);

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
    // Calculate the new value
    const newIsDarkMode = !isDarkMode;

    // Update the state
    setIsDarkMode(newIsDarkMode);

    // Toggle the class using the new value, not the current one
    // When newIsDarkMode is true, we should NOT have the "light" class
    // When newIsDarkMode is false, we SHOULD have the "light" class
    document.documentElement.classList.toggle("light", !newIsDarkMode);

    // Show a toast notification for better feedback
    toast.success(
      newIsDarkMode ? "Dark Mode Enabled" : "Light Mode Enabled",
      {
        description: newIsDarkMode
          ? "The application is now in dark mode"
          : "The application is now in light mode"
      }
    );
  }

  // Handle navigating to demo section
  const handleViewDemo = () => {
    // First navigate to the "Manage Files" tab
    setActiveTab("files");

    // Then open the demo password modal
    setIsDemoPasswordModalOpen(true);
  }

  // Handle successful demo login
  const handleDemoSuccess = () => {
    // Close the modal
    setIsDemoPasswordModalOpen(false);

    // Dispatch the demo event to load files (will be handled by the demo component)
    const demoReadyEvent = new CustomEvent('demoReady');
    window.dispatchEvent(demoReadyEvent);
  }

  // Add a function to handle comparison and tab switching
  const handleCompareFiles = () => {
    compareFiles()
    // Switch to the results tab after comparison
    setActiveTab("results")
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${isDarkMode ? "" : "light"}`}>
      {/* Hidden component to handle demo data loading */}
      <DemoDataLoader />

      <header className="border-b border-border bg-secondary p-4">
        <div className="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-medium">
              <span className="text-primary">CSV</span> Comparison Tool
            </h1>
            <p className="text-sm text-muted-foreground">{siteConfig.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="dark-mode" className="text-sm text-muted-foreground">
              Dark Mode
            </Label>
            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleToggleDarkMode} />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="mb-6">
          <BannerWithIcon onViewDemo={handleViewDemo} />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-secondary border border-border p-1 rounded-lg">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md"
            >
              Upload Files
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md"
            >
              Manage Files
            </TabsTrigger>
            <TabsTrigger
              value="analyze"
              className="data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md"
            >
              Analyze File
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md"
            >
              Compare Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 border-clean p-4 bg-secondary rounded-lg">
            <FileUploader
              isLoading={isLoading}
              progress={progress}
              filesCount={files.length}
              onUpload={uploadFiles}
              onUploadComplete={handleUploadComplete}
            />
          </TabsContent>

          <TabsContent value="files" className="space-y-4 border-clean p-4 bg-secondary rounded-lg">
            <div className="mb-4">
              <FileUploader
                isLoading={isLoading}
                progress={progress}
                filesCount={files.length}
                onUpload={uploadFiles}
                onUploadComplete={() => { }}
              />
            </div>
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

            {/* Show demo data details for authenticated users */}
            <div className="mt-6">
              <ProtectedDemoSection />
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-4 border-clean p-4 bg-secondary rounded-lg">
            <FileAnalyzer
              files={files}
              activeFileId={activeFileId}
              showAllColumns={showAllColumns}
              onToggleShowAllColumns={setShowAllColumns}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-4 border-clean p-4 bg-secondary rounded-lg">
            <ComparisonResults
              comparisonResult={comparisonResult}
              showAllColumns={showAllColumns}
              onToggleShowAllColumns={setShowAllColumns}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Demo Password Modal */}
      <Dialog open={isDemoPasswordModalOpen} onOpenChange={setIsDemoPasswordModalOpen}>
        <DialogContent className="bg-secondary border border-border sm:max-w-md">
          <DemoPasswordForm onSuccess={handleDemoSuccess} />
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border bg-secondary p-4 text-center text-sm text-white/60">
        <div>
          <span className="text-primary">CSV Comparison Tool</span>
          <span className="mx-2">—</span>
          <span>Compare and analyze your CSV data with powerful features</span>
        </div>
      </footer>
    </div>
  )
}

