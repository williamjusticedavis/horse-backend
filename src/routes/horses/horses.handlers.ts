import type { RequestHandler } from 'express'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { horses } from '@/db/schema'
import { AppError } from '@/middleware/error-handler'

export const getHorses: RequestHandler = async (_req, res) => {
  const result = await db.query.horses.findMany({
    with: { tags: { orderBy: (t, { asc: a }) => [a(t.id)] } },
    orderBy: [asc(horses.id)],
  })
  res.json({ horses: result })
}

export const getHorse: RequestHandler = async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) throw new AppError(400, 'Invalid horse id')

  const horse = await db.query.horses.findFirst({
    where: eq(horses.id, id),
    with: { tags: { orderBy: (t, { asc: a }) => [a(t.id)] } },
  })
  if (!horse) throw new AppError(404, 'Horse not found')

  res.json({ horse })
}
