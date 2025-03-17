import type { Metadata } from "next"
import "./globals.css"
import { siteConfig } from "@/core/config/site-config"
import { ClientLayout } from "./layout-client"
import { Toaster } from 'sonner'

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
      <head />
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

