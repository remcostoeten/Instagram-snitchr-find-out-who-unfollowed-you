"use client"

import { useState, useCallback } from "react"
import type { FileData, ComparisonResult } from "@/types"

export function useComparison(files: FileData[]) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [comparisonField, setComparisonField] = useState<string>("userId")
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult>(null)

  const toggleFileSelection = useCallback((id: string) => {
    setSelectedFiles((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fileId) => fileId !== id)
      } else {
        return [...prev, id]
      }
    })
  }, [])

  const compareFiles = useCallback(() => {
    if (selectedFiles.length !== 2) {
      console.error("Exactly two files must be selected for comparison")
      return
    }

    const file1 = files.find((file) => file.id === selectedFiles[0])
    const file2 = files.find((file) => file.id === selectedFiles[1])

    if (!file1 || !file2) {
      console.error("Selected files not found")
      return
    }

    console.log("Comparing files:", file1.name, "and", file2.name)
    console.log("Using comparison field:", comparisonField)

    // Create maps for faster lookups
    const file1Map = new Map()
    const file2Map = new Map()

    // Ensure we're using the correct field for comparison
    file1.data.forEach((item) => {
      const key = item[comparisonField]
      if (key) {
        file1Map.set(key, item)
      }
    })

    file2.data.forEach((item) => {
      const key = item[comparisonField]
      if (key) {
        file2Map.set(key, item)
      }
    })

    const onlyInFirst = []
    const onlyInSecond = []
    const inBoth = []
    const differences = []

    // Find items only in first file and items in both
    file1.data.forEach((item) => {
      const key = item[comparisonField]
      if (!key) return // Skip items without the comparison key

      if (!file2Map.has(key)) {
        onlyInFirst.push(item)
      } else {
        const item2 = file2Map.get(key)
        inBoth.push(item)

        // Check for differences in fields
        const diffFields = []

        // Get all unique keys from both items
        const allKeys = new Set([...Object.keys(item), ...Object.keys(item2)])

        // Check each key for differences
        allKeys.forEach((key) => {
          if (key !== comparisonField && item[key] !== item2[key]) {
            diffFields.push(key)
          }
        })

        if (diffFields.length > 0) {
          differences.push({ item, diffFields })
        }
      }
    })

    // Find items only in second file
    file2.data.forEach((item) => {
      const key = item[comparisonField]
      if (!key) return // Skip items without the comparison key

      if (!file1Map.has(key)) {
        onlyInSecond.push(item)
      }
    })

    console.log("Comparison results:", {
      onlyInFirst: onlyInFirst.length,
      onlyInSecond: onlyInSecond.length,
      inBoth: inBoth.length,
      differences: differences.length,
    })

    setComparisonResult({
      onlyInFirst,
      onlyInSecond,
      inBoth,
      differences,
    })
  }, [files, selectedFiles, comparisonField])

  return {
    selectedFiles,
    comparisonField,
    comparisonResult,
    toggleFileSelection,
    setComparisonField,
    compareFiles,
  }
}

