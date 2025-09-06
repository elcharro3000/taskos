"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Users, Clock } from "lucide-react"
import { useProjects } from "@/src/hooks/useProjects"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import Link from "next/link"

export default function ProjectsPage() {
  const { projects, isLoading } = useProjects()

  const getProjectStatus = (project: any) => {
    const tasks = project.tasks || []
    const completedTasks = tasks.filter((task: any) => task.status === 'COMPLETED').length
    const totalTasks = tasks.length
    
    if (totalTasks === 0) return 'Planning'
    if (completedTasks === totalTasks) return 'Completed'
    if (completedTasks > 0) return 'In Progress'
    return 'Planning'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track your project progress
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const tasks = project.tasks || []
          const completedTasks = tasks.filter((task: any) => task.status === 'COMPLETED').length
          const totalTasks = tasks.length
          const status = getProjectStatus(project)
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {project.description || 'No description'}
                      </CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {completedTasks}/{totalTasks} tasks completed
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    {tasks.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {Math.round(progress)}% complete
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {projects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first project
            </p>
            <CreateProjectDialog />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
