import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/build/src/types'
import { uniqueEmailRule } from '../validation/unique'

const userSignupSchema = vine.object({
  name: vine.string(),
  email: vine.string().email().use(uniqueEmailRule()),
  password: vine
    .string()
    .minLength(8)
    .maxLength(32)
    .confirmed()
})

export type UserSignup = Infer<typeof userSignupSchema>
const userSignupValidator = vine.compile(userSignupSchema)

const userSigninSchema = vine.object({
  email: vine.string().email(),
  password: vine
    .string()
})

export type UserSignin = Infer<typeof userSigninSchema>
const userSigninValidator = vine.compile(userSigninSchema)

export { userSignupValidator, userSigninValidator }