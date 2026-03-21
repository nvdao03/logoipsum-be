import { eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { Roles, TokenType, UserVerifyStatus } from '~/constants/enum'
import { refresh_tokens, roles, users } from '~/db/schema'
import { SignUpRequestBody } from '~/requests/auth.request'
import hashpasword from '~/utils/ctypto'
import { signToken, verifyToken } from '~/utils/jwt'

class AuthService {
  // --- Check Email Exits --- //
  async checkEmailExits(email: string) {
    const [isEmail] = await db.select({ email: users.email }).from(users).where(eq(users.email, email)).limit(1)
    return Boolean(isEmail)
  }

  // --- Sign Access Token --- //
  async signAccessToken({
    user_id,
    role,
    verify
  }: {
    user_id: number
    role: string
    verify: UserVerifyStatus.Unverifyed
  }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        role,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      option: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as any,
        algorithm: 'HS256'
      }
    })
  }

  // --- Sign Refresh Token --- //
  async signRefreshToken({
    user_id,
    verify,
    role,
    exp
  }: {
    user_id: number
    role: string
    verify: UserVerifyStatus
    exp?: number
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          verify,
          role,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
        option: {
          algorithm: 'HS256'
        }
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify,
        role
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      option: {
        algorithm: 'HS256',
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any
      }
    })
  }

  // --- Sign Email Verify Token --- //
  async signEmailVerifyToken({ user_id, role, verify }: { user_id: number; role: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        role,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      option: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as any,
        algorithm: 'HS256'
      }
    })
  }

  // --- Sign Up --- //
  async signUp(data: SignUpRequestBody) {
    const { email, password } = data
    const [role] = await db.select().from(roles).where(eq(roles.name, Roles.User)).limit(1)
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashpasword(password),
        role_id: role.id,
        verify: UserVerifyStatus.Unverifyed
      })
      .returning()
    const [access_token, refresh_token, email_verify_token] = await Promise.all([
      this.signAccessToken({
        user_id: newUser.id,
        role: role.name,
        verify: UserVerifyStatus.Unverifyed
      }),
      this.signRefreshToken({
        user_id: newUser.id,
        role: role.name,
        verify: UserVerifyStatus.Unverifyed
      }),
      this.signEmailVerifyToken({
        user_id: newUser.id,
        role: role.name,
        verify: UserVerifyStatus.Unverifyed
      })
    ])
    const [decoded_access_token, decoded_refresh_token] = await Promise.all([
      verifyToken({ token: access_token, secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string }),
      verifyToken({ token: refresh_token, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string })
    ])
    const [user] = await db.update(users).set({ email_verify_token }).where(eq(users.id, newUser.id)).returning()
    const [inser_refresh_token] = await db
      .insert(refresh_tokens)
      .values({
        user_id: user.id,
        token: refresh_token,
        iat: new Date(decoded_access_token.iat * 1000),
        exp: new Date(decoded_refresh_token.exp * 1000)
      })
      .returning()
    return {
      access_token,
      refresh_token,
      user,
      decoded_access_token,
      decoded_refresh_token,
      role
    }
  }
}

const authService = new AuthService()
export default authService
