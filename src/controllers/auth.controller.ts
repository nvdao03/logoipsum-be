import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UserVerifyStatus } from '~/constants/enum'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE } from '~/constants/message'
import { User } from '~/db/schema'
import { LogoutRequestBody, SignInRequestBody, SignUpRequestBody } from '~/requests/auth.request'
import authService from '~/services/auth.service'

// --- Sign Up Controller --- //
export const signUpController = async (
  req: Request<ParamsDictionary, any, SignUpRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await authService.signUp(req.body)
  const { access_token, refresh_token, decoded_access_token, decoded_refresh_token, role, user } = result
  return res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.SIGN_UP_SUCCESS,
    data: {
      access_token,
      access_token_expires: decoded_access_token.exp,
      refresh_token,
      refresh_token_expires: decoded_refresh_token.exp,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
        role: role.name,
        create_at: user.create_at,
        update_at: user.update_at
      }
    }
  })
}

// --- Log Out Controller --- //
export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await authService.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json({
    ...result
  })
}

// --- Sign In Controller --- //
export const signInController = async (
  req: Request<ParamsDictionary, any, SignInRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const { id, role_id } = user
  const result = await authService.signIn({ id, role_id, verify: user.verify as UserVerifyStatus })
  const { access_token, decoded_access_token, decoded_refresh_token, refresh_token, role } = result
  return res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.SIGN_IN_SUCCESS,
    data: {
      access_token,
      access_token_expires: decoded_access_token.exp,
      refresh_token,
      refresh_token_expires: decoded_refresh_token.exp,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
        role: role.name,
        create_at: user.create_at,
        update_at: user.update_at
      }
    }
  })
}
