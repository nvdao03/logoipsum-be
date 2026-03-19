import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema'
import './env.config'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool, { schema })

export const connectDB = async () => {
  try {
    await pool.connect()
    console.log('Connected to PostgreSQL')
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error)
    process.exit(1)
  }
}
