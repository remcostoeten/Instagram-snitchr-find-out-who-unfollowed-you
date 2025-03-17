"use client"

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useCSVFiles } from '@/modules/ig-csv/hooks/use-csv-files'

export default function DemoDataLoader() {
    const { uploadFiles } = useCSVFiles()

    // Set up event listener for demo ready event
    useEffect(() => {
        const handleDemoReady = () => {
            loadDemoData()
        }

        // Add event listener
        window.addEventListener('demoReady', handleDemoReady)

        // Clean up
        return () => {
            window.removeEventListener('demoReady', handleDemoReady)
        }
    }, [])

    const loadDemoData = async () => {
        toast.loading("Loading demo data...", {
            description: "Please wait while we prepare the Instagram followers data.",
            id: "demo-loading"
        })

        try {
            // Load the Instagram followers demo file
            const demoFilePath = "/demo-instagram-followers.csv"
            const response = await fetch(demoFilePath)

            if (!response.ok) {
                throw new Error(`Failed to fetch demo file: ${response.status} ${response.statusText}`)
            }

            const text = await response.text()

            if (!text || text.trim() === '') {
                throw new Error("The demo file appears to be empty")
            }

            // First file - original Instagram data
            const file1 = new File([text], "Instagram Followers Export.csv", { type: "text/csv" })

            // Create a fake event with the file
            const dataTransfer1 = new DataTransfer()
            dataTransfer1.items.add(file1)
            const event1 = {
                target: {
                    files: dataTransfer1.files
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>

            // Upload the first file
            uploadFiles(event1)

            // Create a modified version for the second file for comparison
            setTimeout(() => {
                const modifiedText = text.replace(
                    /"User ID":"29213893"/,
                    '"User ID":"29213894"'
                ).replace(
                    /"Username":"demo_user1"/,
                    '"Username":"demo_user1_updated"'
                )

                const file2 = new File(
                    [modifiedText],
                    "Updated Instagram Followers Export.csv",
                    { type: "text/csv" }
                )

                const dataTransfer2 = new DataTransfer()
                dataTransfer2.items.add(file2)
                const event2 = {
                    target: {
                        files: dataTransfer2.files
                    }
                } as unknown as React.ChangeEvent<HTMLInputElement>

                // Upload the second file
                uploadFiles(event2)

                // Notify when both files are loaded
                setTimeout(() => {
                    const customEvent = new CustomEvent('demoDataLoaded', {
                        detail: {
                            type: 'instagram',
                            highlightCompare: true
                        }
                    })
                    window.dispatchEvent(customEvent)

                    toast.success("Demo data loaded", {
                        description: "Two Instagram followers files have been loaded for comparison.",
                        id: "demo-loading" // This will replace the loading toast
                    })
                }, 600)
            }, 300)
        } catch (error) {
            console.error("Error loading demo data:", error)
            toast.error("Failed to load demo", {
                description: "Could not load the Instagram data. The file might be missing or inaccessible.",
                id: "demo-loading" // This will replace the loading toast
            })
        }
    }

    // This component doesn't render anything visible
    return null
} 