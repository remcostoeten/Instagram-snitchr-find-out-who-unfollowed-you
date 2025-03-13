import FileAnalyzer from "@/components/file-analyzer"

interface AnalyzeTabProps {
    files: any[]
    activeFileId: string | null
    showAllColumns: boolean
    onToggleShowAllColumns: (show: boolean) => void
}

export function AnalyzeTab({
    files,
    activeFileId,
    showAllColumns,
    onToggleShowAllColumns,
}: AnalyzeTabProps) {
    return (
        <FileAnalyzer
            files={files}
            activeFileId={activeFileId}
            showAllColumns={showAllColumns}
            onToggleShowAllColumns={onToggleShowAllColumns}
        />
    )
} 