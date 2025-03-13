import { Skeleton } from "@/components/ui/skeleton"

export function HomeViewSkeleton() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Beta Banner */}
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="relative -translate-y-8 max-w-2xl w-[95%]">
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>

            {/* Header */}
            <div className="border-b border-border bg-secondary p-4">
                <div className="container flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-10 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 container py-6">
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="grid w-full grid-cols-4 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 rounded-md" />
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-4 border-clean p-4 bg-secondary rounded-lg">
                        <Skeleton className="h-32 w-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Banner */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-2xl w-[95%] z-50">
                <Skeleton className="h-16 w-full rounded-lg" />
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-secondary p-4">
                <div className="container">
                    <Skeleton className="h-6 w-64 mx-auto" />
                </div>
            </div>
        </div>
    )
} 