import express from 'express'
import './configs/env.config'
import { connectDB } from '~/configs/postgreSQL.config'

const PORT = process.env.PORT || 4000

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })

  await connectDB()
}

startServer()
