import { config } from 'dotenv'
import path from 'path'

const envFile = `.env.${process.env.NODE_ENV || 'development'}`
config({
  path: path.resolve(envFile)
})
