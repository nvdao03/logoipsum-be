import { UserVerifyStatus } from '~/constants/enum'

export interface TokenPayload {
  user_id: number
  token_type: string
  verify: UserVerifyStatus
  role: string
  iat: number
  exp: number
}

export interface SignUpRequestBody {
  email: string
  password: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface SignInRequestBody {
  email: string
  password: string
}
