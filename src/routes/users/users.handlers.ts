import type { RequestHandler } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { AppError } from '@/middleware/error-handler'
import type { AuthenticatedRequest } from '@/middleware/auth'

export const getMe: RequestHandler = async (req, res) => {
  const { userId } = req as AuthenticatedRequest

  const [user] = await db
    .select({ id: users.id, email: users.email, role: users.role, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) throw new AppError(404, 'User not found')

  res.json({ user })
}
