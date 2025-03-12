import type { Metadata } from "next"
import { siteConfig } from "@/core/config/site-config"

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
} 