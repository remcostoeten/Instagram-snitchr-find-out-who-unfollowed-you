"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Papa from "papaparse"
import type { UserData } from "@/types"
import { createFile, deleteFile } from "@/modules/ig-csv/api/mutations/files"
import { getFiles } from "@/modules/ig-csv/api/queries/files"
import { toast } from "sonner"

interface CSVFile {
  id: string
  name: string
  originalName: string
  data: Record<string, unknown>[]
  columns: string[]
  userId: string
  folderId: string | null
  labels: string[]
  createdAt: Date
  updatedAt: Date
  folder?: {
    id: string
    name: string
    description: string | null
    color: string | null
    icon: string | null
    isArchived: boolean | null
  } | null
}

export function useCSVFiles() {
  const [files, setFiles] = useState<CSVFile[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch files on mount
  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await getFiles()
      if (response.success && response.files) {
        setFiles(response.files.map(file => ({
          ...file,
          data: file.data as Record<string, unknown>[],
          columns: file.columns as string[],
          labels: file.labels as string[],
          createdAt: new Date(file.createdAt),
          updatedAt: new Date(file.updatedAt)
        })))
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Failed to fetch files', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      })
    }
  }

  const uploadFiles = async (input: FileList | React.ChangeEvent<HTMLInputElement>) => {
    let fileList: FileList;

    if ('target' in input) {
      if (!input.target.files || input.target.files.length === 0) return;
      fileList = input.target.files;
    } else {
      if (input.length === 0) return;
      fileList = input;
    }

    setIsLoading(true);
    setProgress(0);

    const filesArray = Array.from(fileList);
    let processedFiles = 0;

    for (const file of filesArray) {
      try {
        await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
              try {
                const parsedData = results.data as Record<string, string>[]
                console.log(`Parsed ${file.name} with ${parsedData.length} rows and columns:`, results.meta.fields)

                // Map the data to our UserData type
                const userData: UserData[] = parsedData.map((row, index) => {
                  const userId =
                    row["User ID"] ||
                    row["UserId"] ||
                    row["userId"] ||
                    row["user_id"] ||
                    row["ID"] ||
                    row["id"] ||
                    Object.values(row)[0] ||
                    `row-${index}`

                  const username =
                    row["Username"] ||
                    row["username"] ||
                    row["user"] ||
                    row["name"] ||
                    row["Name"] ||
                    Object.values(row)[1] ||
                    `user-${index}`

                  const userData: UserData = {
                    userId,
                    username,
                  }

                  // Add all other columns
                  Object.keys(row).forEach((key) => {
                    if (key !== "User ID" && key !== "Username") {
                      const normalizedKey = key.toLowerCase().replace(/\s+/g, "")
                      userData[normalizedKey] = row[key]
                    }
                  })

                  return userData
                })

                // Get columns from the first row or from meta.fields
                const columns = results.meta.fields || (parsedData.length > 0 ? Object.keys(parsedData[0]) : [])

                console.log(`Creating file with ${userData.length} rows and ${columns.length} columns`)

                // Create FormData for the server action
                const formData = new FormData()
                formData.append('name', file.name)
                formData.append('originalName', file.name)
                formData.append('data', JSON.stringify(userData))
                formData.append('columns', JSON.stringify(columns))
                formData.append('labels', JSON.stringify([]))

                // Create file in database
                const result = await createFile(formData)
                if (!result.success) {
                  throw new Error(result.error)
                }

                processedFiles++
                setProgress(Math.round((processedFiles / filesArray.length) * 100))

                if (processedFiles === filesArray.length) {
                  setIsLoading(false)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                  toast.success('Files uploaded successfully')
                  await fetchFiles() // Refresh the files list
                }

                resolve(null)
              } catch (error) {
                reject(error)
              }
            },
            error: (error) => {
              reject(error)
            },
          })
        })
      } catch (error) {
        console.error("Error processing file:", error)
        toast.error("Failed to process file", {
          description: error instanceof Error ? error.message : "An unknown error occurred"
        })
      }
    }

    setIsLoading(false)
  }

  const removeFile = async (id: string) => {
    try {
      const result = await deleteFile(id)
      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success('File deleted successfully')
      await fetchFiles() // Refresh the files list

      if (activeFileId === id) {
        setActiveFileId(null)
      }
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error("Failed to delete file", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      })
    }
  }

  return {
    files,
    isLoading,
    progress,
    activeFileId,
    fileInputRef,
    uploadFiles,
    removeFile,
    setActiveFileId,
    refreshFiles: fetchFiles,
  }
}

