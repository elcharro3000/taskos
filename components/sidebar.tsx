"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Folder, 
  Calendar, 
  ListTodo, 
  Settings,
  Plus,
  Kanban,
  CalendarDays
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: ListTodo },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Board", href: "/projects/board", icon: Kanban },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Week View", href: "/calendar/week", icon: CalendarDays },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold">TaskOS</h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Plus className="h-4 w-4" />
          Quick Add
        </button>
      </div>
    </div>
  )
}
