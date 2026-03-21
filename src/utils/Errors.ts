import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE } from './../constants/message'

type ErrorType = Record<
  string,
  {
    msg: string
  }
>

// --- Xử lý lỗi thông thường ---
export class ErrorStatus {
  status: number
  message: string

  constructor({ status, message }: { status: number; message: string }) {
    this.status = status
    this.message = message
  }
}

// --- Xử lý lỗi validation - 422 ---
export class ErrorEntity extends ErrorStatus {
  errors: ErrorType

  constructor({ message = AUTH_MESSAGE.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
