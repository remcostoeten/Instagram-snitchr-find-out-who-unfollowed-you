"use client"

import { useState, useMemo, useEffect } from "react"
import type { FileData, SortConfig, FilterConfig, FileStatistics } from "@/types"

export function useFileAnalysis(files: FileData[], activeFileId: string | null) {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [newFilter, setNewFilter] = useState<FilterConfig>({ column: "", value: "", type: "contains" })
  const [stats, setStats] = useState<FileStatistics>(null)

  // Get active file data
  const activeFile = useMemo(() => {
    return files.find((file) => file.id === activeFileId) || null
  }, [files, activeFileId])

  // Apply filters and search to data
  const filteredData = useMemo(() => {
    if (!activeFile) return []

    let result = [...activeFile.data]

    // Apply search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter((item) => {
        return Object.values(item).some((value) => value && value.toString().toLowerCase().includes(lowerSearchTerm))
      })
    }

    // Apply filters
    if (filters.length > 0) {
      result = result.filter((item) => {
        return filters.every((filter) => {
          const value = item[filter.column]
          if (!value) return false

          const itemValue = value.toString().toLowerCase()
          const filterValue = filter.value.toLowerCase()

          switch (filter.type) {
            case "contains":
              return itemValue.includes(filterValue)
            case "equals":
              return itemValue === filterValue
            case "startsWith":
              return itemValue.startsWith(filterValue)
            case "endsWith":
              return itemValue.endsWith(filterValue)
            default:
              return true
          }
        })
      })
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || ""
        const bValue = b[sortConfig.key] || ""

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [activeFile, searchTerm, filters, sortConfig])

  // Calculate statistics for the active file
  useEffect(() => {
    if (!activeFile) {
      setStats(null)
      return
    }

    const data = activeFile.data
    const stats: FileStatistics = {
      totalRows: data.length,
      columns: {},
      followedByYou: {
        YES: 0,
        NO: 0,
      },
      isVerified: {
        YES: 0,
        NO: 0,
      },
    }

    // Count values for each column
    activeFile.columns.forEach((column) => {
      const values: { [key: string]: number } = {}

      data.forEach((item) => {
        const value = item[column.toLowerCase().replace(/\s+/g, "")]
        if (value) {
          values[value] = (values[value] || 0) + 1
        }
      })

      stats.columns[column] = values
    })

    // Count followed/verified
    data.forEach((item) => {
      if (item.followedByYou) {
        stats.followedByYou[item.followedByYou] = (stats.followedByYou[item.followedByYou] || 0) + 1
      }

      if (item.isVerified) {
        stats.isVerified[item.isVerified] = (stats.isVerified[item.isVerified] || 0) + 1
      }
    })

    setStats(stats)
  }, [activeFile])

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        }
      }
      return { key, direction: "asc" }
    })
  }

  const addFilter = () => {
    if (newFilter.column && newFilter.value) {
      setFilters((prev) => [...prev, { ...newFilter }])
      setNewFilter({ column: "", value: "", type: "contains" })
    }
  }

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index))
  }

  const clearFilters = () => {
    setFilters([])
  }

  return {
    activeFile,
    filteredData,
    searchTerm,
    setSearchTerm,
    sortConfig,
    handleSort,
    filters,
    newFilter,
    setNewFilter,
    addFilter,
    removeFilter,
    clearFilters,
    stats,
  }
}

