import { z } from 'zod'
import { registry } from '@/lib/openapi'

export const MeResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    createdAt: z.string().datetime(),
  }),
})

registry.registerPath({
  method: 'get',
  path: '/users/me',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "The authenticated user's profile.",
      content: { 'application/json': { schema: MeResponseSchema } },
    },
    401: { description: 'Missing or invalid access token' },
    404: { description: 'User not found' },
  },
})
