import { Router } from 'express'
import { logoutController, signInController, signUpController } from '~/controllers/auth.controller'
import { wrapHandler } from '~/utils/wrapHandler'
import {
  accessTokenValidator,
  refreshTokenValidator,
  signInValidator,
  signUpValidator
} from '~/middlewares/auth.middleware'

const router = Router()

// --- Auth Router --- //
router.post('/sign-up', signUpValidator, wrapHandler(signUpController))
router.post('/sign-in', signInValidator, wrapHandler(signInController))
router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandler(logoutController))

export default router
