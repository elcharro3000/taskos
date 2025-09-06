import { NextRequest, NextResponse } from 'next/server'
import { CreateLabelSchema } from '@/src/lib/api'
import { withLogging } from '@/src/lib/logger'
import { prisma } from '@/src/lib/db'

async function getLabels() {
  const labels = await prisma.label.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  return labels.map(label => ({
    ...label,
    createdAt: label.createdAt.toISOString(),
    updatedAt: label.updatedAt.toISOString()
  }))
}

async function createLabel(request: NextRequest) {
  const body = await request.json()
  const validatedData = CreateLabelSchema.parse(body)

  const label = await prisma.label.create({
    data: validatedData
  })

  return {
    ...label,
    createdAt: label.createdAt.toISOString(),
    updatedAt: label.updatedAt.toISOString()
  }
}

export const GET = withLogging(
  async () => {
    const labels = await getLabels()
    return NextResponse.json(labels)
  },
  'GET',
  '/api/labels'
)

export const POST = withLogging(
  async (request: NextRequest) => {
    try {
      const label = await createLabel(request)
      return NextResponse.json(label, { status: 201 })
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
  '/api/labels'
)
