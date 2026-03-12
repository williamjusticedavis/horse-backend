import { Router } from 'express'
import { authRouter } from './auth/auth.router'
import { usersRouter } from './users/users.router'
import { horsesRouter } from './horses/horses.router'

export const router = Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/horses', horsesRouter)
