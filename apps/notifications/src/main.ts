import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { NotificationsAppModule } from './app.module';
import { QUEUE_USER, RabbitMQService, TransformInterceptor } from '@app/commons';
import { RmqOptions } from '@nestjs/microservices';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(NotificationsAppModule, new FastifyAdapter({ trustProxy: true }));
  const configService = app.get(ConfigService);
  const NOTIFICATION_APP_PORT = configService.get<number>('NOTIFICATION_APP_PORT') as number;

  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const rmqService = app.get<RabbitMQService>(RabbitMQService);
  const microservice = app.connectMicroservice<RmqOptions>(rmqService.getOptions(QUEUE_USER.NOTIFICATION));
  await app.listen(NOTIFICATION_APP_PORT, '0.0.0.0');
  await microservice.listen();
}
bootstrap();
