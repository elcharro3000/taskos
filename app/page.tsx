"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle, FolderOpen } from "lucide-react"
import { useTasks, useInboxTasks, useTodayTasks, useOverdueTasks } from "@/src/hooks/useTasks"
import { useProjects } from "@/src/hooks/useProjects"

export default function HomePage() {
  const { tasks: allTasks, isLoading: tasksLoading } = useTasks()
  const { tasks: inboxTasks, isLoading: inboxLoading } = useInboxTasks()
  const { tasks: todayTasks, isLoading: todayLoading } = useTodayTasks()
  const { tasks: overdueTasks, isLoading: overdueLoading } = useOverdueTasks()
  const { projects, isLoading: projectsLoading } = useProjects()

  const completedTasks = allTasks.filter(task => task.status === 'COMPLETED').length
  const inProgressTasks = allTasks.filter(task => task.status === 'IN_PROGRESS').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500'
      case 'IN_PROGRESS':
        return 'bg-blue-500'
      case 'TODO':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatDueDate = (dueAt: string | null) => {
    if (!dueAt) return null
    
    const due = new Date(dueAt)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`
    } else if (diffDays === 0) {
      return 'Due today'
    } else if (diffDays === 1) {
      return 'Due tomorrow'
    } else {
      return `Due in ${diffDays} days`
    }
  }

  if (tasksLoading || projectsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your tasks and projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              Active tasks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Active projects
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Your most recent tasks and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDueDate(task.dueAt) || 'No due date'}
                    </p>
                  </div>
                </div>
              ))}
              {allTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No tasks yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>
              Tasks due today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.project?.name || 'No project'}
                    </p>
                  </div>
                </div>
              ))}
              {todayTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No tasks due today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
