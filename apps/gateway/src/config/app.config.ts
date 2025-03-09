import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    port: process.env.GATEWAY_APP_PORT || 3000,
    app_url: process.env.APP_URL || 'http://localhost:3000',
    user_app_url: process.env.USER_APP_URL || 'http://localhost:3001'
}));