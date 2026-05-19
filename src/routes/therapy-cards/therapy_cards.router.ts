import { Router } from 'express'
import { authenticate } from '@/middleware/auth'
import { requireRole } from '@/middleware/require-role'
import { validate } from '@/middleware/validate'
import {
  getTherapyCards,
  getTherapyCard,
  createTherapyCard,
  updateTherapyCard,
  deleteTherapyCard,
} from './therapy_cards.handlers'
import { CreateTherapyCardBodySchema, UpdateTherapyCardBodySchema } from './therapy_cards.schemas'
import './therapy_cards.schemas' // registers OpenAPI paths

export const therapyCardsRouter = Router()

therapyCardsRouter.get('/', getTherapyCards)
therapyCardsRouter.get('/:id', getTherapyCard)
therapyCardsRouter.post(
  '/',
  authenticate,
  requireRole('admin', 'super_admin'),
  validate({ body: CreateTherapyCardBodySchema }),
  createTherapyCard
)
therapyCardsRouter.patch(
  '/:id',
  authenticate,
  requireRole('admin', 'super_admin'),
  validate({ body: UpdateTherapyCardBodySchema }),
  updateTherapyCard
)
therapyCardsRouter.delete('/:id', authenticate, requireRole('admin', 'super_admin'), deleteTherapyCard)
