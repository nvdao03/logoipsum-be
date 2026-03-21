import { Router } from 'express'
import authRouter from './auth.route'

const shareRouter = Router()

shareRouter.use('/auth', authRouter)

export default shareRouter
