"use client"

import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { List, Grid, Plus } from "lucide-react"
import { Task, TaskStatus } from "@/src/lib/api"
import { useTasks, updateTask } from "@/src/hooks/useTasks"
import { toast } from "@/src/lib/toast"
import { TaskCard } from "@/components/task-card"

const statusColumns: { status: TaskStatus; title: string; color: string }[] = [
  { status: "TODO", title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
  { status: "IN_PROGRESS", title: "In Progress", color: "bg-blue-100 dark:bg-blue-800" },
  { status: "COMPLETED", title: "Completed", color: "bg-green-100 dark:bg-green-800" },
  { status: "CANCELLED", title: "Cancelled", color: "bg-red-100 dark:bg-red-800" },
]

interface ProjectBoardProps {
  projectId?: string
  viewMode?: "list" | "board"
  onViewModeChange?: (mode: "list" | "board") => void
}

export function ProjectBoard({ projectId, viewMode = "board", onViewModeChange }: ProjectBoardProps) {
  const { tasks, mutate, isLoading } = useTasks()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Filter tasks by project if projectId is provided
  const filteredTasks = projectId 
    ? tasks.filter(task => task.projectId === projectId)
    : tasks

  const tasksByStatus = statusColumns.reduce((acc, column) => {
    acc[column.status] = filteredTasks
      .filter(task => task.status === column.status)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    return acc
  }, {} as Record<TaskStatus, Task[]>)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    // Find the current task
    const currentTask = tasks.find(task => task.id === taskId)
    if (!currentTask || currentTask.status === newStatus) return

    // Optimistic update
    const originalTasks = tasks
    mutate(
      tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
      false
    )

    try {
      setIsUpdating(true)
      await updateTask(taskId, { status: newStatus })
      toast.success("Task status updated successfully")
    } catch (error) {
      // Revert on error
      mutate(originalTasks, false)
      toast.error("Failed to update task status")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-96">
              <CardHeader>
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => onViewModeChange?.(value as "list" | "board")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Board
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {filteredTasks.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-muted-foreground">
                  Create your first task to get started
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="board">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statusColumns.map((column) => (
                <Card key={column.status} className="h-fit">
                  <CardHeader className={`${column.color} rounded-t-2xl`}>
                    <CardTitle className="text-sm font-medium">
                      {column.title}
                    </CardTitle>
                    <CardDescription>
                      {tasksByStatus[column.status].length} tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2">
                    <SortableContext
                      items={tasksByStatus[column.status].map(task => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2 min-h-[200px]">
                        {tasksByStatus[column.status].map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                        {tasksByStatus[column.status].length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No tasks
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </CardContent>
                </Card>
              ))}
            </div>

            <DragOverlay>
              {activeId ? (
                <TaskCard task={tasks.find(task => task.id === activeId)!} isDragging />
              ) : null}
            </DragOverlay>
          </DndContext>
        </TabsContent>
      </Tabs>
    </div>
  )

}
