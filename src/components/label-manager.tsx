"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, X, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useGetLabels } from "@/modules/ig-csv/api/queries/labels"
import { useGetFiles } from "@/modules/ig-csv/api/queries/files"
import { useCreateLabel, useUpdateLabel, useDeleteLabel } from "@/modules/ig-csv/api/mutations/labels"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { toast } from "sonner"

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
      toast.success("Label created", {
        description: `"${newLabel.name.trim()}" label has been created`
      })
      setNewLabel({ name: "", color: "#3b82f6" })
      setIsCreateDialogOpen(false)
    } else {
      toast.error("Invalid label name", {
        description: "Please enter a valid label name"
      })
    }
  }

  const handleUpdateLabel = () => {
    if (editingLabel && editingLabel.name.trim() && editingLabel.color) {
      updateLabel(editingLabel.id, editingLabel.name.trim(), editingLabel.color)
      toast.success("Label updated", {
        description: `Label has been updated to "${editingLabel.name.trim()}"`
      })
      setEditingLabel(null)
      setIsEditDialogOpen(false)
    } else {
      toast.error("Invalid label information", {
        description: "Please enter a valid label name and color"
      })
    }
  }

  const handleDeleteLabel = () => {
    if (editingLabel) {
      const labelName = editingLabel.name

      deleteLabel(editingLabel.id)
      if (selectedLabelId === editingLabel.id) {
        onSelectLabel(null)
      }

      toast.success("Label deleted", {
        description: `"${labelName}" label has been deleted`
      })

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
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Labels</h3>
          {selectedLabelId && (
            <Badge
              className="flex items-center gap-1 px-2 py-1"
              style={{
                backgroundColor: labels.find(l => l.id === selectedLabelId)?.color + "20",
                color: labels.find(l => l.id === selectedLabelId)?.color,
                borderColor: labels.find(l => l.id === selectedLabelId)?.color + "50"
              }}
            >
              {labels.find(l => l.id === selectedLabelId)?.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0 hover:text-foreground"
                onClick={() => onSelectLabel(null)}
                title="Clear label selection"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
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

      <div className="flex flex-wrap gap-2">
        {labels.map((label) => {
          const fileCount = allFiles.filter((file) => file.labels.includes(label.id)).length

          return (
            <Badge
              key={label.id}
              className={`
                flex items-center gap-1 px-2 py-1 cursor-pointer hover:opacity-80
                ${selectedLabelId === label.id ? 'ring-2 ring-offset-1 ring-ring' : ''}
              `}
              style={{
                backgroundColor: label.color + "20",
                color: label.color,
                borderColor: label.color + "50"
              }}
              onClick={() => onSelectLabel(label.id)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {label.name}
              <span className="ml-1 rounded-full bg-secondary px-1.5 text-xs">{fileCount}</span>

              <div className="flex ml-1" onClick={(e) => e.stopPropagation()}>
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
                      className="h-4 w-4 p-0 hover:bg-secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingLabel({ id: label.id, name: label.name, color: label.color })
                      }}
                    >
                      <Edit className="h-3 w-3" />
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
                      className="h-4 w-4 p-0 hover:bg-secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingLabel({ id: label.id, name: label.name })
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
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
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
