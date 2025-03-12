import type { Metadata } from "next"
import "./globals.css"
import { siteConfig } from "@/core/config/site-config"
import { ClientLayout } from "./layout-client"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClientLayout>{children}</ClientLayout>
    </html>
  )
}

