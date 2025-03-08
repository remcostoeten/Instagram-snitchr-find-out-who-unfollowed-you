"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { useGetLabels } from "@/modules/ig-csv/api/queries/labels"
import { useGetFiles } from "@/modules/ig-csv/api/queries/files"
import { useCreateLabel, useUpdateLabel, useDeleteLabel } from "@/modules/ig-csv/api/mutations/labels"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

interface LabelManagerProps {
  onSelectLabel: (labelId: string | null) => void
  selectedLabelId: string | null
}

export default function LabelManager({ onSelectLabel, selectedLabelId }: LabelManagerProps) {
  const labels = useGetLabels()
  const createLabel = useCreateLabel()
  const updateLabel = useUpdateLabel()
  const deleteLabel = useDeleteLabel()
  const allFiles = useGetFiles()

  const [newLabel, setNewLabel] = useState({ name: "", color: "#3b82f6" })
  const [editingLabel, setEditingLabel] = useState<{ id: string; name: string; color?: string } | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleCreateLabel = () => {
    if (newLabel.name.trim()) {
      createLabel(newLabel.name.trim(), newLabel.color)
      setNewLabel({ name: "", color: "#3b82f6" })
      setIsCreateDialogOpen(false)
    }
  }

  const handleUpdateLabel = () => {
    if (editingLabel && editingLabel.name.trim()) {
      updateLabel(editingLabel.id, editingLabel.name.trim(), editingLabel.color)
      setEditingLabel(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteLabel = () => {
    if (editingLabel) {
      deleteLabel(editingLabel.id)
      if (selectedLabelId === editingLabel.id) {
        onSelectLabel(null)
      }
      setEditingLabel(null)
      setIsDeleteDialogOpen(false)
    }
  }

  // First, get all files once
  // Then compute the counts without using hooks in a loop
  const fileCounts = labels.map((label) => {
    return allFiles.filter((file) => file.labels.includes(label.id)).length
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Labels</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Label
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Label</DialogTitle>
              <DialogDescription>Enter a name and choose a color for your new label.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 mt-4">
              <Input
                value={newLabel.name}
                onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                placeholder="Label name"
              />
              <div className="flex items-center gap-2">
                <label htmlFor="label-color" className="text-sm">
                  Color:
                </label>
                <input
                  id="label-color"
                  type="color"
                  value={newLabel.color}
                  onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLabel}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {labels.map((label, index) => {
          const fileCount = fileCounts[index]
          return (
            <div key={label.id} className="flex items-center">
              <Button
                variant={selectedLabelId === label.id ? "secondary" : "ghost"}
                className="flex-1 justify-start"
                onClick={() => onSelectLabel(label.id)}
              >
                <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: label.color || "#3b82f6" }} />
                {label.name}
                <Badge variant="outline" className="ml-2">
                  {fileCount}
                </Badge>
              </Button>

              <Dialog
                open={isEditDialogOpen && editingLabel?.id === label.id}
                onOpenChange={(open) => {
                  setIsEditDialogOpen(open)
                  if (!open) setEditingLabel(null)
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setEditingLabel({
                        id: label.id,
                        name: label.name,
                        color: label.color,
                      })
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Label</DialogTitle>
                    <DialogDescription>Update the label name and color.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 mt-4">
                    <Input
                      value={editingLabel?.name || ""}
                      onChange={(e) => setEditingLabel((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                      placeholder="Label name"
                    />
                    <div className="flex items-center gap-2">
                      <label htmlFor="edit-label-color" className="text-sm">
                        Color:
                      </label>
                      <input
                        id="edit-label-color"
                        type="color"
                        value={editingLabel?.color || "#3b82f6"}
                        onChange={(e) => setEditingLabel((prev) => (prev ? { ...prev, color: e.target.value } : null))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateLabel}>Update</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isDeleteDialogOpen && editingLabel?.id === label.id}
                onOpenChange={(open) => {
                  setIsDeleteDialogOpen(open)
                  if (!open) setEditingLabel(null)
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setEditingLabel({
                        id: label.id,
                        name: label.name,
                        color: label.color,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Label</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the label "{editingLabel?.name}"?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteLabel}>
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
