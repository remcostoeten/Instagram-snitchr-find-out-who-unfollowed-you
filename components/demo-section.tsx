"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Download, ExternalLink, FileText, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useCSVFiles } from "@/hooks/use-csv-files"
import { revokeDemoAccess } from "@/app/actions"

interface DemoFile {
  name: string
  path: string
  description: string
  preview: Array<Record<string, string>>
}

export default function DemoSection() {
  const { toast } = useToast()
  const router = useRouter()
  const { uploadFiles } = useCSVFiles()
  const [activeTab, setActiveTab] = useState<string>("users")

  const demoFiles: Record<string, DemoFile[]> = {
    users: [
      {
        name: "User Data (Basic)",
        path: "/demo-users-1.csv",
        description: "A basic user dataset with demographic and subscription information.",
        preview: [
          { "User ID": "1", "Username": "john_doe", "Email": "john.doe@example.com", "Age": "32", "Subscription": "Premium", "JoinDate": "2022-01-15" },
          { "User ID": "2", "Username": "jane_smith", "Email": "jane.smith@example.com", "Age": "28", "Subscription": "Basic", "JoinDate": "2022-02-20" },
          { "User ID": "3", "Username": "bob_johnson", "Email": "bob.johnson@example.com", "Age": "45", "Subscription": "Premium", "JoinDate": "2021-11-05" },
        ]
      },
      {
        name: "User Data (Extended)",
        path: "/demo-users-2.csv",
        description: "An extended user dataset with additional LastLogin field and different user entries.",
        preview: [
          { "User ID": "1", "Username": "john_doe", "Email": "john.doe@example.com", "Age": "32", "Subscription": "Premium", "JoinDate": "2022-01-15", "LastLogin": "2023-06-10" },
          { "User ID": "2", "Username": "jane_smith", "Email": "jane.smith@example.com", "Age": "29", "Subscription": "Premium", "JoinDate": "2022-02-20", "LastLogin": "2023-06-12" },
          { "User ID": "11", "Username": "kevin_taylor", "Email": "kevin.t@example.com", "Age": "34", "Subscription": "Premium", "JoinDate": "2022-03-15", "LastLogin": "2023-06-07" },
        ]
      }
    ],
    instagram: [
      {
        name: "Instagram Followers Export",
        path: "/demo-instagram-followers.csv",
        description: "A sample Instagram followers export with profile information.",
        preview: [
          { "User ID": "29213893", "Username": "iamfrenk", "Fullname": "Frenk", "Follow by you": "YES", "Is verified": "NO", "Followers": "152", "Followings": "288" },
          { "User ID": "174843391", "Username": "_amymegan", "Fullname": "Amy", "Follow by you": "YES", "Is verified": "NO", "Followers": "313", "Followings": "166" },
          { "User ID": "350593368", "Username": "edieheemels", "Fullname": "Edie Heemels", "Follow by you": "YES", "Is verified": "NO", "Followers": "803", "Followings": "355" },
        ]
      }
    ]
  }

  const handleCopyContent = async (path: string) => {
    try {
      const response = await fetch(path)
      const text = await response.text()
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "CSV content has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the CSV content. Please try downloading instead.",
        variant: "destructive",
      })
    }
  }

  const handleUseDemo = (demoFile: DemoFile) => {
    // Create a File object from the demo file path
    fetch(demoFile.path)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch demo file: ${response.status} ${response.statusText}`)
        }
        return response.text()
      })
      .then(text => {
        const file = new File([text], demoFile.name + ".csv", { type: "text/csv" })
        
        // Create a fake event with the file
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        const event = {
          target: {
            files: dataTransfer.files
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>
        
        // Upload the file using the existing hook
        uploadFiles(event)
        
        toast({
          title: "Demo file loaded",
          description: `${demoFile.name} has been loaded. Go to the "Manage Files" tab to view it.`,
        })
      })
      .catch(error => {
        console.error("Error loading demo file:", error)
        toast({
          title: "Failed to load demo",
          description: "Could not load the demo file. Please try downloading and uploading manually.",
          variant: "destructive",
        })
      })
  }

  const handleLogout = async () => {
    try {
      await revokeDemoAccess()
      toast({
        title: "Logged out",
        description: "You have been logged out of the demo section.",
      })
      // Force a hard refresh to ensure the server re-evaluates the cookie
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Try with Demo Data</CardTitle>
          <CardDescription>
            Preview, copy, or use these demo CSV files to test the comparison tool without uploading your own data.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Data Examples</TabsTrigger>
            <TabsTrigger value="instagram">Instagram Export Example</TabsTrigger>
          </TabsList>
          
          {Object.entries(demoFiles).map(([category, files]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {files.map((demoFile, index) => (
                <Card key={index} className="overflow-hidden">
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
                    <Button size="sm" onClick={() => handleUseDemo(demoFile)}>
                      <ExternalLink className="h-4 w-4 mr-1" /> Use This Example
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
} 