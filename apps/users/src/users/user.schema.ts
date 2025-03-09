import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/build/src/types'

const userCreateSchema = vine.object({
  name: vine.string(),
  email: vine.string().email(),
  password: vine
    .string()
    .minLength(8)
    .maxLength(32)
    .confirmed()
})

export type UserCreate = Infer<typeof userCreateSchema>

const userCreateValidator = vine.compile(userCreateSchema)

export { userCreateValidator }