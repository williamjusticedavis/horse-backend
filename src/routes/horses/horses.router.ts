import { Router } from 'express'
import { getHorse, getHorses } from './horses.handlers'
import './horses.schemas' // registers OpenAPI paths

export const horsesRouter = Router()

horsesRouter.get('/', getHorses)
horsesRouter.get('/:id', getHorse)
