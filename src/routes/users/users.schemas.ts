import { z } from 'zod'
import { registry } from '@/lib/openapi'

const RoleEnum = z.enum(['super_admin', 'admin', 'user'])

export const MeResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: RoleEnum,
    createdAt: z.string().datetime(),
  }),
})

export const UpdateRoleBodySchema = z.object({
  role: RoleEnum,
})

const UserListItemSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: RoleEnum,
  createdAt: z.string().datetime(),
})

export const ListUsersResponseSchema = z.object({
  users: z.array(UserListItemSchema),
})

registry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of all users. Super-admin only.',
      content: { 'application/json': { schema: ListUsersResponseSchema } },
    },
    401: { description: 'Missing or invalid access token' },
    403: { description: 'Forbidden — super_admin required' },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/users/{id}',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  responses: {
    204: { description: 'User deleted.' },
    400: { description: 'Cannot delete yourself' },
    401: { description: 'Missing or invalid access token' },
    403: { description: 'Forbidden — super_admin required' },
    404: { description: 'User not found' },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/users/{id}/role',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  request: { body: { content: { 'application/json': { schema: UpdateRoleBodySchema } } } },
  responses: {
    200: { description: 'Role updated.' },
    400: { description: 'Validation error or self-demotion attempt' },
    401: { description: 'Missing or invalid access token' },
    403: { description: 'Forbidden — super_admin required' },
    404: { description: 'User not found' },
  },
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
