import { and, eq } from 'drizzle-orm'
import { checkSchema } from 'express-validator'
import { db } from '~/configs/postgreSQL.config'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE } from '~/constants/message'
import { refresh_tokens, User, users } from '~/db/schema'
import { SignInRequestBody, TokenPayload } from '~/requests/auth.request'
import authService from '~/services/auth.service'
import hashpasword from '~/utils/ctypto'
import { ErrorStatus } from '~/utils/Errors'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

// --- Sign Up Validator --- //
export const signUpValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: AUTH_MESSAGE.EMAIL_INVALID
        },
        notEmpty: {
          errorMessage: AUTH_MESSAGE.EMAIL_NOT_EMPTY
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const isEmail = await authService.checkEmailExits(value)
            if (isEmail) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.EMAIL_EXISTS,
                status: HTTP_STATUS.CONFLICT
              })
            }
            return true
          }
        }
      },
      password: {
        isString: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.PASSWORD_NOT_EMPTY
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 180
          },
          errorMessage: AUTH_MESSAGE.PASSWORD_INVALID_LENGTH
        }
      }
    },
    ['body']
  )
)

// --- Access Token validator --- //
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        isString: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const accessToken = value.split(' ')[1]
            if (!accessToken) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.ACCESS_TOKEN_NOT_EMPTY,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_access_token = await verifyToken({
                token: accessToken,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              const { user_id } = decoded_access_token as TokenPayload
              const [user] = await db.select().from(users).where(eq(users.id, user_id)).limit(1)
              if (!user) {
                throw new ErrorStatus({
                  message: AUTH_MESSAGE.USER_NOT_FOUND,
                  status: HTTP_STATUS.NOT_FOUND
                })
              }
              req.decoded_access_token = decoded_access_token as TokenPayload
            } catch (error) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.ACCESS_TOKEN_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

// --- Refresh Token validator --- //
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        isString: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.REFRESH_TOKEN_NOT_EMPTY,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_refresh_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
              })
              const [isRefreshToken] = await db
                .select()
                .from(refresh_tokens)
                .where(eq(refresh_tokens.token, value))
                .limit(1)
              if (!isRefreshToken) {
                throw new ErrorStatus({
                  message: AUTH_MESSAGE.REFRESH_TOKEN_NOT_EXISTS,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              req.decoded_refresh_token = decoded_refresh_token as TokenPayload
            } catch (error) {
              if (error instanceof ErrorStatus) {
                throw error
              }
              throw new ErrorStatus({
                message: AUTH_MESSAGE.REFRESH_TOKEN_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

// --- Sign In Validator --- //
export const signInValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: AUTH_MESSAGE.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.EMAIL_NOT_EMPTY,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const { password } = req.body as SignInRequestBody
            const hassPassword = hashpasword(password)
            const [user] = await db
              .select()
              .from(users)
              .where(and(eq(users.email, value), eq(users.password, hassPassword)))
              .limit(1)
            if (!user) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            req.user = user as User
            return true
          }
        }
      },
      password: {
        isString: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.PASSWORD_NOT_EMPTY
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 180
          },
          errorMessage: AUTH_MESSAGE.PASSWORD_INVALID_LENGTH
        }
      }
    },
    ['body']
  )
)
