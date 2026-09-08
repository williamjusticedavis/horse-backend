import type { RequestHandler } from 'express'
import { asc, eq } from 'drizzle-orm'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { db } from '@/db'
import { horses, horseTags } from '@/db/schema'
import { AppError } from '@/middleware/error-handler'
import { config } from '@/lib/config'
import { r2 } from '@/lib/r2'
import type { CreateHorseBody, UpdateHorseBody } from './horses.schemas'

/** Max dimension (px) served for a horse photo — cards/detail views never render larger. */
const MAX_IMAGE_DIMENSION = 1400

/** Downscale and re-encode as JPEG so uploads (often multi-MB phone photos) stay small. */
async function processImage(buffer: Buffer): Promise<{ buffer: Buffer; contentType: string }> {
  const resized = await sharp(buffer)
    .rotate() // apply EXIF orientation before stripping metadata
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer()
  return { buffer: resized, contentType: 'image/jpeg' }
}

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

  const { buffer, contentType } = await processImage(req.file.buffer)

  let imageUrl: string
  if (r2 && config.r2) {
    const key = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
    await r2.send(
      new PutObjectCommand({
        Bucket: config.r2.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // Filenames are unique per upload (timestamp + random), so a given
        // key's content never changes — safe to cache for a long time.
        CacheControl: 'public, max-age=31536000, immutable',
      })
    )
    imageUrl = `${config.r2.publicUrl}/${key}`
  } else {
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
    await writeFile(join(process.cwd(), 'uploads', filename), buffer)
    imageUrl = `/uploads/${filename}`
  }

  const [updated] = await db
    .update(horses)
    .set({ imageUrl })
    .where(eq(horses.id, id))
    .returning({ imageUrl: horses.imageUrl })

  if (!updated) throw new AppError(404, 'Horse not found')

  res.json({ imageUrl })
}

const TAG_VOCABULARY: { category: (typeof horseTags.$inferSelect)['category']; label: string }[] = [
  { category: 'age', label: 'גור' },
  { category: 'age', label: 'צעיר' },
  { category: 'age', label: 'בוגר' },
  { category: 'age', label: 'זקן' },
  { category: 'temperament', label: 'רגוע' },
  { category: 'temperament', label: 'אנרגטי' },
  { category: 'temperament', label: 'סוער' },
  { category: 'level', label: 'מתאים למתחילים' },
  { category: 'level', label: 'בינוני' },
  { category: 'level', label: 'מתקדם' },
  { category: 'purpose', label: 'טיפולי' },
  { category: 'purpose', label: 'פנאי' },
  { category: 'purpose', label: 'תחרותי' },
  { category: 'gender', label: 'סוס' },
  { category: 'gender', label: 'סוסה' },
  { category: 'size', label: 'קטן' },
  { category: 'size', label: 'בינוני' },
  { category: 'size', label: 'גדול' },
  { category: 'color', label: 'לבן' },
  { category: 'color', label: 'אפור' },
  { category: 'color', label: 'חום' },
  { category: 'color', label: 'חום כהה' },
  { category: 'color', label: 'שחור' },
  { category: 'color', label: 'ערמוני' },
  { category: 'seniority', label: 'מתחיל' },
  { category: 'seniority', label: 'מנוסה' },
  { category: 'seniority', label: 'ותיק' },
]

export const getTagVocabulary: RequestHandler = (_req, res) => {
  res.json({ tags: TAG_VOCABULARY })
}

export const deleteHorse: RequestHandler = async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) throw new AppError(400, 'Invalid horse id')

  const [deleted] = await db.delete(horses).where(eq(horses.id, id)).returning({ id: horses.id })
  if (!deleted) throw new AppError(404, 'Horse not found')

  res.status(204).send()
}
