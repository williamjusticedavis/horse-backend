import type { RequestHandler } from 'express'
import { asc, eq } from 'drizzle-orm' // asc used for createdAt ordering
import { db } from '@/db'
import { therapyCards } from '@/db/schema'
import { AppError } from '@/middleware/error-handler'
import type { CreateTherapyCardBody, UpdateTherapyCardBody } from './therapy_cards.schemas'

export const getTherapyCards: RequestHandler = async (_req, res) => {
  const cards = await db
    .select()
    .from(therapyCards)
    .orderBy(asc(therapyCards.createdAt))
  res.json({ cards })
}

export const getTherapyCard: RequestHandler = async (req, res) => {
  const id = String(req.params.id)
  const [card] = await db.select().from(therapyCards).where(eq(therapyCards.id, id)).limit(1)
  if (!card) throw new AppError(404, 'Therapy card not found')
  res.json({ card })
}

export const createTherapyCard: RequestHandler = async (req, res) => {
  const body = req.body as CreateTherapyCardBody
  const [created] = await db
    .insert(therapyCards)
    .values({
      title: body.title,
      domain: body.domain,
      description: body.description,
      howItHelps: body.howItHelps,
      inPractice: body.inPractice,
      contraindications: body.contraindications,
      tags: body.tags ?? [],
    })
    .returning()
  res.status(201).json({ card: created })
}

export const updateTherapyCard: RequestHandler = async (req, res) => {
  const id = String(req.params.id)
  const body = req.body as UpdateTherapyCardBody

  const [existing] = await db
    .select({ id: therapyCards.id })
    .from(therapyCards)
    .where(eq(therapyCards.id, id))
    .limit(1)
  if (!existing) throw new AppError(404, 'Therapy card not found')

  const updateData: Partial<typeof therapyCards.$inferInsert> = {}
  if (body.title !== undefined) updateData.title = body.title
  if (body.domain !== undefined) updateData.domain = body.domain
  if (body.description !== undefined) updateData.description = body.description
  if (body.howItHelps !== undefined) updateData.howItHelps = body.howItHelps
  if (body.inPractice !== undefined) updateData.inPractice = body.inPractice
  if (body.contraindications !== undefined) updateData.contraindications = body.contraindications
  if (body.tags !== undefined) updateData.tags = body.tags

  const [updated] = await db
    .update(therapyCards)
    .set(updateData)
    .where(eq(therapyCards.id, id))
    .returning()

  res.json({ card: updated })
}

export const deleteTherapyCard: RequestHandler = async (req, res) => {
  const id = String(req.params.id)
  const [deleted] = await db
    .delete(therapyCards)
    .where(eq(therapyCards.id, id))
    .returning({ id: therapyCards.id })
  if (!deleted) throw new AppError(404, 'Therapy card not found')
  res.status(204).send()
}
