/**
 * App integration tests.
 *
 * These tests start the Express app on a random OS-assigned port using Bun's
 * built-in fetch — no external HTTP client needed.
 *
 * The health check and 404 tests do NOT query the database, so they run fine
 * without a Postgres instance. Tests that hit auth/user routes require a running
 * DB — see the docker-compose.yml `db` service.
 */
import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import type { Server } from 'http'

describe('App', () => {
  let server: Server
  let baseUrl: string

  beforeAll(async () => {
    // Dynamic import ensures setup.ts preload has already set env vars
    const { createApp } = await import('../app')
    const app = createApp()

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address() as { port: number }
        baseUrl = `http://localhost:${addr.port}`
        resolve()
      })
    })
  })

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  })

  test('GET /health → 200 { status: "ok" }', async () => {
    const res = await fetch(`${baseUrl}/health`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
  })

  test('GET /openapi.json → 200 with openapi field', async () => {
    const res = await fetch(`${baseUrl}/openapi.json`)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { openapi: string }
    expect(body.openapi).toBe('3.1.0')
  })

  test('unknown route → 404', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent`)
    expect(res.status).toBe(404)
  })

  test('POST /api/auth/register with invalid body → 400', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', password: 'short' }),
    })
    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string; issues: unknown[] }
    expect(body.error).toBe('Validation error')
    expect(Array.isArray(body.issues)).toBe(true)
  })

  test('GET /api/users/me without token → 401', async () => {
    const res = await fetch(`${baseUrl}/api/users/me`)
    expect(res.status).toBe(401)
  })

  test('GET /api/users/me with bad token → 401', async () => {
    const res = await fetch(`${baseUrl}/api/users/me`, {
      headers: { Authorization: 'Bearer not.a.real.token' },
    })
    expect(res.status).toBe(401)
  })
})
