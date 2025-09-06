import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/db'

export async function GET() {
  try {
    // Test database connection with a simple query instead of raw SQL
    await prisma.task.count()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
