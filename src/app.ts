/**
 * Express app factory.
 *
 * Separating app creation from server startup (src/index.ts) makes the app
 * importable in tests without binding to a port.
 *
 * Import order matters: openapi.ts must be first so extendZodWithOpenApi() runs
 * before any schema file is evaluated.
 */
import './lib/openapi' // must be first — extends Zod before schema files load
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { join } from 'path'
import { mkdirSync } from 'fs'
import { config } from '@/lib/config'
import { logger } from '@/lib/logger'
import { errorHandler } from '@/middleware/error-handler'
import { router } from '@/routes'
import { generateOpenApiDocument } from '@/lib/openapi'

export function createApp() {
  const app = express()

  // ── Security ─────────────────────────────────────────────────────────────────
  app.use(helmet())
  app.use(cors({ origin: config.corsOrigin, credentials: true }))

  // ── Body parsing ─────────────────────────────────────────────────────────────
  app.use(express.json())

  // ── Request logging ───────────────────────────────────────────────────────────
  app.use((req, _res, next) => {
    logger.debug({ method: req.method, url: req.url }, 'incoming request')
    next()
  })

  // ── Uploads (static files) ────────────────────────────────────────────────────
  const uploadsDir = join(process.cwd(), 'uploads')
  mkdirSync(uploadsDir, { recursive: true })
  app.use(
    '/uploads',
    (_req, res, next) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
      next()
    },
    express.static(uploadsDir)
  )

  // ── API routes ────────────────────────────────────────────────────────────────
  app.use('/api', router)

  // ── OpenAPI docs ──────────────────────────────────────────────────────────────
  // Spec: GET /openapi.json  |  UI: GET /docs
  const spec = generateOpenApiDocument()
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec))
  app.get('/openapi.json', (_req, res) => res.json(spec))

  // ── Health check ──────────────────────────────────────────────────────────────
  // No DB query — safe for load-balancer probes
  app.get('/health', (_req, res) => res.json({ status: 'ok' }))

  // ── 404 ───────────────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  // ── Global error handler (must be last) ───────────────────────────────────────
  app.use(errorHandler)

  return app
}
