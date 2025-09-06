"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTask } from "@/src/hooks/useTasks"
import { useTasks } from "@/src/hooks/useTasks"
import { toast } from "@/src/lib/toast"

export function QuickAddDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useTasks()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "n" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
      }
    }

    const handleOpenQuickAdd = () => {
      setOpen(true)
    }

    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("open-quick-add", handleOpenQuickAdd)
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("open-quick-add", handleOpenQuickAdd)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      await createTask({
        title: title.trim(),
        status: "TODO",
        priority: "MEDIUM"
      })
      
      // Revalidate the tasks list
      mutate()
      
      // Reset form and close dialog
      setTitle("")
      setOpen(false)
      toast.success("Task created successfully!")
    } catch (error) {
      console.error("Failed to create task:", error)
      toast.error("Failed to create task. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Quick Add Task</DialogTitle>
            <DialogDescription>
              Create a new task quickly. Press Cmd+N to open this dialog.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!title.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
