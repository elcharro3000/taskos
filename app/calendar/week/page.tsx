"use client"

import { CalendarWeek } from "@/components/calendar-week"

export default function CalendarWeekPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View your tasks in a weekly calendar format
        </p>
      </div>

      <CalendarWeek />
    </div>
  )
}
