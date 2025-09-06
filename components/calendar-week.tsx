"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react"
import { Task, Priority } from "@/src/lib/api"
import { useTasks } from "@/src/hooks/useTasks"
import { cn } from "@/lib/utils"

interface CalendarWeekProps {
  projectId?: string
}

export function CalendarWeek({ projectId }: CalendarWeekProps) {
  const { tasks, isLoading } = useTasks()
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Filter tasks by project if projectId is provided
  const filteredTasks = projectId 
    ? tasks.filter(task => task.projectId === projectId)
    : tasks

  // Get tasks with dueAt
  const tasksWithDueDate = filteredTasks.filter(task => task.dueAt)

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDates.push(day)
    }
    return weekDates
  }

  const weekDates = getWeekDates(currentWeek)

  const getTasksForDay = (date: Date) => {
    return tasksWithDueDate.filter(task => {
      if (!task.dueAt) return false
      const taskDate = new Date(task.dueAt)
      return taskDate.toDateString() === date.toDateString()
    })
  }

  const getTasksForHour = (date: Date, hour: number) => {
    return getTasksForDay(date).filter(task => {
      if (!task.dueAt) return false
      const taskDate = new Date(task.dueAt)
      return taskDate.getHours() === hour
    })
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "URGENT":
        return "border-l-red-500 bg-red-50 dark:bg-red-950"
      case "HIGH":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-950"
      case "MEDIUM":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      case "LOW":
        return "border-l-green-500 bg-green-50 dark:bg-green-950"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-950"
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

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  const goToToday = () => {
    setCurrentWeek(new Date())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i} className="h-96">
              <CardHeader>
                <div className="h-6 w-20 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-12 bg-muted animate-pulse rounded" />
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
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {currentWeek.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, dayIndex) => {
          const dayTasks = getTasksForDay(date)
          
          return (
            <Card key={dayIndex} className={cn("h-fit", isToday(date) && "ring-2 ring-primary")}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </CardTitle>
                <CardDescription className={cn(
                  "text-lg font-semibold",
                  isToday(date) && "text-primary"
                )}>
                  {date.getDate()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No tasks
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <Card
                        key={task.id}
                        className={cn(
                          "cursor-pointer hover:shadow-md transition-shadow border-l-4",
                          getPriorityColor(task.priority)
                        )}
                        onClick={() => {
                          // TODO: Open task edit modal
                          console.log("Edit task:", task.id)
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                              <Badge variant="outline" className={cn("text-xs", getStatusColor(task.status))}>
                                {task.status.replace("_", " ")}
                              </Badge>
                            </div>
                            
                            {task.dueAt && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(task.dueAt).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true
                                })}
                              </div>
                            )}

                            {task.project && (
                              <div className="text-xs text-muted-foreground">
                                {task.project.name}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
