import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { UpdateProjectSchema } from '@/src/lib/api'
import { withLogging } from '@/src/lib/logger'

const prisma = new PrismaClient()

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        include: {
          labels: {
            include: {
              label: true
            }
          }
        }
      }
    }
  })

  if (!project) {
    return null
  }

  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    tasks: project.tasks.map(task => ({
      ...task,
      labels: task.labels.map(tl => tl.label),
      dueAt: task.dueAt?.toISOString() || null,
      completedAt: task.completedAt?.toISOString() || null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    }))
  }
}

async function updateProject(id: string, request: NextRequest) {
  const body = await request.json()
  const validatedData = UpdateProjectSchema.parse(body)

  const project = await prisma.project.update({
    where: { id },
    data: validatedData
  })

  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  }
}

async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id }
  })
}

export const GET = withLogging(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const project = await getProject(params.id)
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  },
  'GET',
  '/api/projects/[id]'
)

export const PATCH = withLogging(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const project = await updateProject(params.id, request)
      return NextResponse.json(project)
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
  'PATCH',
  '/api/projects/[id]'
)

export const DELETE = withLogging(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      await deleteProject(params.id)
      return NextResponse.json({ success: true })
    } catch (error) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
  },
  'DELETE',
  '/api/projects/[id]'
)
