/**
 * Central app configuration.
 *
 * Bun automatically loads .env files, so process.env has all values at startup.
 * Env vars are validated with Zod at boot — a clear error is thrown if any
 * required variable is missing or has the wrong shape.
 *
 * Import from here instead of reading process.env directly.
 */
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  /** e.g. "15m", "1h" — anything jose accepts as an expiry string */
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  /** e.g. "7d" */
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  /**
   * Allowed CORS origin for the frontend.
   * Default matches the frontend-template dev server.
   */
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .optional(),
})

const parsed = envSchema.parse(process.env)

export const config = {
  env: parsed.NODE_ENV,
  port: parsed.PORT,

  databaseUrl: parsed.DATABASE_URL,

  jwtAccessSecret: parsed.JWT_ACCESS_SECRET,
  jwtRefreshSecret: parsed.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: parsed.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: parsed.JWT_REFRESH_EXPIRES_IN,

  corsOrigin: parsed.CORS_ORIGIN,
  logLevel: parsed.LOG_LEVEL,

  isDev: parsed.NODE_ENV === 'development',
  isProd: parsed.NODE_ENV === 'production',
  isTest: parsed.NODE_ENV === 'test',
}
