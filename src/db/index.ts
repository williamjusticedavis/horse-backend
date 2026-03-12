import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from '@/lib/config'
import * as schema from './schema'

// pg.Pool connects lazily — no actual TCP connection is made until the first query.
// This means the module can be imported in tests without a running Postgres instance,
// as long as no queries are executed.
const pool = new Pool({ connectionString: config.databaseUrl })

export const db = drizzle({ client: pool, schema })
