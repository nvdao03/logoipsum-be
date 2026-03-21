export enum UserVerifyStatus {
  Unverifyed = '0',
  Verifyed = '1'
}

export enum Roles {
  Admin = 'admin',
  User = 'user'
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  EmailVerifyToken,
  ForgotPasswordToken
}
