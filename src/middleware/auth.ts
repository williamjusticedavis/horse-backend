import type { Request, Response, NextFunction } from 'express'
import * as jose from 'jose'
import { config } from '@/lib/config'
import { AppError } from './error-handler'

/**
 * Extended Request type that includes the authenticated user's ID.
 * Cast req to this in any handler that sits behind `authenticate`.
 *
 * @example
 * export const getMe: RequestHandler = async (req, res) => {
 *   const { userId } = req as AuthenticatedRequest
 * }
 */
export interface AuthenticatedRequest extends Request {
  userId: string
  userRole: 'super_admin' | 'admin' | 'user'
}

const accessSecret = new TextEncoder().encode(config.jwtAccessSecret)

/**
 * Middleware that verifies the Bearer token in the Authorization header.
 * Sets `req.userId` on success; passes an AppError(401) to next() on failure.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(401, 'Missing or invalid Authorization header'))
  }

  const token = authHeader.slice(7)

  try {
    const { payload } = await jose.jwtVerify(token, accessSecret)
    ;(req as AuthenticatedRequest).userId = payload.sub as string
    ;(req as AuthenticatedRequest).userRole = payload['role'] as 'super_admin' | 'admin' | 'user'
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired token'))
  }
}
