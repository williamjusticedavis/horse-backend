import type { RequestHandler } from 'express'
import { asc, eq } from 'drizzle-orm'
import { extname } from 'path'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { db } from '@/db'
import { horses, horseTags } from '@/db/schema'
import { AppError } from '@/middleware/error-handler'
import { config } from '@/lib/config'
import { r2 } from '@/lib/r2'
import type { CreateHorseBody, UpdateHorseBody } from './horses.schemas'

export const createHorse: RequestHandler = async (req, res) => {
  const { tags, ...horseData } = req.body as CreateHorseBody

  const [created] = await db.insert(horses).values(horseData).returning({ id: horses.id })

  if (tags && tags.length > 0) {
    await db.insert(horseTags).values(tags.map((t) => ({ ...t, horseId: created.id })))
  }

  const horse = await db.query.horses.findFirst({
    where: eq(horses.id, created.id),
    with: { tags: { orderBy: (t, { asc: a }) => [a(t.id)] } },
  })

  res.status(201).json({ horse })
}

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

export const updateHorse: RequestHandler = async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) throw new AppError(400, 'Invalid horse id')

  const { tags, ...horseData } = req.body as UpdateHorseBody

  const [existing] = await db
    .select({ id: horses.id })
    .from(horses)
    .where(eq(horses.id, id))
    .limit(1)
  if (!existing) throw new AppError(404, 'Horse not found')

  if (Object.keys(horseData).length > 0) {
    await db.update(horses).set(horseData).where(eq(horses.id, id))
  }

  if (tags !== undefined) {
    await db.delete(horseTags).where(eq(horseTags.horseId, id))
    if (tags.length > 0) {
      await db.insert(horseTags).values(tags.map((t) => ({ ...t, horseId: id })))
    }
  }

  const horse = await db.query.horses.findFirst({
    where: eq(horses.id, id),
    with: { tags: { orderBy: (t, { asc: a }) => [a(t.id)] } },
  })

  res.json({ horse })
}

export const uploadHorseImage: RequestHandler = async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) throw new AppError(400, 'Invalid horse id')
  if (!req.file) throw new AppError(400, 'No file uploaded')

  let imageUrl: string
  if (r2 && config.r2) {
    const ext = extname(req.file.originalname).toLowerCase()
    const key = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    await r2.send(
      new PutObjectCommand({
        Bucket: config.r2.bucketName,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    )
    imageUrl = `${config.r2.publicUrl}/${key}`
  } else {
    imageUrl = `/uploads/${req.file.filename}`
  }

  const [updated] = await db
    .update(horses)
    .set({ imageUrl })
    .where(eq(horses.id, id))
    .returning({ imageUrl: horses.imageUrl })

  if (!updated) throw new AppError(404, 'Horse not found')

  res.json({ imageUrl })
}

export const getTagVocabulary: RequestHandler = async (_req, res) => {
  const tags = await db
    .selectDistinct({ category: horseTags.category, label: horseTags.label })
    .from(horseTags)
    .orderBy(horseTags.category, horseTags.label)

  res.json({ tags })
}
