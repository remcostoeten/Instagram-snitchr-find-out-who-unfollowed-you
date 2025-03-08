"use client"

import { useState } from "react"
import { Diff, FileSearch, X, FolderOpen, Tag, Calendar, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import FolderManager from "./folder-manager"
import LabelManager from "./label-manager"
import { useGetFolders } from "@/modules/ig-csv/api/queries/folders"
import { useGetLabels } from "@/modules/ig-csv/api/queries/labels"
import { useMoveFileToFolder } from "@/modules/ig-csv/api/mutations/files"
import { useAddLabelToFile, useRemoveLabelFromFile } from "@/modules/ig-csv/api/mutations/files"
import type { FileData } from "@/types"
import { useGetFiles } from "@/modules/ig-csv/api/queries/files" // Import useGetFiles

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

  const folders = useGetFolders()
  const labels = useGetLabels()
  const moveFileToFolder = useMoveFileToFolder()
  const addLabelToFile = useAddLabelToFile()
  const removeLabelFromFile = useRemoveLabelFromFile()

  // Get the actual file objects from the store to access metadata
  const storeFiles = useGetFiles()

  // Filter files based on selected folder and label
  const filteredFiles = files.filter((file) => {
    const storeFile = storeFiles.find((sf) => sf.id === file.id)
    if (!storeFile) return false

    // Filter by folder
    if (selectedFolderId && storeFile.folderId !== selectedFolderId) {
      return false
    }

    // Filter by label
    if (selectedLabelId && !storeFile.labels.includes(selectedLabelId)) {
      return false
    }

    return true
  })

  const handleMoveToFolder = (folderId: string | null) => {
    if (fileForFolderMove) {
      moveFileToFolder(fileForFolderMove, folderId)
      setFileForFolderMove(null)
      setIsMoveFolderDialogOpen(false)
    }
  }

  const handleToggleLabel = (labelId: string) => {
    if (!fileForLabelManagement) return

    const storeFile = storeFiles.find((f) => f.id === fileForLabelManagement)
    if (!storeFile) return

    if (storeFile.labels.includes(labelId)) {
      removeLabelFromFile(fileForLabelManagement, labelId)
    } else {
      addLabelToFile(fileForLabelManagement, labelId)
    }
  }

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {selectedFolderId
              ? `Files in "${folders.find((f) => f.id === selectedFolderId)?.name}"`
              : selectedLabelId
                ? `Files with label "${labels.find((l) => l.id === selectedLabelId)?.name}"`
                : "All Files"}
            ({filteredFiles.length})
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="comparison-field">Compare by:</Label>
              <select
                id="comparison-field"
                value={comparisonField}
                onChange={(e) => onComparisonFieldChange(e.target.value)}
                className="p-2 rounded bg-background border"
              >
                <option value="userId">User ID</option>
                <option value="username">Username</option>
              </select>
            </div>
            <Button
              onClick={() => {
                console.log("Compare button clicked with selected files:", selectedFiles)
                if (selectedFiles.length !== 2) {
                  alert("Please select exactly two files to compare")
                  return
                }
                onCompare()
              }}
              disabled={selectedFiles.length !== 2}
            >
              <Diff className="h-4 w-4 mr-2" />
              Compare Selected Files
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredFiles.map((file) => {
            const storeFile = storeFiles.find((sf) => sf.id === file.id)
            const fileFolder = storeFile?.folderId ? folders.find((f) => f.id === storeFile.folderId) : null
            const fileLabels =
              storeFile?.labels.map((labelId) => labels.find((l) => l.id === labelId)).filter(Boolean) || []

            return (
              <Card key={file.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`select-${file.id}`}
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={() => {
                        console.log("Toggling file selection:", file.id)
                        onToggleSelection(file.id)
                      }}
                    />
                    <Label htmlFor={`select-${file.id}`} className="font-medium">
                      {file.name}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{file.data.length} rows</Badge>
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
                        <DropdownMenuItem onClick={() => onRemoveFile(file.id)}>
                          <X className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
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

                  {storeFile && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(storeFile.createdAt), "MMM d, yyyy")}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <span>Columns: </span>
                  {file.columns.slice(0, 3).map((col, i) => (
                    <Badge key={i} variant="secondary" className="mr-1">
                      {col}
                    </Badge>
                  ))}
                  {file.columns.length > 3 && <Badge variant="secondary">+{file.columns.length - 3} more</Badge>}
                </div>
              </Card>
            )
          })}
        </div>

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

