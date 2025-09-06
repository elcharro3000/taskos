import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/db'

export async function GET() {
  try {
    // Check environment variables
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const databaseUrl = process.env.DATABASE_URL ? 'Set' : 'Not set'
    
    // Test database connection
    let dbStatus = 'Unknown'
    let projectCount = 0
    let taskCount = 0
    
    try {
      await prisma.task.count()
      dbStatus = 'Connected'
      
      // Get counts
      projectCount = await prisma.project.count()
      taskCount = await prisma.task.count()
    } catch (error) {
      dbStatus = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: databaseUrl,
        hasDatabaseUrl
      },
      database: {
        status: dbStatus,
        projectCount,
        taskCount
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
