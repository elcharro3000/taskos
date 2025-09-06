"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { 
  Folder, 
  Calendar, 
  ListTodo, 
  Settings, 
  Plus,
  Search,
  Kanban,
  CalendarDays
} from "lucide-react"

const commandItems = [
  {
    group: "Navigation",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: ListTodo,
        shortcut: "⌘1"
      },
      {
        name: "Projects",
        href: "/projects",
        icon: Folder,
        shortcut: "⌘2"
      },
      {
        name: "Project Board",
        href: "/projects/board",
        icon: Kanban,
        shortcut: "⌘3"
      },
      {
        name: "Calendar",
        href: "/calendar",
        icon: Calendar,
        shortcut: "⌘4"
      },
      {
        name: "Week View",
        href: "/calendar/week",
        icon: CalendarDays,
        shortcut: "⌘5"
      },
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        shortcut: "⌘6"
      }
    ]
  },
  {
    group: "Actions",
    items: [
      {
        name: "New Task",
        action: "new-task",
        icon: Plus,
        shortcut: "⌘N"
      },
      {
        name: "Search Tasks",
        action: "search",
        icon: Search,
        shortcut: "/"
      }
    ]
  }
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (item: any) => {
    if (item.href) {
      router.push(item.href)
      setOpen(false)
    } else if (item.action === "new-task") {
      // Trigger new task dialog
      const event = new CustomEvent("open-quick-add")
      window.dispatchEvent(event)
      setOpen(false)
    } else if (item.action === "search") {
      // Focus search input
      const searchInput = document.getElementById("search-input")
      searchInput?.focus()
      setOpen(false)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commandItems.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
                {item.shortcut && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.shortcut}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
