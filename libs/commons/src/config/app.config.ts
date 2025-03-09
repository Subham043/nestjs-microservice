import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    gateway_app_port: process.env.GATEWAY_APP_PORT || 3000,
    gateway_app_url: process.env.GATEWAY_APP_URL || 'http://localhost:3000',
    user_app_port: process.env.USER_APP_PORT || 3001,
    user_app_url: process.env.USER_APP_URL || 'http://localhost:3001',
}));