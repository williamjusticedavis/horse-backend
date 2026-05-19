import { Router } from 'express'
import { authenticate } from '@/middleware/auth'
import { requireRole } from '@/middleware/require-role'
import { validate } from '@/middleware/validate'
import { getMe, listUsers, updateUserRole, deleteUser } from './users.handlers'
import { UpdateRoleBodySchema } from './users.schemas'
import './users.schemas' // registers OpenAPI paths

export const usersRouter = Router()

usersRouter.get('/me', authenticate, getMe)
usersRouter.get('/', authenticate, requireRole('super_admin'), listUsers)
usersRouter.patch(
  '/:id/role',
  authenticate,
  requireRole('super_admin'),
  validate({ body: UpdateRoleBodySchema }),
  updateUserRole
)
usersRouter.delete('/:id', authenticate, requireRole('super_admin'), deleteUser)
