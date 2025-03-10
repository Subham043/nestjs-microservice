import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const simpleMessagesProvider = new SimpleMessagesProvider({
  required: 'The {{ field }} key is required. Please add it to your .env file.',
})

const userAppConfigSchema = vine.object({
  GATEWAY_APP_PORT: vine.number(),
  GATEWAY_APP_URL: vine.string(),
  USER_APP_PORT: vine.number(),
  USER_APP_URL: vine.string(),
  DB_HOST: vine.string(),
  DB_PORT: vine.number(),
  DB_NAME: vine.string(),
  DB_USER: vine.string(),
  DB_PASSWORD: vine.string(),
  DB_URL: vine.string(),
  REDIS_URL: vine.string()
})


const userAppConfigValidator = vine.compile(userAppConfigSchema)
userAppConfigValidator.messagesProvider = simpleMessagesProvider

const gatewayAppConfigSchema = vine.object({
  GATEWAY_APP_PORT: vine.number(),
  GATEWAY_APP_URL: vine.string(),
  USER_APP_PORT: vine.number(),
  USER_APP_URL: vine.string(),
})


const gatewayAppConfigValidator = vine.compile(gatewayAppConfigSchema)
gatewayAppConfigValidator.messagesProvider = simpleMessagesProvider

export { userAppConfigValidator, gatewayAppConfigValidator }