import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '@/lib/logger'

/**
 * Application-level error. Throw this anywhere in a route handler —
 * Express 5 catches it automatically and forwards it here.
 *
 * @example throw new AppError(404, 'User not found')
 * @example throw new AppError(409, 'Email already registered', 'EMAIL_TAKEN')
 */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  // Zod validation errors (from validate middleware)
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    })
    return
  }

  // Known application errors
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: err.message,
      ...(err.code && { code: err.code }),
    })
    return
  }

  // Unexpected errors — log and return a generic message
  logger.error({ err, method: req.method, url: req.url }, 'Unhandled error')
  res.status(500).json({ error: 'Internal server error' })
}
