import { TokenPayload } from '~/requests/auth.request'

declare module 'express' {
  interface Request {
    decoded_access_token?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
