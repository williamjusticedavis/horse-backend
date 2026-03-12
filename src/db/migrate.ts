/**
 * Standalone migration runner.
 *
 * Run with: bun run db:migrate
 * Reads SQL files from ./drizzle and tracks applied migrations in
 * the __drizzle_migrations table (created automatically on first run).
 */
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

// Use process.env directly — this script runs before the full app boots
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL environment variable is required')

const pool = new Pool({ connectionString: databaseUrl })
const db = drizzle({ client: pool })

console.log('Running database migrations...')

await migrate(db, { migrationsFolder: './drizzle' })

console.log('Migrations completed successfully')

await pool.end()
