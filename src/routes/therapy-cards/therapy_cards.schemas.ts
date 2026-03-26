import { z } from 'zod'
import { registry } from '@/lib/openapi'

const DOMAINS = ['רגשי', 'תקשורתי', 'מוטורי', 'חברתי', 'התנהגותי'] as const

export const DomainEnum = z.enum(DOMAINS)

export const TherapyCardSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  domain: DomainEnum,
  description: z.string(),
  howItHelps: z.string(),
  inPractice: z.string(),
  contraindications: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const TherapyCardsListResponseSchema = z.object({ cards: z.array(TherapyCardSchema) })
export const TherapyCardDetailResponseSchema = z.object({ card: TherapyCardSchema })

export const CreateTherapyCardBodySchema = z.object({
  title: z.string().min(1),
  domain: DomainEnum,
  description: z.string().min(1),
  howItHelps: z.string().min(1),
  inPractice: z.string().min(1),
  contraindications: z.string().min(1),
  tags: z.array(z.string()).optional(),
})

export type CreateTherapyCardBody = z.infer<typeof CreateTherapyCardBodySchema>

export const UpdateTherapyCardBodySchema = z.object({
  title: z.string().min(1).optional(),
  domain: DomainEnum.optional(),
  description: z.string().min(1).optional(),
  howItHelps: z.string().min(1).optional(),
  inPractice: z.string().min(1).optional(),
  contraindications: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
})

export type UpdateTherapyCardBody = z.infer<typeof UpdateTherapyCardBodySchema>

registry.registerPath({
  method: 'get',
  path: '/therapy-cards',
  tags: ['TherapyCards'],
  responses: {
    200: {
      description: 'List of all therapy cards.',
      content: { 'application/json': { schema: TherapyCardsListResponseSchema } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/therapy-cards/{id}',
  tags: ['TherapyCards'],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'A single therapy card.',
      content: { 'application/json': { schema: TherapyCardDetailResponseSchema } },
    },
    404: { description: 'Not found' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/therapy-cards',
  tags: ['TherapyCards'],
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateTherapyCardBodySchema } } },
  },
  responses: {
    201: {
      description: 'Created therapy card.',
      content: { 'application/json': { schema: TherapyCardDetailResponseSchema } },
    },
    400: { description: 'Invalid input' },
    403: { description: 'Forbidden' },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/therapy-cards/{id}',
  tags: ['TherapyCards'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: UpdateTherapyCardBodySchema } } },
  },
  responses: {
    200: {
      description: 'Updated therapy card.',
      content: { 'application/json': { schema: TherapyCardDetailResponseSchema } },
    },
    400: { description: 'Invalid input' },
    403: { description: 'Forbidden' },
    404: { description: 'Not found' },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/therapy-cards/{id}',
  tags: ['TherapyCards'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    204: { description: 'Deleted.' },
    403: { description: 'Forbidden' },
    404: { description: 'Not found' },
  },
})
