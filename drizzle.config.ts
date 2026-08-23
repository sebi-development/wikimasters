import { config } from 'dotenv'
config({ path: '.env.local' })
import { defineConfig } from 'drizzle-kit'
import assert from 'node:assert'

assert(process.env.DATABASE_URL, 'you need a DB URL')

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  }
})