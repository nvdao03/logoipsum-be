import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { create } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE } from '~/constants/message'
import { SignUpRequestBody } from '~/requests/auth.request'
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
