import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { createApp } from './app'
import { config } from '@/lib/config'
import { logger } from '@/lib/logger'

const pool = new Pool({ connectionString: config.databaseUrl })
const db = drizzle({ client: pool })

logger.info('Running database migrations...')
await migrate(db, { migrationsFolder: './drizzle' })
await pool.end()
logger.info('Migrations complete')

const app = createApp()

app.listen(config.port, () => {
  logger.info(
    { port: config.port, env: config.env, docs: `http://localhost:${config.port}/docs` },
    'Server started'
  )
})
