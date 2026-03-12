import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

interface ValidateSchemas {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
}

/**
 * Validates and replaces req.body / req.query / req.params with the parsed
 * Zod output. Throws a ZodError on failure, which the global error handler
 * converts to a 400 response with structured issue details.
 *
 * @example
 * router.post('/register', validate({ body: RegisterBodySchema }), handler)
 */
export function validate(schemas: ValidateSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body)
      if (schemas.query) req.query = schemas.query.parse(req.query)
      if (schemas.params) req.params = schemas.params.parse(req.params)
      next()
    } catch (err) {
      next(err)
    }
  }
}
