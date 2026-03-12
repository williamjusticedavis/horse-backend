import type { RequestHandler } from 'express'
import type { AuthenticatedRequest } from './auth'
import { AppError } from './error-handler'

export function requireRole(...roles: Array<'admin' | 'user'>): RequestHandler {
  return (req, _res, next) => {
    const { userRole } = req as AuthenticatedRequest
    if (!userRole || !roles.includes(userRole)) {
      return next(new AppError(403, 'Forbidden'))
    }
    next()
  }
}
