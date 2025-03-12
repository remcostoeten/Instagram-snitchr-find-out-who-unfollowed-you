import type { ReactNode } from "react"
import { metadata } from "./metadata"
import RootLayoutClient from "./layout-client"

export { metadata }

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>
} 