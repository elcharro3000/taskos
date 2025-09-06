"use client"

import { useState, useEffect } from "react"
import { Search, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QuickAddDialog } from "@/components/quick-add-dialog"

export function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !searchFocused) {
        event.preventDefault()
        const searchInput = document.getElementById("search-input")
        searchInput?.focus()
      }
      if (event.key === "n" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        // This will be handled by the QuickAddDialog component
      }
      // Global shortcuts
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        // This will be handled by the CommandPalette component
      }
      if (event.key === "g") {
        // Wait for next key for g+key shortcuts
        const handleNextKey = (nextEvent: KeyboardEvent) => {
          if (nextEvent.key === "p") {
            nextEvent.preventDefault()
            window.location.href = "/projects"
          } else if (nextEvent.key === "c") {
            nextEvent.preventDefault()
            window.location.href = "/calendar"
          }
          document.removeEventListener("keydown", handleNextKey)
        }
        document.addEventListener("keydown", handleNextKey)
        // Remove listener after 1 second if no follow-up key
        setTimeout(() => {
          document.removeEventListener("keydown", handleNextKey)
        }, 1000)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [searchFocused])

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-input"
            placeholder="Search tasks, projects..."
            className="pl-10"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            Press / to search or ⌘K for commands
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <QuickAddDialog />
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
