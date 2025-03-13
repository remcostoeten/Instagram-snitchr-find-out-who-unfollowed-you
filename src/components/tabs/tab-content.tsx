import { Suspense, lazy } from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

const components = {
    upload: lazy(() => import('@/components/tabs/upload-tab').then(mod => ({ default: mod.UploadTab }))),
    files: lazy(() => import('@/components/tabs/files-tab').then(mod => ({ default: mod.FilesTab }))),
    analyze: lazy(() => import('@/components/tabs/analyze-tab').then(mod => ({ default: mod.AnalyzeTab }))),
    results: lazy(() => import('@/components/tabs/results-tab').then(mod => ({ default: mod.ResultsTab }))),
}

interface TabContentProps {
    value: string
    props: any
}

function TabSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
        </div>
    )
}

export function TabContent({ value, props }: TabContentProps) {
    const Component = components[value as keyof typeof components]

    return (
        <TabsContent value={value} className="space-y-4 border-clean p-4 bg-secondary rounded-lg">
            <Suspense fallback={<TabSkeleton />}>
                <Component {...props} />
            </Suspense>
        </TabsContent>
    )
} 