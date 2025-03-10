import { registerAs } from "@nestjs/config";

export default registerAs('rabbitMQ', () => ({
    uri: process.env.RABBIT_MQ_URI,
}));