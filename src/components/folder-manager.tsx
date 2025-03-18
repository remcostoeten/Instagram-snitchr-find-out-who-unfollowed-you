"use client"

import { useState } from "react"
import { Folder, FolderPlus, Edit, Trash2, X } from "lucide-react"
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
import { useGetFolders } from "@/modules/ig-csv/api/queries/folders"
import { createFolder as createFolderAction, updateFolder as updateFolderAction, deleteFolder as deleteFolderAction } from "@/modules/ig-csv/api/mutations/folders"
import { getFiles } from "@/modules/ig-csv/api/queries/files"
import { toast } from "sonner"

interface FolderManagerProps {
  onSelectFolder: (folderId: string | null) => void
  selectedFolderId: string | null
}

export default function FolderManager({ onSelectFolder, selectedFolderId }: FolderManagerProps) {
  const folders = useGetFolders()
  const createFolder = createFolderAction
  const updateFolder = updateFolderAction
  const deleteFolder = deleteFolderAction
  const allFiles = getFiles()

  const [newFolderName, setNewFolderName] = useState("")
  const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim())
      toast.success("Folder created", {
        description: `"${newFolderName.trim()}" folder has been created`
      })
      setNewFolderName("")
      setIsCreateDialogOpen(false)
    } else {
      toast.error("Invalid folder name", {
        description: "Please enter a valid folder name"
      })
    }
  }

  const handleUpdateFolder = () => {
    if (editingFolder && editingFolder.name.trim()) {
      updateFolder(editingFolder.id, editingFolder.name.trim())
      toast.success("Folder updated", {
        description: `Folder has been renamed to "${editingFolder.name.trim()}"`
      })
      setEditingFolder(null)
      setIsEditDialogOpen(false)
    } else {
      toast.error("Invalid folder name", {
        description: "Please enter a valid folder name"
      })
    }
  }

  const handleDeleteFolder = () => {
    if (editingFolder) {
      const folderName = editingFolder.name

      deleteFolder(editingFolder.id)
      if (selectedFolderId === editingFolder.id) {
        onSelectFolder(null)
      }

      toast.success("Folder deleted", {
        description: `"${folderName}" folder has been deleted`
      })

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
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Folders</h3>
          {selectedFolderId && (
            <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
              {folders.find(f => f.id === selectedFolderId)?.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => onSelectFolder(null)}
                title="Clear folder selection"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
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
        <div
          className={`flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer ${selectedFolderId === null ? "bg-accent/50" : ""
            }`}
          onClick={() => onSelectFolder(null)}
        >
          <div className="flex items-center">
            <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">All Files</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {allFiles.length}
          </Badge>
        </div>
        {folders.map((folder, index) => (
          <div
            key={folder.id}
            className={`flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer ${selectedFolderId === folder.id ? "bg-accent border border-border" : ""
              }`}
            onClick={() => onSelectFolder(folder.id)}
          >
            <div className="flex items-center">
              <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{folder.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs">
                {filesByFolder[index]}
              </Badge>
              <div className="flex" onClick={(e) => e.stopPropagation()}>
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
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingFolder({ id: folder.id, name: folder.name })
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingFolder({ id: folder.id, name: folder.name })
                      }}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

