import { Router } from 'express'
import { authenticate } from '@/middleware/auth'
import { getMe } from './users.handlers'

export const usersRouter = Router()

usersRouter.get('/me', authenticate, getMe)
