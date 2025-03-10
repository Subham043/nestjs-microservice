import { PrismaClient } from "@prisma/client"
import vine from "@vinejs/vine"
import { FieldContext } from '@vinejs/vine/build/src/types'


/**
 * Options accepted by the unique rule
 */
type Options = undefined

/**
 * Implementation
 */
async function uniqueEmail(
  value: string,
  options: Options,
  field: FieldContext
) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }
  
  const row = await new PrismaClient().user.findUnique({
    where: {
      email: value
    },
    select: {
        email: true
    }
  })
   
  if (row) {
    field.report(
      'The {{ field }} field is already taken',
      'unique',
      field
    )
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const uniqueEmailRule = vine.createRule(uniqueEmail)
