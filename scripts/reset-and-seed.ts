import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Clearing existing data...')
  
  // Delete in correct order to respect foreign key constraints
  await prisma.comment.deleteMany()
  await prisma.taskLabel.deleteMany()
  await prisma.task.deleteMany()
  await prisma.label.deleteMany()
  await prisma.project.deleteMany()
  
  console.log('✅ Database cleared')
  
  console.log('🌱 Seeding database...')

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({
      data: {
        name: 'urgent',
        color: '#EF4444'
      }
    }),
    prisma.label.create({
      data: {
        name: 'bug',
        color: '#F59E0B'
      }
    }),
    prisma.label.create({
      data: {
        name: 'feature',
        color: '#10B981'
      }
    }),
    prisma.label.create({
      data: {
        name: 'documentation',
        color: '#3B82F6'
      }
    }),
    prisma.label.create({
      data: {
        name: 'research',
        color: '#8B5CF6'
      }
    })
  ])

  console.log('✅ Created 5 labels')

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'TaskOS Development',
        description: 'Building the main task management application',
        color: '#3B82F6'
      }
    }),
    prisma.project.create({
      data: {
        name: 'UI/UX Improvements',
        description: 'Enhancing user interface and experience',
        color: '#10B981'
      }
    }),
    prisma.project.create({
      data: {
        name: 'Mobile App',
        description: 'Developing mobile companion app',
        color: '#F59E0B'
      }
    })
  ])

  console.log('✅ Created 3 projects')

  // Create tasks
  const tasks = await Promise.all([
    // Inbox tasks (no project)
    prisma.task.create({
      data: {
        title: 'Review pull requests',
        description: 'Review and merge pending pull requests',
        status: 'TODO',
        priority: 'HIGH'
      }
    }),
    prisma.task.create({
      data: {
        title: 'Update documentation',
        description: 'Update API documentation and README',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM'
      }
    }),
    prisma.task.create({
      data: {
        title: 'Plan next sprint',
        description: 'Create user stories and estimate tasks for next sprint',
        status: 'TODO',
        priority: 'MEDIUM'
      }
    }),

    // Project tasks
    prisma.task.create({
      data: {
        title: 'Implement drag and drop',
        description: 'Add drag and drop functionality to task board',
        status: 'COMPLETED',
        priority: 'HIGH',
        projectId: projects[0].id,
        dueAt: new Date('2024-01-15')
      }
    }),
    prisma.task.create({
      data: {
        title: 'Add dark mode',
        description: 'Implement dark mode theme toggle',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        projectId: projects[0].id,
        dueAt: new Date('2024-01-10')
      }
    }),
    prisma.task.create({
      data: {
        title: 'Fix authentication bug',
        description: 'Resolve login issues on mobile devices',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        projectId: projects[0].id,
        dueAt: new Date('2024-01-20')
      }
    }),
    prisma.task.create({
      data: {
        title: 'Design new dashboard',
        description: 'Create mockups for improved dashboard layout',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: projects[1].id,
        dueAt: new Date('2024-01-25')
      }
    }),
    prisma.task.create({
      data: {
        title: 'Optimize performance',
        description: 'Improve app loading times and responsiveness',
        status: 'COMPLETED',
        priority: 'HIGH',
        projectId: projects[1].id,
        dueAt: new Date('2024-01-12')
      }
    }),
    prisma.task.create({
      data: {
        title: 'Setup push notifications',
        description: 'Implement push notifications for task reminders',
        status: 'TODO',
        priority: 'LOW',
        projectId: projects[2].id,
        dueAt: new Date('2024-02-01')
      }
    })
  ])

  console.log('✅ Created 9 tasks')

  // Create task-label relationships
  await prisma.taskLabel.createMany({
    data: [
      { taskId: tasks[0].id, labelId: labels[0].id }, // urgent
      { taskId: tasks[1].id, labelId: labels[3].id }, // documentation
      { taskId: tasks[3].id, labelId: labels[2].id }, // feature
      { taskId: tasks[5].id, labelId: labels[1].id }, // bug
      { taskId: tasks[6].id, labelId: labels[2].id }, // feature
      { taskId: tasks[7].id, labelId: labels[2].id }, // feature
      { taskId: tasks[8].id, labelId: labels[2].id }, // feature
    ]
  })

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'This looks good, ready to merge!',
        taskId: tasks[0].id
      },
      {
        content: 'Need to update the API examples',
        taskId: tasks[1].id
      },
      {
        content: 'Great work on the implementation!',
        taskId: tasks[3].id
      },
      {
        content: 'Found the issue, working on a fix',
        taskId: tasks[5].id
      }
    ]
  })

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
