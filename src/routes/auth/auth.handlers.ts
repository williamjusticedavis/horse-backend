/**
 * Auth handlers.
 *
 * Express 5 catches async throws automatically, so handlers can throw AppError
 * directly without try/catch — the global error handler takes care of the rest.
 */
import type { RequestHandler } from 'express'
import * as jose from 'jose'
import * as bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { createHash, randomBytes } from 'crypto'
import type { z } from 'zod'
import { db } from '@/db'
import { users, refreshTokens } from '@/db/schema'
import { config } from '@/lib/config'
import { AppError } from '@/middleware/error-handler'
import type { RegisterBodySchema, LoginBodySchema, RefreshBodySchema } from './auth.schemas'

const accessSecret = new TextEncoder().encode(config.jwtAccessSecret)
const refreshSecret = new TextEncoder().encode(config.jwtRefreshSecret)

// ── Helpers ────────────────────────────────────────────────────────────────────

async function createTokenPair(userId: string) {
  const accessToken = await new jose.SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(config.jwtAccessExpiresIn)
    .sign(accessSecret)

  // Refresh token: random bytes, stored as SHA-256 hash — raw value sent once
  const rawRefresh = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(rawRefresh).digest('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await db.insert(refreshTokens).values({ userId, tokenHash, expiresAt })

  return { accessToken, refreshToken: rawRefresh }
}

// ── Handlers ───────────────────────────────────────────────────────────────────

export const register: RequestHandler<
  Record<string, string>,
  unknown,
  z.infer<typeof RegisterBodySchema>
> = async (req, res) => {
  const { email, password } = req.body

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existing) throw new AppError(409, 'Email already registered')

  const passwordHash = await bcrypt.hash(password, 12)

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning({ id: users.id, email: users.email, role: users.role })

  const tokens = await createTokenPair(user.id)

  res.status(201).json({ user, ...tokens })
}

export const login: RequestHandler<
  Record<string, string>,
  unknown,
  z.infer<typeof LoginBodySchema>
> = async (req, res) => {
  const { email, password } = req.body

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (!user) throw new AppError(401, 'Invalid credentials')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new AppError(401, 'Invalid credentials')

  const tokens = await createTokenPair(user.id)

  res.json({ user: { id: user.id, email: user.email, role: user.role }, ...tokens })
}

export const refresh: RequestHandler<
  Record<string, string>,
  unknown,
  z.infer<typeof RefreshBodySchema>
> = async (req, res) => {
  const { refreshToken } = req.body
  const tokenHash = createHash('sha256').update(refreshToken).digest('hex')

  const [token] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .limit(1)

  if (!token || token.expiresAt < new Date()) {
    throw new AppError(401, 'Invalid or expired refresh token')
  }

  // Rotate: delete the used token, issue a fresh pair
  await db.delete(refreshTokens).where(eq(refreshTokens.id, token.id))

  const tokens = await createTokenPair(token.userId)

  res.json(tokens)
}

export const logout: RequestHandler<
  Record<string, string>,
  unknown,
  z.infer<typeof RefreshBodySchema>
> = async (req, res) => {
  const { refreshToken } = req.body
  const tokenHash = createHash('sha256').update(refreshToken).digest('hex')

  await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash))

  // 204 No Content — matches frontend ApiError handling (returns null for 204)
  res.status(204).send()
}

// Verify access token for use outside of this module (e.g. tests)
export { accessSecret, refreshSecret }
