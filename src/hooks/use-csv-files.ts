"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Papa from "papaparse"
import type { UserData } from "@/types"
import { createFile, deleteFile } from "@/modules/ig-csv/api/mutations/files"
import { useGetFiles } from "@/modules/ig-csv/api/queries/files"

export function useCSVFiles() {
  const storeFiles = useGetFiles()
  const [files, setFiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use effect to update files from store to prevent infinite renders
  useEffect(() => {
    // Convert from store format to app format
    const convertedFiles = storeFiles.map((file) => ({
      id: file.id,
      name: file.name,
      data: file.data as UserData[],
      columns: file.columns,
    }))

    setFiles(convertedFiles)
  }, [storeFiles])

  const uploadFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    setIsLoading(true)
    setProgress(0)

    const filesArray = Array.from(event.target.files)
    let processedFiles = 0

    filesArray.forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data as Record<string, string>[]
          console.log(`Parsed ${file.name} with ${parsedData.length} rows and columns:`, results.meta.fields)

          // Map the data to our UserData type
          const userData: UserData[] = parsedData.map((row, index) => {
            // Try to identify columns based on common names
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
                // Normalize the key to avoid case sensitivity issues
                const normalizedKey = key.toLowerCase().replace(/\s+/g, "")
                userData[normalizedKey] = row[key]
              }
            })

            return userData
          })

          // Get columns from the first row or from meta.fields
          const columns = results.meta.fields || (parsedData.length > 0 ? Object.keys(parsedData[0]) : [])

          console.log(`Creating file with ${userData.length} rows and ${columns.length} columns`)

          // Create file in store
          createFile({
            name: file.name,
            originalName: file.name,
            folderId: null,
            labels: [],
            data: userData,
            columns,
          })

          processedFiles++
          setProgress(Math.round((processedFiles / filesArray.length) * 100))

          if (processedFiles === filesArray.length) {
            setIsLoading(false)
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error, file.name)
          processedFiles++
          setProgress(Math.round((processedFiles / filesArray.length) * 100))

          if (processedFiles === filesArray.length) {
            setIsLoading(false)
          }
        },
      })
    })
  }

  const removeFile = (id: string) => {
    deleteFile(id)

    if (activeFileId === id) {
      setActiveFileId(null)
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
  }
}

