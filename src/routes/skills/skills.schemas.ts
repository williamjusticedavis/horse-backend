import { z } from 'zod'
import { registry } from '@/lib/openapi'

export const SkillLevelEnum = z.enum(['beginner', 'intermediate', 'advanced'])

const PrerequisiteSchema = z.object({
  skillId: z.string().uuid(),
  level: SkillLevelEnum,
})

const SkillLevelDataSchema = z.object({
  level: SkillLevelEnum,
  description: z.string(),
  prerequisites: z.array(PrerequisiteSchema),
})

export const SkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  levels: z.array(SkillLevelDataSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const SkillsListResponseSchema = z.object({ skills: z.array(SkillSchema) })
export const SkillDetailResponseSchema = z.object({ skill: SkillSchema })

export const CreateSkillBodySchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  levels: z.array(SkillLevelDataSchema),
})

export type CreateSkillBody = z.infer<typeof CreateSkillBodySchema>

export const UpdateSkillBodySchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  longDescription: z.string().min(1).optional(),
  levels: z.array(SkillLevelDataSchema).optional(),
})

export type UpdateSkillBody = z.infer<typeof UpdateSkillBodySchema>

registry.registerPath({
  method: 'get',
  path: '/skills',
  tags: ['Skills'],
  responses: {
    200: {
      description: 'List of all riding skills.',
      content: { 'application/json': { schema: SkillsListResponseSchema } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/skills/{id}',
  tags: ['Skills'],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'A single riding skill.',
      content: { 'application/json': { schema: SkillDetailResponseSchema } },
    },
    404: { description: 'Not found' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/skills',
  tags: ['Skills'],
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateSkillBodySchema } } },
  },
  responses: {
    201: {
      description: 'Created riding skill.',
      content: { 'application/json': { schema: SkillDetailResponseSchema } },
    },
    400: { description: 'Invalid input' },
    403: { description: 'Forbidden' },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/skills/{id}',
  tags: ['Skills'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: UpdateSkillBodySchema } } },
  },
  responses: {
    200: {
      description: 'Updated riding skill.',
      content: { 'application/json': { schema: SkillDetailResponseSchema } },
    },
    400: { description: 'Invalid input' },
    403: { description: 'Forbidden' },
    404: { description: 'Not found' },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/skills/{id}',
  tags: ['Skills'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    204: { description: 'Deleted.' },
    403: { description: 'Forbidden' },
    404: { description: 'Not found' },
  },
})
