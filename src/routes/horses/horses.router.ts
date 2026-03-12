import { Router } from 'express'
import { authenticate } from '@/middleware/auth'
import { requireRole } from '@/middleware/require-role'
import { validate } from '@/middleware/validate'
import { upload } from '@/lib/upload'
import { getHorse, getHorses, updateHorse, uploadHorseImage, getTagVocabulary } from './horses.handlers'
import { UpdateHorseBodySchema } from './horses.schemas'
import './horses.schemas' // registers OpenAPI paths

export const horsesRouter = Router()

// Must come before /:id to avoid being swallowed as an id param
horsesRouter.get('/tag-vocabulary', getTagVocabulary)

horsesRouter.get('/', getHorses)
horsesRouter.get('/:id', getHorse)
horsesRouter.patch('/:id', authenticate, requireRole('admin'), validate({ body: UpdateHorseBodySchema }), updateHorse)
horsesRouter.post('/:id/image', authenticate, requireRole('admin'), upload.single('image'), uploadHorseImage)
