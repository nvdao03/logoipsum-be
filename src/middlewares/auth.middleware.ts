import { checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE } from '~/constants/message'
import authService from '~/services/auth.service'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

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
