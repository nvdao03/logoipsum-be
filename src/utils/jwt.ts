import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/requests/auth.request'

export const signToken = ({
  payload,
  privateKey,
  option
}: {
  payload: object | string | Buffer
  privateKey: string
  option: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, option, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoed) => {
      if (err) {
        reject(err)
      }
      resolve(decoed as TokenPayload)
    })
  })
}
