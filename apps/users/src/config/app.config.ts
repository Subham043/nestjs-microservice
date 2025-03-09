import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    port: process.env.USER_APP_PORT || 3001
}));