import { Router } from 'express'
import { logoutController, signUpController } from '~/controllers/auth.controller'
import { wrapHandler } from '~/utils/wrapHandler'
import { accessTokenValidator, refreshTokenValidator, signUpValidator } from '~/middlewares/auth.middleware'

const router = Router()

router.post('/sign-up', signUpValidator, wrapHandler(signUpController))
router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandler(logoutController))

export default router
