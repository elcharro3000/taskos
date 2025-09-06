import { NextRequest, NextResponse } from 'next/server'
import { CreateTaskSchema, TaskSchema } from '@/src/lib/api'
import { withLogging } from '@/src/lib/logger'
import { prisma } from '@/src/lib/db'

async function getTasks() {
  const tasks = await prisma.task.findMany({
    include: {
      project: {
        select: {
          id: true,
          name: true,
          color: true
        }
      },
      labels: {
        include: {
          label: true
        }
      },
      comments: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 3
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return tasks.map(task => ({
    ...task,
    labels: task.labels.map(tl => tl.label),
    dueAt: task.dueAt?.toISOString() || null,
    completedAt: task.completedAt?.toISOString() || null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  }))
}

async function createTask(request: NextRequest) {
  const body = await request.json()
  const validatedData = CreateTaskSchema.parse(body)

  const { labelIds, ...taskData } = validatedData

  const task = await prisma.task.create({
    data: {
      ...taskData,
      dueAt: taskData.dueAt ? new Date(taskData.dueAt) : null,
      labels: labelIds ? {
        create: labelIds.map(labelId => ({
          labelId
        }))
      } : undefined
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          color: true
        }
      },
      labels: {
        include: {
          label: true
        }
      }
    }
  })

  return {
    ...task,
    labels: task.labels.map(tl => tl.label),
    dueAt: task.dueAt?.toISOString() || null,
    completedAt: task.completedAt?.toISOString() || null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  }
}

export const GET = withLogging(
  async () => {
    const tasks = await getTasks()
    return NextResponse.json(tasks)
  },
  'GET',
  '/api/tasks'
)

export const POST = withLogging(
  async (request: NextRequest) => {
    try {
      const task = await createTask(request)
      return NextResponse.json(task, { status: 201 })
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation error', details: error.message },
          { status: 400 }
        )
      }
      throw error
    }
  },
  'POST',
  '/api/tasks'
)
