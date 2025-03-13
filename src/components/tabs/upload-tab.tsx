import FileUploader from "@/components/file-uploader"

interface UploadTabProps {
    isLoading: boolean
    progress: number
    filesCount: number
    onUpload: (files: FileList) => void
    onUploadComplete: () => void
}

export function UploadTab({
    isLoading,
    progress,
    filesCount,
    onUpload,
    onUploadComplete,
}: UploadTabProps) {
    return (
        <FileUploader
            isLoading={isLoading}
            progress={progress}
            filesCount={filesCount}
            onUpload={onUpload}
            onUploadComplete={onUploadComplete}
        />
    )
} 