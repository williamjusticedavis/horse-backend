import { z } from 'zod'
import { registry } from '@/lib/openapi'

// ── Request schemas ────────────────────────────────────────────────────────────

export const RegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const RefreshBodySchema = z.object({
  refreshToken: z.string().min(1),
})

// ── Shared response shape ──────────────────────────────────────────────────────

const UserSchema = z.object({ id: z.string().uuid(), email: z.string().email() })

const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

const AuthResponseSchema = TokensSchema.merge(z.object({ user: UserSchema }))

// ── OpenAPI path registrations ─────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  request: { body: { content: { 'application/json': { schema: RegisterBodySchema } } } },
  responses: {
    201: {
      description: 'User created. Returns the user object and a token pair.',
      content: { 'application/json': { schema: AuthResponseSchema } },
    },
    400: { description: 'Validation error' },
    409: { description: 'Email already registered' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  request: { body: { content: { 'application/json': { schema: LoginBodySchema } } } },
  responses: {
    200: {
      description: 'Authenticated. Returns the user object and a token pair.',
      content: { 'application/json': { schema: AuthResponseSchema } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Invalid credentials' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/auth/refresh',
  tags: ['Auth'],
  request: { body: { content: { 'application/json': { schema: RefreshBodySchema } } } },
  responses: {
    200: {
      description: 'Token rotated. Old refresh token is invalidated.',
      content: { 'application/json': { schema: TokensSchema } },
    },
    401: { description: 'Invalid or expired refresh token' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  request: { body: { content: { 'application/json': { schema: RefreshBodySchema } } } },
  responses: {
    204: { description: 'Logged out. Refresh token invalidated.' },
  },
})
