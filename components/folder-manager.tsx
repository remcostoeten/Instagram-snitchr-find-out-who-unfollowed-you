"use client"

import { useState } from "react"
import { Folder, FolderPlus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGetFolders } from "@/src/modules/ig-csv/api/queries/folders"
import { useGetFiles } from "@/src/modules/ig-csv/api/queries/files" // Import useGetFiles
import { useCreateFolder, useUpdateFolder, useDeleteFolder } from "@/src/modules/ig-csv/api/mutations/folders"

interface FolderManagerProps {
  onSelectFolder: (folderId: string | null) => void
  selectedFolderId: string | null
}

export default function FolderManager({ onSelectFolder, selectedFolderId }: FolderManagerProps) {
  const folders = useGetFolders()
  const createFolder = useCreateFolder()
  const updateFolder = useUpdateFolder()
  const deleteFolder = useDeleteFolder()
  const allFiles = useGetFiles() // Get all files

  const [newFolderName, setNewFolderName] = useState("")
  const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim())
      setNewFolderName("")
      setIsCreateDialogOpen(false)
    }
  }

  const handleUpdateFolder = () => {
    if (editingFolder && editingFolder.name.trim()) {
      updateFolder(editingFolder.id, editingFolder.name.trim())
      setEditingFolder(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteFolder = () => {
    if (editingFolder) {
      deleteFolder(editingFolder.id)
      if (selectedFolderId === editingFolder.id) {
        onSelectFolder(null)
      }
      setEditingFolder(null)
      setIsDeleteDialogOpen(false)
    }
  }

  // Compute file counts without using hooks in a loop
  const filesByFolder = folders.map((folder) => {
    return allFiles.filter((file) => file.folderId === folder.id).length
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Folders</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FolderPlus className="h-4 w-4 mr-1" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>Enter a name for your new folder.</DialogDescription>
            </DialogHeader>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="mt-4"
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <Button
          variant={selectedFolderId === null ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectFolder(null)}
        >
          <Folder className="h-4 w-4 mr-2" />
          All Files
        </Button>

        {folders.map((folder, index) => {
          const fileCount = filesByFolder[index]

          return (
            <div key={folder.id} className="flex items-center">
              <Button
                variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
                className="flex-1 justify-start"
                onClick={() => onSelectFolder(folder.id)}
              >
                <Folder className="h-4 w-4 mr-2" />
                {folder.name}
                <Badge variant="outline" className="ml-2">
                  {fileCount}
                </Badge>
              </Button>

              <Dialog
                open={isEditDialogOpen && editingFolder?.id === folder.id}
                onOpenChange={(open) => {
                  setIsEditDialogOpen(open)
                  if (!open) setEditingFolder(null)
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingFolder({ id: folder.id, name: folder.name })}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Folder</DialogTitle>
                    <DialogDescription>Update the folder name.</DialogDescription>
                  </DialogHeader>
                  <Input
                    value={editingFolder?.name || ""}
                    onChange={(e) => setEditingFolder((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    placeholder="Folder name"
                    className="mt-4"
                  />
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateFolder}>Update</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isDeleteDialogOpen && editingFolder?.id === folder.id}
                onOpenChange={(open) => {
                  setIsDeleteDialogOpen(open)
                  if (!open) setEditingFolder(null)
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingFolder({ id: folder.id, name: folder.name })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Folder</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the folder "{editingFolder?.name}"? Files in this folder will not
                      be deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteFolder}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )
        })}
      </div>
    </div>
  )
}

