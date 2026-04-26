import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export interface SkillLevelData {
  level: SkillLevel
  description: string
  prerequisites: { skillId: string; level: SkillLevel }[]
}

export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  shortDescription: text('short_description').notNull(),
  longDescription: text('long_description').notNull(),
  levels: jsonb('levels').notNull().$type<SkillLevelData[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert
