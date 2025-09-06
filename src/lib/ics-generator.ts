// Define a more flexible task type for ICS generation
interface ICSTask {
  id: string
  title: string
  description?: string | null
  status: string
  priority: string
  dueAt?: string | null
  completedAt?: string | null
  createdAt: string
  updatedAt: string
  project?: {
    id: string
    name: string
    color?: string | null
  } | null
  labels?: Array<{
    id: string
    name: string
    color: string
  }>
}

export function generateICS(tasks: ICSTask[]): string {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TaskOS//Task Management//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:TaskOS Tasks
X-WR-CALDESC:Tasks from TaskOS
X-WR-TIMEZONE:UTC
`

  // Filter tasks that have dueAt
  const tasksWithDueDate = tasks.filter(task => task.dueAt)

  tasksWithDueDate.forEach(task => {
    const dueDate = new Date(task.dueAt!)
    const startTime = dueDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    // Set end time to 1 hour after start time
    const endDate = new Date(dueDate.getTime() + 60 * 60 * 1000)
    const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    // Create UID from task ID
    const uid = `task-${task.id}@taskos.app`
    
    // Escape special characters in description
    const description = (task.description || '').replace(/[\\,;]/g, '\\$&')
    const summary = task.title.replace(/[\\,;]/g, '\\$&')
    
    // Add status and priority to description
    let fullDescription = description
    if (task.status !== 'TODO') {
      fullDescription += `\\nStatus: ${task.status.replace('_', ' ')}`
    }
    if (task.priority !== 'MEDIUM') {
      fullDescription += `\\nPriority: ${task.priority}`
    }
    if (task.project) {
      fullDescription += `\\nProject: ${task.project.name}`
    }

    ics += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${timestamp}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${summary}
DESCRIPTION:${fullDescription}
STATUS:${task.status === 'COMPLETED' ? 'CONFIRMED' : 'TENTATIVE'}
PRIORITY:${getPriorityNumber(task.priority)}
CATEGORIES:TaskOS${task.project ? `,${task.project.name}` : ''}
END:VEVENT
`
  })

  ics += `END:VCALENDAR`

  return ics
}

function getPriorityNumber(priority: string): number {
  switch (priority) {
    case 'URGENT':
      return 1
    case 'HIGH':
      return 3
    case 'MEDIUM':
      return 5
    case 'LOW':
      return 7
    default:
      return 5
  }
}
