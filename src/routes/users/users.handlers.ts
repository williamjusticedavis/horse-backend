import type { RequestHandler } from 'express'
import { eq, asc } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '@/db'
import { users } from '@/db/schema'
import { AppError } from '@/middleware/error-handler'
import type { AuthenticatedRequest } from '@/middleware/auth'
import type { UpdateRoleBodySchema } from './users.schemas'

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

export const listUsers: RequestHandler = async (_req, res) => {
  const allUsers = await db
    .select({ id: users.id, email: users.email, role: users.role, createdAt: users.createdAt })
    .from(users)
    .orderBy(asc(users.createdAt))

  res.json({ users: allUsers })
}

export const updateUserRole: RequestHandler<
  { id: string },
  unknown,
  z.infer<typeof UpdateRoleBodySchema>
> = async (req, res) => {
  const { userId } = req as unknown as AuthenticatedRequest
  const { id } = req.params
  const { role } = req.body

  if (id === userId) throw new AppError(400, 'Cannot change your own role')

  const [updated] = await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning({ id: users.id, email: users.email, role: users.role })

  if (!updated) throw new AppError(404, 'User not found')

  res.json({ user: updated })
}

export const deleteUser: RequestHandler<{ id: string }> = async (req, res) => {
  const { userId } = req as unknown as AuthenticatedRequest
  const { id } = req.params

  if (id === userId) throw new AppError(400, 'Cannot delete yourself')

  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id })

  if (!deleted) throw new AppError(404, 'User not found')

  res.status(204).send()
}
