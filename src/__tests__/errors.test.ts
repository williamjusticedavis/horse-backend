import { describe, test, expect } from 'bun:test'
import { AppError } from '../middleware/error-handler'

describe('AppError', () => {
  test('is an instance of Error', () => {
    const err = new AppError(404, 'Not found')
    expect(err instanceof Error).toBe(true)
  })

  test('stores status and message', () => {
    const err = new AppError(409, 'Conflict')
    expect(err.status).toBe(409)
    expect(err.message).toBe('Conflict')
    expect(err.name).toBe('AppError')
  })

  test('stores optional error code', () => {
    const err = new AppError(400, 'Bad request', 'INVALID_INPUT')
    expect(err.code).toBe('INVALID_INPUT')
  })

  test('code is undefined when not provided', () => {
    const err = new AppError(500, 'Internal server error')
    expect(err.code).toBeUndefined()
  })
})
