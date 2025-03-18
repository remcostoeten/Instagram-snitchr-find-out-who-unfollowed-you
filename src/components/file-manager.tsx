"use client"

import { useState, useEffect, useRef } from "react"
import { Diff, FileSearch, X, FolderOpen, Tag, Calendar, MoreHorizontal, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import FolderManager from "./folder-manager"
import LabelManager from "./label-manager"
import { useGetFolders } from "@/modules/ig-csv/api/queries/folders"
import { useGetLabels } from "@/modules/ig-csv/api/queries/labels"
import { moveFileToFolder, addLabelToFile, removeLabelFromFile, updateFile } from "@/modules/ig-csv/api/mutations/files"
import type { FileData } from "@/types"
import { getFiles } from "@/modules/ig-csv/api/queries/files"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { toast } from "sonner"
import { DocumentTitle } from "./document-title"

interface FileManagerProps {
  files: FileData[]
  selectedFiles: string[]
  comparisonField: string
  onToggleSelection: (id: string) => void
  onComparisonFieldChange: (field: string) => void
  onCompare: () => void
  onRemoveFile: (id: string) => void
  onViewFile: (id: string) => void
}

export default function FileManager({
  files,
  selectedFiles,
  comparisonField,
  onToggleSelection,
  onComparisonFieldChange,
  onCompare,
  onRemoveFile,
  onViewFile,
}: FileManagerProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null)
  const [fileForFolderMove, setFileForFolderMove] = useState<string | null>(null)
  const [fileForLabelManagement, setFileForLabelManagement] = useState<string | null>(null)
  const [isMoveFolderDialogOpen, setIsMoveFolderDialogOpen] = useState(false)
  const [isManageLabelsDialogOpen, setIsManageLabelsDialogOpen] = useState(false)
  const [highlightCompareButton, setHighlightCompareButton] = useState(false)

  const compareButtonRef = useRef<HTMLButtonElement>(null)

  const folders = useGetFolders()
  const labels = useGetLabels()
  const moveToFolder = moveFileToFolder
  const addLabel = addLabelToFile
  const removeLabel = removeLabelFromFile
  const rename = updateFile

  const storeFiles = files

  const filteredFiles = files.filter((file) => {
    const storeFile = storeFiles.find((sf) => sf.id === file.id)
    if (!storeFile) return false

    if (selectedFolderId && storeFile.folderId !== selectedFolderId) {
      return false
    }

    if (selectedLabelId && !storeFile.labels.includes(selectedLabelId)) {
      return false
    }

    return true
  })

  const handleMoveToFolder = (folderId: string | null) => {
    if (fileForFolderMove) {
      moveToFolder(fileForFolderMove, folderId)

      // Get file and folder names for the toast
      const fileName = storeFiles.find(f => f.id === fileForFolderMove)?.name || "File"
      const folderName = folderId
        ? folders.find(f => f.id === folderId)?.name || "folder"
        : "All Files"

      // Show toast notification
      toast.success("File moved", {
        description: `"${fileName}" has been moved to "${folderName}"`
      })

      setFileForFolderMove(null)
      setIsMoveFolderDialogOpen(false)
    }
  }

  const handleToggleLabel = (labelId: string) => {
    if (!fileForLabelManagement) return

    const storeFile = storeFiles.find((f) => f.id === fileForLabelManagement)
    if (!storeFile) return

    const fileName = storeFile.name || "File"
    const labelName = labels.find(l => l.id === labelId)?.name || "label"

    if (storeFile.labels.includes(labelId)) {
      removeLabel(fileForLabelManagement, labelId)
      toast.info("Label removed", {
        description: `"${labelName}" has been removed from "${fileName}"`
      })
    } else {
      addLabel(fileForLabelManagement, labelId)
      toast.success("Label added", {
        description: `"${labelName}" has been added to "${fileName}"`
      })
    }
  }

  // Handle demo data loaded event
  useEffect(() => {
    const handleDemoDataLoaded = (event: CustomEvent) => {
      // Check if we should highlight the compare button
      const shouldHighlight = event.detail?.highlightCompare === true;

      if (shouldHighlight && files.length >= 2) {
        console.log("Highlighting compare button after demo files loaded");

        // Set the highlight state for the animation
        setHighlightCompareButton(true);

        // After 5 seconds, remove the highlight effect
        setTimeout(() => {
          setHighlightCompareButton(false);
        }, 5000);

        // Optional: Scroll to the compare button to make sure it's visible
        if (compareButtonRef.current) {
          compareButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    };

    // Add event listener for demo data loaded
    window.addEventListener('demoDataLoaded', handleDemoDataLoaded as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('demoDataLoaded', handleDemoDataLoaded as EventListener);
    };
  }, [files.length]);

  if (files.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No files uploaded</AlertTitle>
        <AlertDescription>Please upload some CSV files first to compare them.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
      <div className="space-y-6">
        <FolderManager onSelectFolder={setSelectedFolderId} selectedFolderId={selectedFolderId} />

        <LabelManager onSelectLabel={setSelectedLabelId} selectedLabelId={selectedLabelId} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl font-semibold">
            {selectedFolderId
              ? `Folder: ${folders.find(f => f.id === selectedFolderId)?.name}`
              : selectedLabelId
                ? `Label: ${labels.find(l => l.id === selectedLabelId)?.name}`
                : "All Files"}
            <span className="text-muted-foreground ml-2 text-sm">({filteredFiles.length})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {(selectedFolderId || selectedLabelId) && (
              <div className="flex items-center gap-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-2">Filters:</span>
                  {selectedFolderId && (
                    <Badge variant="outline" className="flex items-center gap-1 mr-2">
                      <FolderOpen className="h-3 w-3 mr-1" />
                      {folders.find(f => f.id === selectedFolderId)?.name}
                    </Badge>
                  )}
                  {selectedLabelId && (
                    <Badge
                      className="flex items-center gap-1"
                      style={{
                        backgroundColor: labels.find(l => l.id === selectedLabelId)?.color + "20",
                        color: labels.find(l => l.id === selectedLabelId)?.color,
                        borderColor: labels.find(l => l.id === selectedLabelId)?.color + "50"
                      }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {labels.find(l => l.id === selectedLabelId)?.name}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs flex items-center"
                  onClick={() => {
                    setSelectedFolderId(null);
                    setSelectedLabelId(null);
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            )}

            <div className="flex items-center ml-auto gap-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="comparison-field" className="text-sm whitespace-nowrap">Compare by:</Label>
                <select
                  id="comparison-field"
                  value={comparisonField}
                  onChange={(e) => onComparisonFieldChange(e.target.value)}
                  className="p-1 text-sm rounded bg-background border"
                >
                  <option value="userId">User ID</option>
                  <option value="username">Username</option>
                </select>
              </div>
              <Button
                ref={compareButtonRef}
                onClick={() => {
                  console.log("Compare button clicked with selected files:", selectedFiles)
                  if (selectedFiles.length !== 2) {
                    toast.error("Selection required", {
                      description: "Please select exactly two files to compare"
                    });
                    return
                  }
                  onCompare();
                  toast.success("Comparison started", {
                    description: "Comparing the selected files..."
                  });
                }}
                disabled={selectedFiles.length !== 2}
                size="sm"
                className={`transition-all ${highlightCompareButton ?
                  'animate-pulse shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-1 scale-110' :
                  ''
                  }`}
              >
                <Diff className="h-4 w-4 mr-2" />
                Compare ({selectedFiles.length}/2)
              </Button>
            </div>
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No files found</AlertTitle>
            <AlertDescription>
              {selectedFolderId || selectedLabelId ?
                "No files match your current filters. Try adjusting your folder or label selection." :
                "You haven't uploaded any files yet."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => {
              const storeFile = storeFiles.find((sf) => sf.id === file.id)
              const fileFolder = storeFile?.folderId ? folders.find((f) => f.id === storeFile.folderId) : null
              const fileLabels =
                storeFile?.labels.map((labelId) => labels.find((l) => l.id === labelId)).filter(Boolean) || []

              return (
                <Card key={file.id} className="p-4 space-y-3">
                  {/* Header section with checkbox, title, and actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Checkbox
                        id={`select-${file.id}`}
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => {
                          console.log("Toggling file selection:", file.id)
                          onToggleSelection(file.id)
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <DocumentTitle
                          initialTitle={file.name}
                          onTitleChange={(newName) => rename(file.id, newName)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Button variant="outline" size="sm" onClick={() => onViewFile(file.id)}>
                        <FileSearch className="h-4 w-4 mr-1" />
                        Analyze
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setFileForFolderMove(file.id)
                              setIsMoveFolderDialogOpen(true)
                            }}
                          >
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Move to folder
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setFileForLabelManagement(file.id)
                              setIsManageLabelsDialogOpen(true)
                            }}
                          >
                            <Tag className="h-4 w-4 mr-2" />
                            Manage labels
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const fileName = file.name || "File";
                              onRemoveFile(file.id);
                              toast.success("File removed", {
                                description: `"${fileName}" has been removed`
                              });
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* File metadata section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {file.data.length} rows
                      </Badge>
                      {storeFile && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(storeFile.createdAt), "MMM d, yyyy")}
                        </Badge>
                      )}
                    </div>

                    {/* Folder and labels */}
                    <div className="flex flex-wrap gap-2">
                      {fileFolder && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {fileFolder.name}
                        </Badge>
                      )}

                      {fileLabels.map(
                        (label) =>
                          label && (
                            <Badge
                              key={label.id}
                              variant="outline"
                              className="flex items-center gap-1"
                              style={{
                                backgroundColor: label.color ? `${label.color}20` : undefined,
                                borderColor: label.color || undefined,
                              }}
                            >
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: label.color || "#3b82f6" }} />
                              {label.name}
                            </Badge>
                          ),
                      )}
                    </div>

                    {/* Columns preview */}
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-2 items-center">
                      <span>Columns:</span>
                      <div className="flex flex-wrap gap-1">
                        {file.columns.slice(0, 3).map((col, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {col}
                          </Badge>
                        ))}
                        {file.columns.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{file.columns.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {selectedFiles.length !== 2 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Select two files</AlertTitle>
            <AlertDescription>Please select exactly two files to compare.</AlertDescription>
          </Alert>
        )}

        {/* Move to folder dialog */}
        <Dialog open={isMoveFolderDialogOpen} onOpenChange={setIsMoveFolderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move to Folder</DialogTitle>
              <DialogDescription>Select a folder to move this file to.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => handleMoveToFolder(null)}>
                <FolderOpen className="h-4 w-4 mr-2" />
                No folder (root)
              </Button>

              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleMoveToFolder(folder.id)}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  {folder.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage labels dialog */}
        <Dialog open={isManageLabelsDialogOpen} onOpenChange={setIsManageLabelsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Labels</DialogTitle>
              <DialogDescription>Add or remove labels for this file.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {labels.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No labels created yet. Create labels in the sidebar first.
                </p>
              ) : (
                labels.map((label) => {
                  const storeFile = fileForLabelManagement
                    ? storeFiles.find((f) => f.id === fileForLabelManagement)
                    : null
                  const isSelected = storeFile?.labels.includes(label.id) || false

                  return (
                    <div key={label.id} className="flex items-center">
                      <Checkbox
                        id={`label-${label.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggleLabel(label.id)}
                      />
                      <Label htmlFor={`label-${label.id}`} className="ml-2 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: label.color || "#3b82f6" }} />
                        {label.name}
                      </Label>
                    </div>
                  )
                })
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

