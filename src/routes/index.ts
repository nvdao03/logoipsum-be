import { Router } from 'express'
import sharedRouter from './shared/index'

const router = Router()

// --- Public Router ---
router.use('/', sharedRouter)

export default router
