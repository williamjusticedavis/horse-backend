import { z } from 'zod'
import { registry } from '@/lib/openapi'

const TagSchema = z.object({
  id: z.number().int(),
  category: z.enum(['age', 'temperament', 'level', 'purpose', 'gender', 'size', 'color', 'seniority']),
  label: z.string(),
  note: z.string().nullable(),
})

const HorseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  age: z.number().int(),
  description: z.string(),
  fullDescription: z.string().nullable(),
  breed: z.string().nullable(),
  color: z.string().nullable(),
  imageEmoji: z.string().nullable(),
  imageUrl: z.string().nullable(),
  tags: z.array(TagSchema),
})

export const HorsesListResponseSchema = z.object({ horses: z.array(HorseSchema) })
export const HorseDetailResponseSchema = z.object({ horse: HorseSchema })

const TagCategoryEnum = z.enum(['age', 'temperament', 'level', 'purpose', 'gender', 'size', 'color', 'seniority'])

export const CreateHorseBodySchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(0),
  description: z.string().min(1),
  fullDescription: z.string().nullable().optional(),
  breed: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  imageEmoji: z.string().nullable().optional(),
  tags: z
    .array(
      z.object({
        category: TagCategoryEnum,
        label: z.string().min(1),
        note: z.string().nullable(),
      })
    )
    .optional(),
})

export type CreateHorseBody = z.infer<typeof CreateHorseBodySchema>

export const UpdateHorseBodySchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().int().min(0).optional(),
  description: z.string().min(1).optional(),
  fullDescription: z.string().nullable().optional(),
  breed: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  imageEmoji: z.string().nullable().optional(),
  tags: z
    .array(
      z.object({
        category: TagCategoryEnum,
        label: z.string().min(1),
        note: z.string().nullable(),
      })
    )
    .optional(),
})

export type UpdateHorseBody = z.infer<typeof UpdateHorseBodySchema>

registry.registerPath({
  method: 'post',
  path: '/horses',
  tags: ['Horses'],
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateHorseBodySchema } } },
  },
  responses: {
    201: {
      description: 'Created horse.',
      content: { 'application/json': { schema: HorseDetailResponseSchema } },
    },
    400: { description: 'Invalid input' },
    403: { description: 'Forbidden' },
  },
})

registry.registerPath({
  method: 'get',
  path: '/horses',
  tags: ['Horses'],
  responses: {
    200: {
      description: 'List of all horses with their tags.',
      content: { 'application/json': { schema: HorsesListResponseSchema } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/horses/{id}',
  tags: ['Horses'],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'A single horse with its tags.',
      content: { 'application/json': { schema: HorseDetailResponseSchema } },
    },
    400: { description: 'Invalid horse id' },
    404: { description: 'Horse not found' },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/horses/{id}',
  tags: ['Horses'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: UpdateHorseBodySchema } } },
  },
  responses: {
    200: {
      description: 'Updated horse.',
      content: { 'application/json': { schema: HorseDetailResponseSchema } },
    },
    400: { description: 'Invalid input' },
    403: { description: 'Forbidden' },
    404: { description: 'Horse not found' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/horses/{id}/image',
  tags: ['Horses'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Uploaded image URL.',
      content: { 'application/json': { schema: z.object({ imageUrl: z.string() }) } },
    },
    400: { description: 'No file or invalid type' },
    403: { description: 'Forbidden' },
    404: { description: 'Horse not found' },
  },
})

registry.registerPath({
  method: 'get',
  path: '/horses/tag-vocabulary',
  tags: ['Horses'],
  responses: {
    200: {
      description: 'All unique tag category+label pairs.',
      content: {
        'application/json': {
          schema: z.object({
            tags: z.array(z.object({ category: TagCategoryEnum, label: z.string() })),
          }),
        },
      },
    },
  },
})
