import { defineConfig } from 'drizzle-kit'

// Uses process.env directly — drizzle-kit is a CLI tool and Bun auto-loads .env
export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
