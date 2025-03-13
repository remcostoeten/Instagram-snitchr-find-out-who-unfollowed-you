"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TabContent } from "@/components/tabs/tab-content"
import DemoPasswordForm from "@/components/demo-password-form"
import DemoDataLoader from "@/components/demo-data-loader"
import { BannerWithIcon } from "@/components/landing/banner-with-icon"
import { useAuth } from "@/modules/auth/hooks/use-auth"

import { useCSVFiles } from "@/hooks/use-csv-files"
import { useComparison } from "@/hooks/use-comparison"

export function HomeView() {
    const [activeTab, setActiveTab] = useState<string>("upload")
    const [showAllColumns, setShowAllColumns] = useState<boolean>(false)
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
    const [isDemoPasswordModalOpen, setIsDemoPasswordModalOpen] = useState<boolean>(false)
    const { user, signOut } = useAuth()

    const { files, isLoading, progress, uploadFiles, removeFile, activeFileId, setActiveFileId } = useCSVFiles()
    const { selectedFiles, toggleFileSelection, comparisonField, setComparisonField, comparisonResult, compareFiles } =
        useComparison(files)

    const handleToggleDarkMode = () => {
        setIsDarkMode(prev => !prev)
        localStorage.setItem('theme', isDarkMode ? 'light' : 'dark')
    }

    const tabProps = {
        upload: {
            isLoading,
            progress,
            filesCount: files.length,
            onUpload: uploadFiles,
            onUploadComplete: () => setActiveTab("files"),
        },
        files: {
            files,
            isLoading,
            progress,
            selectedFiles,
            comparisonField,
            onUpload: uploadFiles,
            onToggleSelection: toggleFileSelection,
            onComparisonFieldChange: setComparisonField,
            onCompare: () => {
                compareFiles()
                setActiveTab("results")
            },
            onRemoveFile: removeFile,
            onViewFile: (id: string) => {
                setActiveFileId(id)
                setActiveTab("analyze")
            },
        },
        analyze: {
            files,
            activeFileId,
            showAllColumns,
            onToggleShowAllColumns: setShowAllColumns,
        },
        results: {
            comparisonResult,
            showAllColumns,
            onToggleShowAllColumns: setShowAllColumns,
        },
    }

    return (
        <div className={`min-h-screen bg-background text-foreground flex flex-col ${isDarkMode ? "" : "light"}`}>
            <Header
                isDarkMode={isDarkMode}
                onToggleDarkMode={handleToggleDarkMode}
                user={user}
                onSignOut={signOut}
            />

            {/* Add padding-top to account for fixed header */}
            <div className="pt-[3.5rem] flex-1">
                <div className="mt-6">
                    <BannerWithIcon
                        onViewDemo={() => {
                            setIsDemoPasswordModalOpen(true)
                        }}
                    />
                </div>
                <DemoDataLoader />

                <main className="flex-1 container pb-6">
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

                        {Object.keys(tabProps).map((tab) => (
                            <TabContent key={tab} value={tab} props={tabProps[tab as keyof typeof tabProps]} />
                        ))}
                    </Tabs>
                </main>
            </div>

            <Footer />

            <Dialog open={isDemoPasswordModalOpen} onOpenChange={setIsDemoPasswordModalOpen}>
                <DialogContent className="bg-secondary border border-border sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Demo Access</DialogTitle>
                    </DialogHeader>
                    <DemoPasswordForm onSuccess={() => {
                        setIsDemoPasswordModalOpen(false)
                        window.dispatchEvent(new CustomEvent('demoReady'))
                    }} />
                </DialogContent>
            </Dialog>
        </div>
    )
} 