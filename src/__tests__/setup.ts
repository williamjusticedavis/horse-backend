/**
 * Test preload — runs before every test file (configured in bunfig.toml).
 *
 * Sets all required environment variables so config.ts passes Zod validation
 * when test modules import it. These values are only used for tests — never
 * connect to a real database or use real secrets here.
 */
process.env.NODE_ENV = 'test'
process.env.PORT = '0' // let the OS pick a free port
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/app_test'
process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-chars!!'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars!'
process.env.CORS_ORIGIN = 'http://localhost:5173'
