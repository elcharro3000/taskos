import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { generateICS } from "@/src/lib/ics-generator"
import { withLogging } from "@/src/lib/logger"

const prisma = new PrismaClient()

async function getTasksForICS() {
  const tasks = await prisma.task.findMany({
    where: {
      dueAt: {
        not: null
      }
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
    },
    orderBy: {
      dueAt: 'asc'
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

export const GET = withLogging(
  async (request: NextRequest) => {
    try {
      const tasks = await getTasksForICS()
      const icsContent = generateICS(tasks)
      
      return new NextResponse(icsContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': 'attachment; filename="taskos-tasks.ics"',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    } catch (error) {
      console.error('Error generating ICS feed:', error)
      return NextResponse.json(
        { error: 'Failed to generate calendar feed' },
        { status: 500 }
      )
    }
  },
  'GET',
  '/api/ics'
)
