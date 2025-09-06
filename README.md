# TaskOS

A modern task management application built with Next.js 14, Tailwind CSS, and shadcn/ui components with a full-stack database integration.

## Features

- **Dark Theme**: Beautiful dark mode interface
- **Responsive Design**: Works on desktop and mobile devices
- **Database Integration**: SQLite with Prisma ORM
- **REST API**: Full CRUD operations for tasks, projects, labels, and comments
- **Real-time Data**: SWR for data fetching and caching
- **Keyboard Shortcuts**: 
  - `Cmd+N` (or `Ctrl+N`) - Open Quick Add dialog
  - `/` - Focus search input
  - `Cmd+K` (or `Ctrl+K`) - Open command palette
  - `g` then `p` - Go to projects
  - `g` then `c` - Go to calendar
- **Navigation**: Clean sidebar navigation with icons
- **Pages**:
  - Dashboard (`/`) - Overview with real-time stats and task lists
  - Projects (`/projects`) - Project management with progress tracking
  - Project Board (`/projects/board`) - Kanban board with drag-and-drop
  - Project Detail (`/projects/[id]`) - Individual project view with tasks
  - Calendar (`/calendar`) - Calendar view with events
  - Week View (`/calendar/week`) - Weekly calendar with task scheduling
  - Settings (`/settings`) - User preferences and calendar integration

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS with dark mode
- **Components**: shadcn/ui
- **Data Fetching**: SWR for client-side data management
- **Validation**: Zod for API request/response validation
- **Drag & Drop**: @dnd-kit for Kanban board functionality
- **Notifications**: React Hot Toast for user feedback
- **Calendar Integration**: ICS feed for external calendar apps
- **Command Palette**: CMD+K search and navigation
- **Keyboard Shortcuts**: n (new task), / (search), g+p (projects), g+c (calendar)
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Quick Setup

1. Run the setup script:
```bash
./scripts/setup-db.sh
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

3. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get a specific project
- `PATCH /api/projects/[id]` - Update a project
- `DELETE /api/projects/[id]` - Delete a project

### Labels
- `GET /api/labels` - Get all labels
- `POST /api/labels` - Create a new label

### Comments
- `POST /api/comments` - Create a new comment

### Calendar Integration
- `GET /api/ics` - Generate ICS calendar feed for external calendar apps

## Database Schema

The application uses a SQLite database with the following models:

- **Project**: Projects with name, description, and color
- **Task**: Tasks with title, description, status, priority, due date, and project relationship
- **Label**: Labels for categorizing tasks
- **TaskLabel**: Many-to-many relationship between tasks and labels
- **Comment**: Comments on tasks

## Project Structure

```
taskos/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── tasks/         # Task endpoints
│   │   ├── projects/      # Project endpoints
│   │   ├── labels/        # Label endpoints
│   │   └── comments/      # Comment endpoints
│   ├── layout.tsx         # Root layout with sidebar and topbar
│   ├── page.tsx           # Dashboard page
│   ├── projects/          # Projects pages
│   ├── calendar/          # Calendar page
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── sidebar.tsx       # Navigation sidebar
│   ├── topbar.tsx        # Top navigation bar
│   └── quick-add-dialog.tsx # Quick add modal
├── prisma/               # Database schema and seed
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Database seed script
├── src/                  # Source code
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utility functions and types
└── scripts/              # Setup scripts
```

## Features Overview

### Dashboard
- Task statistics and overview cards
- Recent tasks with status indicators
- Quick action buttons
- Progress tracking

### Projects
- Project cards with progress bars
- Status indicators (In Progress, Planning, Completed)
- Team member information
- Task completion tracking

### Project Detail
- Detailed project information
- Task list with status and assignees
- Team member list
- Progress metrics

### Calendar
- Monthly calendar view
- Weekly calendar with task scheduling
- Today's events sidebar
- Upcoming events
- Click-to-edit task functionality

### Project Board
- Kanban board with drag-and-drop columns
- Task status updates via drag-and-drop
- List/board view toggle
- Real-time task management
- Optimistic UI updates

### Calendar Integration
- ICS feed generation for external calendar apps
- iOS, macOS, Google Calendar, and Outlook support
- Automatic task synchronization
- Copy-to-clipboard functionality in settings

### Settings
- Profile management
- Notification preferences
- Security settings
- Appearance customization
- Data export options
- Keyboard shortcuts reference

## Development

This is a scaffolded application with placeholder data and no backend integration. All data is mocked for demonstration purposes.

## License

MIT
