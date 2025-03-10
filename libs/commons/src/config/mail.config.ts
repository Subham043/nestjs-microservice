import { registerAs } from "@nestjs/config";

export default registerAs('mail', () => ({
    mail_host: process.env.MAIL_HOST,
    mail_port: process.env.MAIL_PORT,
    mail_user: process.env.MAIL_USERNAME,
    mail_password: process.env.MAIL_PASSWORD,
}));