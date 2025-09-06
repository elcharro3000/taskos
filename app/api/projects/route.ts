import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { CreateProjectSchema, ProjectSchema } from '@/src/lib/api'
import { withLogging } from '@/src/lib/logger'

const prisma = new PrismaClient()

async function getProjects() {
  const projects = await prisma.project.findMany({
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
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return projects.map(project => ({
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
  }))
}

async function createProject(request: NextRequest) {
  const body = await request.json()
  const validatedData = CreateProjectSchema.parse(body)

  const project = await prisma.project.create({
    data: validatedData
  })

  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  }
}

export const GET = withLogging(
  async () => {
    const projects = await getProjects()
    return NextResponse.json(projects)
  },
  'GET',
  '/api/projects'
)

export const POST = withLogging(
  async (request: NextRequest) => {
    try {
      const project = await createProject(request)
      return NextResponse.json(project, { status: 201 })
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
  '/api/projects'
)
