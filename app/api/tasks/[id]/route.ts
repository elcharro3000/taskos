import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withLogging } from '@/src/lib/logger'
import { prisma } from '@/src/lib/db'

// Simple validation schema for partial updates
const SimpleUpdateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueAt: z.string().datetime().optional(),
  projectId: z.string().optional(),
  labelIds: z.array(z.string()).optional()
})

async function getTask(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
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
        }
      }
    }
  })

  if (!task) {
    return null
  }

  return {
    ...task,
    labels: task.labels.map(tl => tl.label),
    dueAt: task.dueAt?.toISOString() || null,
    completedAt: task.completedAt?.toISOString() || null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  }
}

async function updateTask(id: string, request: NextRequest) {
  const body = await request.json()
  
  // Log the request body for debugging
  console.log('PATCH /api/tasks/[id] - Request body:', JSON.stringify(body))
  
  try {
    const validatedData = SimpleUpdateTaskSchema.parse(body)
    console.log('PATCH /api/tasks/[id] - Validated data:', JSON.stringify(validatedData))

    const { labelIds, ...taskData } = validatedData

    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        dueAt: taskData.dueAt ? new Date(taskData.dueAt) : undefined,
        completedAt: taskData.status === 'COMPLETED' 
          ? new Date() 
          : taskData.status && taskData.status !== 'COMPLETED'
          ? null
          : undefined
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

    // Update labels if provided
    if (labelIds !== undefined) {
      await prisma.taskLabel.deleteMany({
        where: { taskId: id }
      })

      if (labelIds.length > 0) {
        await prisma.taskLabel.createMany({
          data: labelIds.map(labelId => ({
            taskId: id,
            labelId
          }))
        })

        // Refetch with updated labels
        const updatedTask = await prisma.task.findUnique({
          where: { id },
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
          ...updatedTask!,
          labels: updatedTask!.labels.map(tl => tl.label),
          dueAt: updatedTask!.dueAt?.toISOString() || null,
          completedAt: updatedTask!.completedAt?.toISOString() || null,
          createdAt: updatedTask!.createdAt.toISOString(),
          updatedAt: updatedTask!.updatedAt.toISOString()
        }
      }
    }

    return {
      ...task,
      labels: task.labels.map(tl => tl.label),
      dueAt: task.dueAt?.toISOString() || null,
      completedAt: task.completedAt?.toISOString() || null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    }
  } catch (validationError) {
    console.error('PATCH /api/tasks/[id] - Validation error:', validationError)
    throw validationError
  }
}

async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id }
  })
}

export const GET = withLogging(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const task = await getTask(params.id)
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  },
  'GET',
  '/api/tasks/[id]'
)

export const PATCH = withLogging(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const task = await updateTask(params.id, request)
      return NextResponse.json(task)
    } catch (error) {
      console.error('PATCH /api/tasks/[id] - Error:', error)
      
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Validation error', 
            details: error.errors,
            message: error.message 
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )
    }
  },
  'PATCH',
  '/api/tasks/[id]'
)

export const DELETE = withLogging(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      await deleteTask(params.id)
      return NextResponse.json({ success: true })
    } catch (error) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
  },
  'DELETE',
  '/api/tasks/[id]'
)
