import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Users, Clock, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"

interface ProjectPageProps {
  params: {
    id: string
  }
}

const mockProject = {
  id: "1",
  name: "Website Redesign",
  description: "Complete overhaul of the company website with modern design principles and improved user experience. This project involves updating the frontend, backend, and implementing new features.",
  status: "In Progress",
  dueDate: "2024-01-15",
  team: [
    { name: "John Doe", role: "Project Manager", avatar: "JD" },
    { name: "Jane Smith", role: "Frontend Developer", avatar: "JS" },
    { name: "Mike Johnson", role: "Backend Developer", avatar: "MJ" },
    { name: "Sarah Wilson", role: "UI/UX Designer", avatar: "SW" }
  ],
  tasks: [
    { id: "1", title: "Create wireframes", status: "completed", assignee: "Sarah Wilson", dueDate: "2023-12-01" },
    { id: "2", title: "Design mockups", status: "completed", assignee: "Sarah Wilson", dueDate: "2023-12-08" },
    { id: "3", title: "Set up development environment", status: "completed", assignee: "Mike Johnson", dueDate: "2023-12-10" },
    { id: "4", title: "Implement header component", status: "in-progress", assignee: "Jane Smith", dueDate: "2023-12-15" },
    { id: "5", title: "Create responsive layout", status: "pending", assignee: "Jane Smith", dueDate: "2023-12-20" },
    { id: "6", title: "Integrate with backend API", status: "pending", assignee: "Mike Johnson", dueDate: "2023-12-25" },
    { id: "7", title: "Add animations and transitions", status: "pending", assignee: "Jane Smith", dueDate: "2024-01-05" },
    { id: "8", title: "Performance optimization", status: "pending", assignee: "Mike Johnson", dueDate: "2024-01-10" },
    { id: "9", title: "Testing and bug fixes", status: "pending", assignee: "John Doe", dueDate: "2024-01-12" },
    { id: "10", title: "Deploy to production", status: "pending", assignee: "Mike Johnson", dueDate: "2024-01-15" }
  ]
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const completedTasks = mockProject.tasks.filter(task => task.status === "completed").length
  const inProgressTasks = mockProject.tasks.filter(task => task.status === "in-progress").length
  const pendingTasks = mockProject.tasks.filter(task => task.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{mockProject.name}</h1>
          <p className="text-muted-foreground">{mockProject.description}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProject.tasks.length}</div>
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
              <span className="text-sm font-medium">Status</span>
              <Badge variant={mockProject.status === "Completed" ? "default" : "secondary"}>
                {mockProject.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Due Date</span>
              <span className="text-sm text-muted-foreground">
                {new Date(mockProject.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Team Size</span>
              <span className="text-sm text-muted-foreground">
                {mockProject.team.length} members
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((completedTasks / mockProject.tasks.length) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>People working on this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProject.team.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>All tasks for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProject.tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex-shrink-0">
                  {task.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Assigned to {task.assignee} • Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={task.status === "completed" ? "default" : task.status === "in-progress" ? "secondary" : "outline"}>
                  {task.status.replace("-", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
