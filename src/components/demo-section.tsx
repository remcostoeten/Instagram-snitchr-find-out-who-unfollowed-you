"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Download, FileText, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { revokeDemoAccess } from "@/app/actions"

interface DemoFile {
  name: string
  path: string
  description: string
  preview: Array<Record<string, string>>
}

export default function DemoSection() {
  const router = useRouter()

  const demoFile: DemoFile = {
    name: "Instagram Followers Export",
    path: "/demo-instagram-followers.csv",
    description: "A sample Instagram followers export with profile information. Perfect for testing the comparison functionality.",
    preview: [
      { "User ID": "29213893", "Username": "demo_user1", "Fullname": "Demo User One", "Follow by you": "YES", "Is verified": "NO", "Followers": "152", "Followings": "288" },
      { "User ID": "174843391", "Username": "demo_user2", "Fullname": "Demo User Two", "Follow by you": "YES", "Is verified": "NO", "Followers": "313", "Followings": "166" },
      { "User ID": "350593368", "Username": "demo_user3", "Fullname": "Demo User Three", "Follow by you": "YES", "Is verified": "NO", "Followers": "803", "Followings": "355" },
    ]
  }

  const handleCopyContent = async (path: string) => {
    try {
      const response = await fetch(path)
      const text = await response.text()
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard", {
        description: "Instagram followers data has been copied to your clipboard."
      })
    } catch (error) {
      toast.error("Failed to copy", {
        description: "Could not copy the data. Please try downloading instead."
      })
    }
  }

  const handleLogout = async () => {
    try {
      await revokeDemoAccess()
      toast.success("Logged out", {
        description: "You have been logged out of the demo section."
      })
      // Force a hard refresh to ensure the server re-evaluates the cookie
      window.location.reload()
    } catch (error) {
      toast.error("Error", {
        description: "Failed to log out. Please try again."
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Demo Data Details</CardTitle>
          <CardDescription>
            Preview and download Instagram follower data samples for testing the comparison tool.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </CardHeader>
      <CardContent>
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {demoFile.name}
            </CardTitle>
            <CardDescription>{demoFile.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            <div className="max-h-60 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(demoFile.preview[0]).map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoFile.preview.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/20 py-2">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleCopyContent(demoFile.path)}>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={demoFile.path} download>
                  <Download className="h-4 w-4 mr-1" /> Download
                </a>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  )
} 