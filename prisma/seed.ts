import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({
      data: {
        name: 'Frontend',
        color: '#3B82F6'
      }
    }),
    prisma.label.create({
      data: {
        name: 'Backend',
        color: '#10B981'
      }
    }),
    prisma.label.create({
      data: {
        name: 'Design',
        color: '#F59E0B'
      }
    }),
    prisma.label.create({
      data: {
        name: 'Bug',
        color: '#EF4444'
      }
    }),
    prisma.label.create({
      data: {
        name: 'Feature',
        color: '#8B5CF6'
      }
    })
  ])

  console.log(`✅ Created ${labels.length} labels`)

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Website Redesign',
        description: 'Complete overhaul of the company website with modern design',
        color: '#3B82F6'
      }
    }),
    prisma.project.create({
      data: {
        name: 'Mobile App Development',
        description: 'Native mobile app for iOS and Android platforms',
        color: '#10B981'
      }
    }),
    prisma.project.create({
      data: {
        name: 'Database Migration',
        description: 'Migrate legacy database to new cloud infrastructure',
        color: '#F59E0B'
      }
    })
  ])

  console.log(`✅ Created ${projects.length} projects`)

  // Create tasks
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const tasks = await Promise.all([
    // Inbox tasks (no project)
    prisma.task.create({
      data: {
        title: 'Review team feedback',
        description: 'Go through all the feedback from the design review session',
        status: "TODO",
        priority: "MEDIUM",
        dueAt: tomorrow
      }
    }),
    prisma.task.create({
      data: {
        title: 'Update documentation',
        description: 'Update API documentation with new endpoints',
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueAt: yesterday // Overdue
      }
    }),
    prisma.task.create({
      data: {
        title: 'Plan next sprint',
        description: 'Create user stories and estimate tasks for next sprint',
        status: "TODO",
        priority: "MEDIUM"
        // No due date - inbox task
      }
    }),

    // Project tasks
    prisma.task.create({
      data: {
        title: 'Create wireframes',
        description: 'Design wireframes for the new homepage layout',
        status: "COMPLETED",
        priority: "HIGH",
        projectId: projects[0].id,
        dueAt: yesterday,
        completedAt: yesterday
      }
    }),
    prisma.task.create({
      data: {
        title: 'Implement header component',
        description: 'Build the new responsive header with navigation',
        status: "IN_PROGRESS",
        priority: "HIGH",
        projectId: projects[0].id,
        dueAt: today
      }
    }),
    prisma.task.create({
      data: {
        title: 'Set up development environment',
        description: 'Configure local development setup for mobile app',
        status: "COMPLETED",
        priority: "MEDIUM",
        projectId: projects[1].id,
        dueAt: yesterday,
        completedAt: yesterday
      }
    }),
    prisma.task.create({
      data: {
        title: 'Design app icons',
        description: 'Create icon set for the mobile application',
        status: "TODO",
        priority: "MEDIUM",
        projectId: projects[1].id,
        dueAt: nextWeek
      }
    }),
    prisma.task.create({
      data: {
        title: 'Backup current database',
        description: 'Create full backup before migration starts',
        status: "COMPLETED",
        priority: "URGENT",
        projectId: projects[2].id,
        dueAt: yesterday,
        completedAt: yesterday
      }
    }),
    prisma.task.create({
      data: {
        title: 'Test migration script',
        description: 'Run migration script on staging environment',
        status: "IN_PROGRESS",
        priority: "HIGH",
        projectId: projects[2].id,
        dueAt: today
      }
    })
  ])

  console.log(`✅ Created ${tasks.length} tasks`)

  // Create task-label relationships
  await Promise.all([
    prisma.taskLabel.create({
      data: {
        taskId: tasks[3].id, // Create wireframes
        labelId: labels[2].id // Design
      }
    }),
    prisma.taskLabel.create({
      data: {
        taskId: tasks[4].id, // Implement header component
        labelId: labels[0].id // Frontend
      }
    }),
    prisma.taskLabel.create({
      data: {
        taskId: tasks[6].id, // Design app icons
        labelId: labels[2].id // Design
      }
    }),
    prisma.taskLabel.create({
      data: {
        taskId: tasks[6].id, // Design app icons
        labelId: labels[4].id // Feature
      }
    }),
    prisma.taskLabel.create({
      data: {
        taskId: tasks[1].id, // Update documentation
        labelId: labels[1].id // Backend
      }
    })
  ])

  // Create comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great work on the wireframes! The layout looks clean and intuitive.',
        taskId: tasks[3].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'I\'ve started working on the responsive breakpoints. Should be done by EOD.',
        taskId: tasks[4].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'The migration script ran successfully on staging. Ready for production.',
        taskId: tasks[8].id
      }
    })
  ])

  console.log('✅ Created comments')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
