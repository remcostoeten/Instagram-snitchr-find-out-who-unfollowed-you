import { Download, BarChart2, Search, Filter, ArrowUpDown, X, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { FileData } from "@/types"
import { useFileAnalysis } from "@/hooks/use-file-analysis"
import { exportToCSV } from "@/utils/csv-export"
import { Separator } from "./ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table"

interface FileAnalyzerProps {
  files: FileData[]
  activeFileId: string | null
  showAllColumns: boolean
  onToggleShowAllColumns: (value: boolean) => void
}

export default function FileAnalyzer({
  files,
  activeFileId,
  showAllColumns,
  onToggleShowAllColumns,
}: FileAnalyzerProps) {
  const {
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
  } = useFileAnalysis(files, activeFileId)

  if (!activeFile) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No file selected</AlertTitle>
        <AlertDescription>Please select a file to analyze from the "Manage Files" tab.</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{activeFile.name}</h2>
          <Badge variant="outline">{activeFile.data.length} rows</Badge>
          {filteredData.length !== activeFile.data.length && (
            <Badge variant="secondary">{filteredData.length} filtered</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(filteredData, `${activeFile.name.split(".")[0]}-filtered.csv`)}
            disabled={filteredData.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BarChart2 className="h-4 w-4 mr-1" />
                Statistics
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>File Statistics</DialogTitle>
                <DialogDescription>Statistical analysis of {activeFile.name}</DialogDescription>
              </DialogHeader>
              {stats && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">General Stats</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Total Rows:</span>
                          <span className="font-medium">{stats.totalRows}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Columns:</span>
                          <span className="font-medium">{activeFile.columns.length}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Follow Status</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Followed by you:</span>
                          <span className="font-medium">{stats.followedByYou.YES || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Not followed:</span>
                          <span className="font-medium">{stats.followedByYou.NO || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Follow ratio:</span>
                          <span className="font-medium">
                            {(((stats.followedByYou.YES || 0) / stats.totalRows) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Verification Status</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Verified accounts:</span>
                          <span className="font-medium">{stats.isVerified.YES || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Non-verified accounts:</span>
                          <span className="font-medium">{stats.isVerified.NO || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified ratio:</span>
                          <span className="font-medium">
                            {(((stats.isVerified.YES || 0) / stats.totalRows) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Search & Filter</h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search in any field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Active Filters</h4>
                {filters.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No filters applied</p>
                ) : (
                  <div className="space-y-2">
                    {filters.map((filter, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
                        <div>
                          <span className="font-medium">{filter.column}</span>
                          <span className="mx-1">{filter.type}</span>
                          <span>"{filter.value}"</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeFilter(index)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Add Filter</h4>
                <div className="space-y-2">
                  <Select
                    value={newFilter.column}
                    onValueChange={(value) => setNewFilter({ ...newFilter, column: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeFile.columns.map((column) => (
                        <SelectItem key={column} value={column.toLowerCase().replace(/\s+/g, "")}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={newFilter.type}
                    onValueChange={(value) => setNewFilter({ ...newFilter, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="startsWith">Starts with</SelectItem>
                      <SelectItem value="endsWith">Ends with</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Filter value"
                    value={newFilter.value}
                    onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                  />

                  <Button className="w-full" disabled={!newFilter.column || !newFilter.value} onClick={addFilter}>
                    <Filter className="h-4 w-4 mr-1" />
                    Add Filter
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Data Preview</h3>
            <div className="flex items-center space-x-2">
              <Switch id="show-all-columns-analyze" checked={showAllColumns} onCheckedChange={onToggleShowAllColumns} />
              <Label htmlFor="show-all-columns-analyze">Show all columns</Label>
            </div>
          </div>

          <div className="rounded border">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("userId")}>
                      User ID
                      {sortConfig?.key === "userId" && <ArrowUpDown className="inline ml-1 h-3 w-3" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>
                      Username
                      {sortConfig?.key === "username" && <ArrowUpDown className="inline ml-1 h-3 w-3" />}
                    </TableHead>
                    {showAllColumns &&
                      activeFile.columns.map((column) => {
                        const normalizedColumn = column.toLowerCase().replace(/\s+/g, "")
                        if (normalizedColumn !== "userid" && normalizedColumn !== "username") {
                          return (
                            <TableHead
                              key={column}
                              className="cursor-pointer"
                              onClick={() => handleSort(normalizedColumn)}
                            >
                              {column}
                              {sortConfig?.key === normalizedColumn && <ArrowUpDown className="inline ml-1 h-3 w-3" />}
                            </TableHead>
                          )
                        }
                        return null
                      })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={showAllColumns ? activeFile.columns.length + 1 : 3}
                        className="text-center py-8"
                      >
                        No data found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.userId}</TableCell>
                        <TableCell>{item.username}</TableCell>
                        {showAllColumns &&
                          activeFile.columns.map((column) => {
                            const normalizedColumn = column.toLowerCase().replace(/\s+/g, "")
                            if (normalizedColumn !== "userid" && normalizedColumn !== "username") {
                              return <TableCell key={column}>{item[normalizedColumn]}</TableCell>
                            }
                            return null
                          })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </>
  )
}

