import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock } from "lucide-react"

const mockEvents = [
  {
    id: "1",
    title: "Team Standup",
    time: "09:00",
    duration: "30 min",
    type: "meeting",
    attendees: 8
  },
  {
    id: "2", 
    title: "Project Review",
    time: "14:00",
    duration: "1 hour",
    type: "meeting",
    attendees: 5
  },
  {
    id: "3",
    title: "Design Workshop",
    time: "10:30",
    duration: "2 hours",
    type: "workshop",
    attendees: 12
  },
  {
    id: "4",
    title: "Client Call",
    time: "16:00",
    duration: "45 min",
    type: "call",
    attendees: 3
  }
]

const mockDays = [
  { date: "2024-01-01", day: 1, isCurrentMonth: false, isToday: false },
  { date: "2024-01-02", day: 2, isCurrentMonth: false, isToday: false },
  { date: "2024-01-03", day: 3, isCurrentMonth: false, isToday: false },
  { date: "2024-01-04", day: 4, isCurrentMonth: false, isToday: false },
  { date: "2024-01-05", day: 5, isCurrentMonth: false, isToday: false },
  { date: "2024-01-06", day: 6, isCurrentMonth: false, isToday: false },
  { date: "2024-01-07", day: 7, isCurrentMonth: false, isToday: false },
  { date: "2024-01-08", day: 8, isCurrentMonth: true, isToday: false },
  { date: "2024-01-09", day: 9, isCurrentMonth: true, isToday: false },
  { date: "2024-01-10", day: 10, isCurrentMonth: true, isToday: false },
  { date: "2024-01-11", day: 11, isCurrentMonth: true, isToday: false },
  { date: "2024-01-12", day: 12, isCurrentMonth: true, isToday: false },
  { date: "2024-01-13", day: 13, isCurrentMonth: true, isToday: false },
  { date: "2024-01-14", day: 14, isCurrentMonth: true, isToday: true },
  { date: "2024-01-15", day: 15, isCurrentMonth: true, isToday: false },
  { date: "2024-01-16", day: 16, isCurrentMonth: true, isToday: false },
  { date: "2024-01-17", day: 17, isCurrentMonth: true, isToday: false },
  { date: "2024-01-18", day: 18, isCurrentMonth: true, isToday: false },
  { date: "2024-01-19", day: 19, isCurrentMonth: true, isToday: false },
  { date: "2024-01-20", day: 20, isCurrentMonth: true, isToday: false },
  { date: "2024-01-21", day: 21, isCurrentMonth: true, isToday: false },
  { date: "2024-01-22", day: 22, isCurrentMonth: true, isToday: false },
  { date: "2024-01-23", day: 23, isCurrentMonth: true, isToday: false },
  { date: "2024-01-24", day: 24, isCurrentMonth: true, isToday: false },
  { date: "2024-01-25", day: 25, isCurrentMonth: true, isToday: false },
  { date: "2024-01-26", day: 26, isCurrentMonth: true, isToday: false },
  { date: "2024-01-27", day: 27, isCurrentMonth: true, isToday: false },
  { date: "2024-01-28", day: 28, isCurrentMonth: true, isToday: false },
  { date: "2024-01-29", day: 29, isCurrentMonth: true, isToday: false },
  { date: "2024-01-30", day: 30, isCurrentMonth: true, isToday: false },
  { date: "2024-01-31", day: 31, isCurrentMonth: true, isToday: false },
  { date: "2024-02-01", day: 1, isCurrentMonth: false, isToday: false },
  { date: "2024-02-02", day: 2, isCurrentMonth: false, isToday: false },
  { date: "2024-02-03", day: 3, isCurrentMonth: false, isToday: false },
  { date: "2024-02-04", day: 4, isCurrentMonth: false, isToday: false },
  { date: "2024-02-05", day: 5, isCurrentMonth: false, isToday: false },
  { date: "2024-02-06", day: 6, isCurrentMonth: false, isToday: false },
  { date: "2024-02-07", day: 7, isCurrentMonth: false, isToday: false }
]

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>January 2024</CardTitle>
              <CardDescription>Your calendar for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {mockDays.map((day) => (
                  <div
                    key={day.date}
                    className={`p-2 text-center text-sm rounded-md hover:bg-accent transition-colors ${
                      !day.isCurrentMonth 
                        ? "text-muted-foreground/50" 
                        : day.isToday 
                        ? "bg-primary text-primary-foreground font-semibold" 
                        : "hover:bg-accent"
                    }`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Events</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
              {mockEvents.length > 0 ? (
                <div className="space-y-3">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{event.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{event.duration}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{event.attendees} people</span>
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No events today</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
              <CardDescription>Events in the next few days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <div className="flex-shrink-0">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Project Deadline</p>
                    <p className="text-xs text-muted-foreground">Tomorrow at 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <div className="flex-shrink-0">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Weekly Review</p>
                    <p className="text-xs text-muted-foreground">Friday at 2:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
