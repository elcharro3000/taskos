import { NextRequest, NextResponse } from 'next/server'
import { CreateCommentSchema } from '@/src/lib/api'
import { withLogging } from '@/src/lib/logger'
import { prisma } from '@/src/lib/db'

async function createComment(request: NextRequest) {
  const body = await request.json()
  const validatedData = CreateCommentSchema.parse(body)

  const comment = await prisma.comment.create({
    data: validatedData
  })

  return {
    ...comment,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString()
  }
}

export const POST = withLogging(
  async (request: NextRequest) => {
    try {
      const comment = await createComment(request)
      return NextResponse.json(comment, { status: 201 })
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
  '/api/comments'
)
