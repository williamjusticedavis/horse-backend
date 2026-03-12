/**
 * Horses route tests.
 *
 * Tests that do NOT need the DB (marked "no-db") run anywhere.
 * Tests that need the DB require the Docker db service:
 *   docker compose up db -d   (from horse-backend/)
 */
import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import * as jose from 'jose'
import type { Server } from 'http'

async function makeToken(role: 'admin' | 'user') {
  const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)
  return new jose.SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('test-user-id')
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret)
}

describe('Horses routes', () => {
  let server: Server
  let baseUrl: string

  beforeAll(async () => {
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

  // ── No-DB tests ─────────────────────────────────────────────────────────────

  test('GET /api/horses/not-a-number → 400 (no-db)', async () => {
    const res = await fetch(`${baseUrl}/api/horses/not-a-number`)
    expect(res.status).toBe(400)
  })

  test('GET /api/horses/0 → 400 (no-db)', async () => {
    const res = await fetch(`${baseUrl}/api/horses/0`)
    expect(res.status).toBe(400)
  })

  test('PATCH /api/horses/1 — no Authorization → 401 (no-db)', async () => {
    const res = await fetch(`${baseUrl}/api/horses/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'test' }),
    })
    expect(res.status).toBe(401)
  })

  test('PATCH /api/horses/1 — bad token → 401 (no-db)', async () => {
    const res = await fetch(`${baseUrl}/api/horses/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer bad.token' },
      body: JSON.stringify({ description: 'test' }),
    })
    expect(res.status).toBe(401)
  })

  test('PATCH /api/horses/1 — user-role JWT → 403 (no-db)', async () => {
    const token = await makeToken('user')
    const res = await fetch(`${baseUrl}/api/horses/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ description: 'test' }),
    })
    expect(res.status).toBe(403)
  })

  test('PATCH /api/horses/1 — admin JWT + invalid body (age: -1) → 400 (no-db)', async () => {
    const token = await makeToken('admin')
    const res = await fetch(`${baseUrl}/api/horses/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ age: -1 }),
    })
    expect(res.status).toBe(400)
  })

  test('POST /api/horses/1/image — no Authorization → 401 (no-db)', async () => {
    const res = await fetch(`${baseUrl}/api/horses/1/image`, { method: 'POST' })
    expect(res.status).toBe(401)
  })

  test('POST /api/horses/1/image — user-role JWT → 403 (no-db)', async () => {
    const token = await makeToken('user')
    const res = await fetch(`${baseUrl}/api/horses/1/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(403)
  })

  // ── DB-required tests ────────────────────────────────────────────────────────

  test('GET /api/horses → 200 with horses array (needs db)', async () => {
    const res = await fetch(`${baseUrl}/api/horses`)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { horses: unknown[] }
    expect(Array.isArray(body.horses)).toBe(true)
  })

  test('GET /api/horses/1 → 200 with horse + tags (needs db)', async () => {
    const res = await fetch(`${baseUrl}/api/horses/1`)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { horse: { tags: unknown[] } }
    expect(body.horse).toBeDefined()
    expect(Array.isArray(body.horse.tags)).toBe(true)
  })

  test('GET /api/horses/99999 → 404 (needs db)', async () => {
    const res = await fetch(`${baseUrl}/api/horses/99999`)
    expect(res.status).toBe(404)
  })

  test('GET /api/horses/tag-vocabulary → 200 with tags array (needs db)', async () => {
    const res = await fetch(`${baseUrl}/api/horses/tag-vocabulary`)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { tags: { category: string; label: string }[] }
    expect(Array.isArray(body.tags)).toBe(true)
    if (body.tags.length > 0) {
      expect(typeof body.tags[0].category).toBe('string')
      expect(typeof body.tags[0].label).toBe('string')
    }
  })

  test('PATCH /api/horses/1 — admin JWT + valid body → 200 with updated horse (needs db)', async () => {
    const token = await makeToken('admin')
    const marker = 'test-description-' + Date.now()

    const res = await fetch(`${baseUrl}/api/horses/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ description: marker }),
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { horse: { description: string } }
    expect(body.horse.description).toBe(marker)

    // Restore original description
    await fetch(`${baseUrl}/api/horses/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ description: 'סוס עדין ורגיש, מתאים לרכיבה טיפולית' }),
    })
  })
})
