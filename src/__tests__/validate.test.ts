import { describe, test, expect, mock } from 'bun:test'
import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import { validate } from '../middleware/validate'

function makeReq(overrides: Partial<Request> = {}): Request {
  return { body: {}, query: {}, params: {}, ...overrides } as Request
}

const res = {} as Response

describe('validate middleware', () => {
  test('parses and coerces req.query', () => {
    const next = mock(() => {})
    const req = makeReq({ query: { page: '3' } as never })
    validate({ query: z.object({ page: z.coerce.number() }) })(req, res, next as NextFunction)
    expect(req.query).toEqual({ page: 3 })
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('parses and coerces req.params', () => {
    const next = mock(() => {})
    const req = makeReq({ params: { id: '42' } as never })
    validate({ params: z.object({ id: z.coerce.number() }) })(req, res, next as NextFunction)
    expect(req.params).toEqual({ id: 42 })
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('passes ZodError to next() on invalid query', () => {
    const next = mock((_err?: unknown) => {})
    const req = makeReq({ query: { page: 'nan' } as never })
    validate({ query: z.object({ page: z.number() }) })(req, res, next as NextFunction)
    const [err] = (next as ReturnType<typeof mock>).mock.calls[0] as [unknown]
    expect(err).toBeDefined()
  })

  test('passes ZodError to next() on invalid params', () => {
    const next = mock((_err?: unknown) => {})
    const req = makeReq({ params: { id: 'bad' } as never })
    validate({ params: z.object({ id: z.number() }) })(req, res, next as NextFunction)
    const [err] = (next as ReturnType<typeof mock>).mock.calls[0] as [unknown]
    expect(err).toBeDefined()
  })
})
