import type { RequestHandler } from 'express'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { skills } from '@/db/schema'
import { AppError } from '@/middleware/error-handler'
import type { CreateSkillBody, UpdateSkillBody } from './skills.schemas'

export const getSkills: RequestHandler = async (_req, res) => {
  const rows = await db.select().from(skills).orderBy(asc(skills.name))
  res.json({ skills: rows })
}

export const getSkill: RequestHandler = async (req, res) => {
  const id = String(req.params.id)
  const [skill] = await db.select().from(skills).where(eq(skills.id, id)).limit(1)
  if (!skill) throw new AppError(404, 'Skill not found')
  res.json({ skill })
}

export const createSkill: RequestHandler = async (req, res) => {
  const body = req.body as CreateSkillBody
  const [created] = await db
    .insert(skills)
    .values({
      name: body.name,
      category: body.category,
      shortDescription: body.shortDescription,
      longDescription: body.longDescription,
      levels: body.levels,
    })
    .returning()
  res.status(201).json({ skill: created })
}

export const updateSkill: RequestHandler = async (req, res) => {
  const id = String(req.params.id)
  const body = req.body as UpdateSkillBody

  const [existing] = await db
    .select({ id: skills.id })
    .from(skills)
    .where(eq(skills.id, id))
    .limit(1)
  if (!existing) throw new AppError(404, 'Skill not found')

  const updateData: Partial<typeof skills.$inferInsert> = {
    updatedAt: new Date(),
  }
  if (body.name !== undefined) updateData.name = body.name
  if (body.category !== undefined) updateData.category = body.category
  if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription
  if (body.longDescription !== undefined) updateData.longDescription = body.longDescription
  if (body.levels !== undefined) updateData.levels = body.levels

  const [updated] = await db
    .update(skills)
    .set(updateData)
    .where(eq(skills.id, id))
    .returning()

  res.json({ skill: updated })
}

export const deleteSkill: RequestHandler = async (req, res) => {
  const id = String(req.params.id)
  const [deleted] = await db
    .delete(skills)
    .where(eq(skills.id, id))
    .returning({ id: skills.id })
  if (!deleted) throw new AppError(404, 'Skill not found')
  res.status(204).send()
}
