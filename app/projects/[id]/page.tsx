"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Users, Clock, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"
import { useProject } from "@/src/hooks/useProjects"
import { useTasks } from "@/src/hooks/useTasks"
import { ProjectBoard } from "@/components/project-board"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const { project, isLoading: projectLoading } = useProject(params.id)
  const { tasks, isLoading: tasksLoading } = useTasks()
  
  if (projectLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Not Found</h1>
            <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  // Filter tasks for this project
  const projectTasks = tasks.filter(task => task.projectId === params.id)
  const completedTasks = projectTasks.filter(task => task.status === "COMPLETED").length
  const inProgressTasks = projectTasks.filter(task => task.status === "IN_PROGRESS").length
  const pendingTasks = projectTasks.filter(task => task.status === "TODO").length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.description || "No description provided"}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Circle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{inProgressTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{pendingTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Key information about this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Created</span>
              <span className="text-sm text-muted-foreground">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Updated</span>
              <span className="text-sm text-muted-foreground">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Color</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: project.color || '#3B82F6' }}
                ></div>
                <span className="text-sm text-muted-foreground">
                  {project.color || '#3B82F6'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Summary</CardTitle>
            <CardDescription>Overview of tasks in this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Tasks</span>
                <span className="text-sm font-bold">{projectTasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">Completed</span>
                <span className="text-sm font-bold text-green-600">{completedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">In Progress</span>
                <span className="text-sm font-bold text-blue-600">{inProgressTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">To Do</span>
                <span className="text-sm font-bold text-gray-600">{pendingTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Board</CardTitle>
          <CardDescription>Manage tasks with drag and drop</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectBoard projectId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
