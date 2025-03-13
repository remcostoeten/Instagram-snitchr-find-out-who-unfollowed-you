import ComparisonResults from "@/components/comparison-results"

interface ResultsTabProps {
    comparisonResult: any
    showAllColumns: boolean
    onToggleShowAllColumns: (show: boolean) => void
}

export function ResultsTab({
    comparisonResult,
    showAllColumns,
    onToggleShowAllColumns,
}: ResultsTabProps) {
    return (
        <ComparisonResults
            comparisonResult={comparisonResult}
            showAllColumns={showAllColumns}
            onToggleShowAllColumns={onToggleShowAllColumns}
        />
    )
} 