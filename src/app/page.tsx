import { Metadata } from "next"
import { Suspense } from "react"
import { HomeViewSkeleton } from "@/views/home/skeleton"
import { siteConfig } from "@/core/config/site-config"
import { HomeView } from "@/views/home/view"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["Instagram", "unfollowers", "osint", "snitch", "analysis", "data", "tools"],
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.links.github,
    },
  ],
  creator: siteConfig.author,
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeViewSkeleton />}>
      <HomeView />
    </Suspense>
  )
}

