/**
 * OpenAPI registry — single source of truth for the generated spec.
 *
 * Import `registry` in route/schema files to register paths and schemas.
 * `extendZodWithOpenApi` is called here so `.openapi()` is available on any
 * Zod schema imported after this module is first loaded.
 *
 * Ensure this file is imported before any schema files (app.ts does this).
 */
import { OpenApiGeneratorV31, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export { z }
export const registry = new OpenAPIRegistry()

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions)
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Node Template API',
      version: '1.0.0',
      description: 'Express + TypeScript + Drizzle + Zod API',
    },
    servers: [{ url: '/api', description: 'API base path' }],
  })
}
