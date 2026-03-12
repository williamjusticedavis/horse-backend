import { Router } from 'express'
import { validate } from '@/middleware/validate'
import { RegisterBodySchema, LoginBodySchema, RefreshBodySchema } from './auth.schemas'
import { register, login, refresh, logout } from './auth.handlers'

export const authRouter = Router()

authRouter.post('/register', validate({ body: RegisterBodySchema }), register)
authRouter.post('/login', validate({ body: LoginBodySchema }), login)
authRouter.post('/refresh', validate({ body: RefreshBodySchema }), refresh)
authRouter.post('/logout', validate({ body: RefreshBodySchema }), logout)
