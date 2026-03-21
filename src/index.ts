import express from 'express'
import './configs/env.config'
import { connectDB } from '~/configs/postgreSQL.config'
import router from '~/routes'
import errorHandler from '~/middlewares/error.middleware'

const PORT = process.env.PORT || 4000

// --- Middlewares ---
const app = express()
app.use(express.json())

// --- Routes ---
app.use('/api', router)

// --- Error Handler ---
app.use(errorHandler)

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
