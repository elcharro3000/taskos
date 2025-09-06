"use client"

import { useState } from "react"
import { ProjectBoard } from "@/components/project-board"

export default function ProjectBoardPage() {
  const [viewMode, setViewMode] = useState<"list" | "board">("board")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Board</h1>
        <p className="text-muted-foreground">
          Drag and drop tasks between columns to update their status
        </p>
      </div>

      <ProjectBoard 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  )
}
