import FileUploader from "@/components/file-uploader"
import FileManager from "@/components/file-manager"
import ProtectedDemoSection from "@/components/protected-demo-section"

interface FilesTabProps {
    files: any[]
    isLoading: boolean
    progress: number
    selectedFiles: string[]
    comparisonField: string
    onUpload: (files: FileList) => void
    onToggleSelection: (id: string) => void
    onComparisonFieldChange: (field: string) => void
    onCompare: () => void
    onRemoveFile: (id: string) => void
    onViewFile: (id: string) => void
}

export function FilesTab({
    files,
    isLoading,
    progress,
    selectedFiles,
    comparisonField,
    onUpload,
    onToggleSelection,
    onComparisonFieldChange,
    onCompare,
    onRemoveFile,
    onViewFile,
}: FilesTabProps) {
    return (
        <>
            <div className="mb-4">
                <FileUploader
                    isLoading={isLoading}
                    progress={progress}
                    filesCount={files.length}
                    onUpload={onUpload}
                    onUploadComplete={() => { }}
                />
            </div>
            <FileManager
                files={files}
                selectedFiles={selectedFiles}
                comparisonField={comparisonField}
                onToggleSelection={onToggleSelection}
                onComparisonFieldChange={onComparisonFieldChange}
                onCompare={onCompare}
                onRemoveFile={onRemoveFile}
                onViewFile={onViewFile}
            />
            <div className="mt-6">
                <ProtectedDemoSection />
            </div>
        </>
    )
} 