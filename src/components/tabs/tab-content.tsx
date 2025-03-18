import { Suspense, lazy } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

const components = {
    upload: lazy(() => import("@/components/tabs/upload-tab").then((mod) => ({ default: mod.UploadTab }))),
    files: lazy(() => import("@/components/tabs/files-tab").then((mod) => ({ default: mod.FilesTab }))),
    analyze: lazy(() => import("@/components/tabs/analyze-tab").then((mod) => ({ default: mod.AnalyzeTab }))),
    results: lazy(() => import("@/components/tabs/results-tab").then((mod) => ({ default: mod.ResultsTab }))),
}

interface TabContentProps {
    value: string
    props: any
}

function TabSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-10 w-1/2 rounded-xl" />
        </div>
    )
}

export function TabContent({ value, props }: TabContentProps) {
    const Component = components[value as keyof typeof components]

    if (!Component) {
        return null
    }

    return (
        <TabsContent
            value={value}
            className="space-y-6 p-6 md:p-8 bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-zinc-800 shadow-xl"
        >
            <Suspense fallback={<TabSkeleton />}>
                <Component {...props} />
            </Suspense>
        </TabsContent>
    )
}

