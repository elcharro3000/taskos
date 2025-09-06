"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Task, Priority } from "@/src/lib/api"
import { Clock, Calendar, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    disabled: isDragging,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "HIGH":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDueDate = (dueAt: string | null) => {
    if (!dueAt) return null
    
    const due = new Date(dueAt)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `Overdue ${Math.abs(diffDays)}d`
    } else if (diffDays === 0) {
      return "Due today"
    } else if (diffDays === 1) {
      return "Due tomorrow"
    } else {
      return `Due in ${diffDays}d`
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow rounded-2xl",
        isSortableDragging && "opacity-50",
        isDragging && "opacity-50 rotate-2"
      )}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
            <Badge variant="outline" className={cn("text-xs", getStatusColor(task.status))}>
              {task.status.replace("_", " ")}
            </Badge>
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
              {task.priority}
            </Badge>
            
            {task.dueAt && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formatDueDate(task.dueAt)}
              </div>
            )}
          </div>

          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.slice(0, 3).map((label) => (
                <Badge
                  key={label.id}
                  variant="outline"
                  className="text-xs"
                  style={{ backgroundColor: label.color + "20", borderColor: label.color }}
                >
                  {label.name}
                </Badge>
              ))}
              {task.labels.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{task.labels.length - 3}
                </Badge>
              )}
            </div>
          )}

          {task.project && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {task.project.name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
