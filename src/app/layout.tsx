import type { Metadata } from "next"
import { Toaster } from "sonner"
import { inter, calSans } from "@/lib/fonts"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { siteConfig } from "@/core/config/site-config"
import { Providers } from "@/providers"
import { HeroPill } from "@/components/hero-pill"

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
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        calSans.variable
      )}>
        <Header />
        <Providers>
          <HeroPill
            id="beta-announcement"
            href="#"
            label="Beta version - Still under active development, expect bugs"
            announcement="🚧 Beta"
            autoShowDelay={1000}
          />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

