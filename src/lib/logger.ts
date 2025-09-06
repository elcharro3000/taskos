import { NextRequest } from 'next/server'

export function logRequest(method: string, path: string, duration: number) {
  console.info(`[${method}] ${path} - ${duration}ms`)
}

export function withLogging<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  method: string,
  path: string
) {
  return async (...args: T): Promise<R> => {
    const start = Date.now()
    try {
      const result = await handler(...args)
      const duration = Date.now() - start
      logRequest(method, path, duration)
      return result
    } catch (error) {
      const duration = Date.now() - start
      console.error(`[${method}] ${path} - ${duration}ms - ERROR:`, error)
      throw error
    }
  }
}
