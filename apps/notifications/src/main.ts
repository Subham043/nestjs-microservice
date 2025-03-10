import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { NotificationsAppModule } from './app.module';
import { QUEUE_USER, RabbitMQService } from '@app/commons';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(NotificationsAppModule, new FastifyAdapter({ trustProxy: true }));
  const configService = app.get(ConfigService);
  const NOTIFICATION_APP_PORT = configService.get<number>('NOTIFICATION_APP_PORT') as number;
  const rmqService = app.get<RabbitMQService>(RabbitMQService);
  const microservice = app.connectMicroservice<RmqOptions>(rmqService.getOptions(QUEUE_USER.NOTIFICATION));
  await app.listen(NOTIFICATION_APP_PORT);
  await microservice.listen();
}
bootstrap();
