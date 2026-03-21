import { InferModel } from 'drizzle-orm'
import { varchar } from 'drizzle-orm/pg-core'
import { pgEnum } from 'drizzle-orm/pg-core'
import { timestamp } from 'drizzle-orm/pg-core'
import { serial } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'

export const verifyEnum = pgEnum('verify_status', ['0', '1'])

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  create_at: timestamp('create_at', { withTimezone: true }).defaultNow(),
  update_at: timestamp('update_at', { withTimezone: true }).defaultNow()
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 180 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  avatar: varchar('avatar', { length: 255 }),
  password: varchar('password', { length: 180 }).notNull(),
  role_id: serial('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'restrict' }),
  verify: verifyEnum('verify').notNull().default('0'),
  email_verify_token: varchar('email_verify_token', { length: 255 }),
  forgot_password_token: varchar('forgot_password_token', { length: 255 }),
  create_at: timestamp('create_at', { withTimezone: true }).defaultNow(),
  update_at: timestamp('update_at', { withTimezone: true }).defaultNow()
})

export const refresh_tokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  iat: timestamp('iat', { withTimezone: true }).notNull(),
  exp: timestamp('exp', { withTimezone: true }).notNull(),
  user_id: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  create_at: timestamp('create_at', { withTimezone: true }).defaultNow(),
  update_at: timestamp('update_at', { withTimezone: true }).defaultNow()
})

// --- Types ---
export type Role = InferModel<typeof roles>
export type User = InferModel<typeof users>
export type RefreshToken = InferModel<typeof refresh_tokens>
