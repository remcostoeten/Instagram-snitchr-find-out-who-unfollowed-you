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
import { useComparison } from "@/modules/ig-csv/hooks/use-comparison"
import { useCSVFiles } from "@/modules/ig-csv/hooks/use-csv-files"

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
        setIsDarkMode((prev) => !prev)
        localStorage.setItem("theme", isDarkMode ? "light" : "dark")
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
        <div className={`min-h-screen bg-black text-foreground flex flex-col ${isDarkMode ? "" : "light"}`}>
            <Header isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} user={user} onSignOut={signOut} />

            {/* Main content with gradient background */}
            <div className="pt-[4.5rem] flex-1 bg-gradient-to-b from-black via-black to-zinc-900">
                <div className="mt-8 mb-10 px-4 md:px-8">
                    <BannerWithIcon
                        onViewDemo={() => {
                            setIsDemoPasswordModalOpen(true)
                        }}
                    />
                </div>
                <DemoDataLoader />

                <main className="flex-1 container max-w-6xl pb-16">
                    <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                        <div className="relative">
                            {/* Glowing background effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-xl blur-xl opacity-30"></div>

                            <TabsList className="relative grid w-full grid-cols-4 bg-black/60 backdrop-blur-sm border border-zinc-800 p-1.5 rounded-xl overflow-hidden">
                                {["upload", "files", "analyze", "results"].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        disabled={tab === "analyze" && !files.length || tab === "results" && !comparisonResult}
                                        className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-none rounded-lg py-3 transition-all duration-200 capitalize"
                                    >
                                        {tab
                                            .replace(/([A-Z])/g, " $1")
                                            .split(" ")
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(" ")}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {Object.entries(tabProps).map(([tab, props]) => (
                            <TabContent
                                key={tab}
                                value={tab}
                                props={props}
                            />
                        ))}
                    </Tabs>
                </main>
            </div>

            <Footer />

            {isDemoPasswordModalOpen && (
                <Dialog open={isDemoPasswordModalOpen} onOpenChange={setIsDemoPasswordModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enter Demo Password</DialogTitle>
                        </DialogHeader>
                        <DemoPasswordForm onSuccess={() => setIsDemoPasswordModalOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

