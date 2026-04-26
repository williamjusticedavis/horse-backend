import { Router } from 'express'
import { authRouter } from './auth/auth.router'
import { usersRouter } from './users/users.router'
import { horsesRouter } from './horses/horses.router'
import { therapyCardsRouter } from './therapy-cards/therapy_cards.router'
import { skillsRouter } from './skills/skills.router'

export const router = Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/horses', horsesRouter)
router.use('/therapy-cards', therapyCardsRouter)
router.use('/skills', skillsRouter)
