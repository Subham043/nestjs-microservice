import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_name: process.env.DB_NAME,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_url: process.env.DB_URL
}));