import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET_KEY,
    expiry: process.env.JWT_EXPIRY_TIME,
    refresh_secret: process.env.JWT_REFRESH_SECRET_KEY,
    refresh_expiry: process.env.JWT_REFRESH_EXPIRY_TIME,
}));