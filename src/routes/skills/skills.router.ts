import { Router } from 'express'
import { authenticate } from '@/middleware/auth'
import { requireRole } from '@/middleware/require-role'
import { validate } from '@/middleware/validate'
import { getSkills, getSkill, createSkill, updateSkill, deleteSkill } from './skills.handlers'
import { CreateSkillBodySchema, UpdateSkillBodySchema } from './skills.schemas'
import './skills.schemas' // registers OpenAPI paths

export const skillsRouter = Router()

skillsRouter.get('/', getSkills)
skillsRouter.get('/:id', getSkill)
skillsRouter.post(
  '/',
  authenticate,
  requireRole('admin', 'super_admin'),
  validate({ body: CreateSkillBodySchema }),
  createSkill
)
skillsRouter.patch(
  '/:id',
  authenticate,
  requireRole('admin', 'super_admin'),
  validate({ body: UpdateSkillBodySchema }),
  updateSkill
)
skillsRouter.delete('/:id', authenticate, requireRole('admin', 'super_admin'), deleteSkill)
