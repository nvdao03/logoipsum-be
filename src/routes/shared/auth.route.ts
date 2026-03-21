import { Router } from 'express'
import { signUpController } from '~/controllers/auth.controller'
import { wrapHandler } from '~/utils/wrapHandler'
import { signUpValidator } from '~/middlewares/auth.middleware'

const router = Router()

router.post('/sign-up', signUpValidator, wrapHandler(signUpController))

export default router
