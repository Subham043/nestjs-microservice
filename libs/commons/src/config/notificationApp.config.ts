import { registerAs } from "@nestjs/config";

export default registerAs('notificationApp', () => ({
    notification_app_port: process.env.NOTIFICATION_APP_PORT,
}));