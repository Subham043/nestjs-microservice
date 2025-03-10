import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    gateway_app_port: process.env.GATEWAY_APP_PORT,
    gateway_app_url: process.env.GATEWAY_APP_URL,
    user_app_port: process.env.USER_APP_PORT,
    user_app_url: process.env.USER_APP_URL,
}));