import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const therapyCards = pgTable('therapy_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  domain: text('domain').notNull(),
  description: text('description').notNull(),
  howItHelps: text('how_it_helps').notNull(),
  inPractice: text('in_practice').notNull(),
  contraindications: text('contraindications').notNull(),
  tags: text('tags').array().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type TherapyCard = typeof therapyCards.$inferSelect
export type NewTherapyCard = typeof therapyCards.$inferInsert
