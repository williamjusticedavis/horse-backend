# Node Template

A production-ready Node.js + TypeScript backend starter. Clone it and start building — all foundations are laid.

Designed to pair with [frontend-template](../frontend-template) (React + TanStack Router + Tailwind).

## Stack

| Layer           | Library                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Runtime & tests | [Bun](https://bun.sh)                                                                           |
| Framework       | [Express 5](https://expressjs.com)                                                              |
| Language        | TypeScript (strict)                                                                             |
| ORM             | [Drizzle ORM](https://orm.drizzle.team) + [pg](https://node-postgres.com)                       |
| Database        | PostgreSQL 17                                                                                   |
| Validation      | [Zod](https://zod.dev) (requests + env vars)                                                    |
| Auth            | JWT via [jose](https://github.com/panva/jose) (access + refresh tokens)                         |
| Logging         | [Pino](https://getpino.io) + pino-pretty (dev)                                                  |
| OpenAPI         | [@asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) + Swagger UI |
| Linting         | ESLint 9 (flat config) + TypeScript ESLint                                                      |
| Formatting      | Prettier                                                                                        |

## Getting started

```bash
# 1. Clone
git clone <repo-url> my-api && cd my-api

# 2. Install
bun install

# 3. Set environment variables
cp .env.example .env
# Edit .env — at minimum set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
# Generate secrets: openssl rand -base64 32

# 4. Start Postgres (or use docker-compose — see Docker section)
#    Default DATABASE_URL expects postgres on localhost:5432

# 5. Run migrations
bun run db:migrate

# 6. Start dev server
bun run dev
```

API is available at [http://localhost:8000](http://localhost:8000).
Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

## Scripts

```bash
bun run dev            # Start dev server with hot-reload (--watch)
bun run build          # Bundle to dist/ (Bun target)
bun run start          # Run production bundle
bun run lint           # ESLint
bun run lint:fix       # ESLint with auto-fix
bun run format         # Prettier (write)
bun run format:check   # Prettier (check only)
bun run test           # Bun test runner
bun run test:watch     # Tests in watch mode
bun run typecheck      # tsc --noEmit

bun run db:generate    # Generate a new SQL migration from schema changes
bun run db:migrate     # Apply pending migrations
bun run db:push        # Push schema directly to DB (dev shortcut, no migration file)
bun run db:studio      # Open Drizzle Studio in the browser
```

## Docker

The `db` service (Postgres) starts automatically with both commands below.

```bash
# Production build (port 8000)
docker compose up api

# Development server with hot-reload (port 8000)
docker compose --profile dev up dev
```

The `dev` service runs `bun install && bun run db:migrate && bun run dev` on startup, so cloning and running `docker compose --profile dev up dev` is all you need.

## Environment variables

All variables are read once at startup and validated with Zod. A clear error is thrown if any required variable is missing.

| Variable                 | Default                       | Required | Description                                                  |
| ------------------------ | ----------------------------- | -------- | ------------------------------------------------------------ |
| `PORT`                   | `8000`                        |          | Port the server listens on                                   |
| `NODE_ENV`               | `development`                 |          | `development` \| `production` \| `test`                      |
| `DATABASE_URL`           | —                             | ✅       | Postgres connection string                                   |
| `JWT_ACCESS_SECRET`      | —                             | ✅       | Secret for signing access tokens (min 32 chars)              |
| `JWT_REFRESH_SECRET`     | —                             | ✅       | Secret for signing refresh tokens (min 32 chars)             |
| `JWT_ACCESS_EXPIRES_IN`  | `15m`                         |          | Access token lifetime (any string `jose` accepts)            |
| `JWT_REFRESH_EXPIRES_IN` | `7d`                          |          | Refresh token lifetime                                       |
| `CORS_ORIGIN`            | `http://localhost:5173`       |          | Allowed CORS origin (matches frontend-template)              |
| `LOG_LEVEL`              | `debug` (dev) / `info` (prod) |          | `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace` |

`src/lib/config.ts` is the single source of truth — import from there, never read `process.env` directly.

## Project structure

```
src/
├── __tests__/
│   ├── setup.ts          # Preload — sets test env vars before any import
│   ├── app.test.ts       # Integration tests (health, 404, validation, auth guards)
│   └── errors.test.ts    # AppError unit tests
├── db/
│   ├── index.ts          # Drizzle client (pg Pool, lazy connect)
│   ├── migrate.ts        # Standalone migration runner
│   └── schema/
│       ├── users.ts          # users table
│       ├── refresh-tokens.ts # refresh_tokens table
│       └── index.ts          # barrel
├── lib/
│   ├── config.ts         # Zod-validated env config
│   ├── logger.ts         # Pino instance
│   └── openapi.ts        # Registry + generateOpenApiDocument()
├── middleware/
│   ├── auth.ts           # JWT Bearer verification, sets req.userId
│   ├── error-handler.ts  # AppError class + global error handler
│   └── validate.ts       # Zod body/query/params validation
├── routes/
│   ├── auth/
│   │   ├── auth.schemas.ts   # Zod schemas + OpenAPI path registrations
│   │   ├── auth.handlers.ts  # register, login, refresh, logout
│   │   └── auth.router.ts
│   ├── users/
│   │   ├── users.schemas.ts
│   │   ├── users.handlers.ts # getMe
│   │   └── users.router.ts
│   └── index.ts          # Mounts /auth and /users under /api
├── app.ts                # createApp() — Express setup, middleware, routes
└── index.ts              # Entry point — app.listen
drizzle/
├── 0000_initial.sql      # Initial migration (users + refresh_tokens)
└── meta/_journal.json    # Drizzle migration journal
```

## Auth flow

Authentication uses **short-lived JWTs** (access tokens) plus **rotating refresh tokens** stored as SHA-256 hashes in the database.

```
POST /api/auth/register   { email, password }
  → 201 { user, accessToken, refreshToken }

POST /api/auth/login      { email, password }
  → 200 { user, accessToken, refreshToken }

POST /api/auth/refresh    { refreshToken }
  → 200 { accessToken, refreshToken }   ← old token is deleted (rotation)

POST /api/auth/logout     { refreshToken }
  → 204                                 ← token deleted from DB

GET  /api/users/me        Authorization: Bearer <accessToken>
  → 200 { user }
```

Include the access token in requests:

```ts
// In the frontend-template this is handled by src/lib/api.ts
headers: {
  Authorization: `Bearer ${accessToken}`
}
```

Access tokens expire in **15 minutes**. Use the refresh endpoint to get a new pair before they expire.

## Adding a route

1. Create `src/routes/things/` with `things.schemas.ts`, `things.handlers.ts`, and `things.router.ts`
2. Register OpenAPI paths in `things.schemas.ts` using `registry.registerPath()`
3. Mount the router in `src/routes/index.ts`:

```ts
import { thingsRouter } from './things/things.router'
router.use('/things', thingsRouter)
```

4. Add a new schema migration if the route needs new tables:

```bash
bun run db:generate   # generates drizzle/<n>_description.sql
bun run db:migrate    # applies it
```

## OpenAPI

The spec is auto-generated from Zod schemas at startup.

- JSON spec: `GET /openapi.json`
- Swagger UI: `GET /docs`

Register new paths in the relevant `*.schemas.ts` file using `registry.registerPath()`. See `src/routes/auth/auth.schemas.ts` for examples.

## Testing

```bash
bun test              # run all tests
bun test --watch      # re-run on file changes
```

Tests in `src/__tests__/setup.ts` (preloaded via `bunfig.toml`) set all required env vars before any module is imported, so the Zod config validation passes without a `.env` file.

Tests that hit routes not querying the database run without a Postgres instance. Integration tests for routes that touch the DB require the `db` service to be running:

```bash
docker compose up db -d   # start Postgres in the background
bun test                  # run all tests
```
