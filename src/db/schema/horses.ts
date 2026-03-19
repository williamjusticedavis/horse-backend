import { pgTable, serial, integer, varchar, text, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const tagCategoryEnum = pgEnum('tag_category', [
  'age',
  'temperament',
  'level',
  'purpose',
  'gender',
  'size',
  'color',
  'seniority',
])

export const horses = pgTable('horses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  age: integer('age').notNull(),
  description: text('description').notNull(),
  fullDescription: text('full_description'),
  breed: varchar('breed', { length: 100 }),
  color: varchar('color', { length: 100 }),
  imageUrl: varchar('image_url', { length: 500 }),
})

export const horseTags = pgTable('horse_tags', {
  id: serial('id').primaryKey(),
  horseId: integer('horse_id')
    .notNull()
    .references(() => horses.id, { onDelete: 'cascade' }),
  category: tagCategoryEnum('category').notNull(),
  label: varchar('label', { length: 100 }).notNull(),
  note: text('note'),
})

export const horsesRelations = relations(horses, ({ many }) => ({
  tags: many(horseTags),
}))

export const horseTagsRelations = relations(horseTags, ({ one }) => ({
  horse: one(horses, { fields: [horseTags.horseId], references: [horses.id] }),
}))

export type Horse = typeof horses.$inferSelect
export type NewHorse = typeof horses.$inferInsert
export type HorseTag = typeof horseTags.$inferSelect
export type NewHorseTag = typeof horseTags.$inferInsert
