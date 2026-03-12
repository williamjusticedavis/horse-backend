import { Router } from 'express'
import { authRouter } from './auth/auth.router'
import { usersRouter } from './users/users.router'

export const router = Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
