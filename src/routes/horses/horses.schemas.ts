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
  tags: z.array(TagSchema),
})

export const HorsesListResponseSchema = z.object({
  horses: z.array(HorseSchema),
})

export const HorseDetailResponseSchema = z.object({
  horse: HorseSchema,
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
