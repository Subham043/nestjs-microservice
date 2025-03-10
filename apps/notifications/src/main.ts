import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { NotificationsAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(NotificationsAppModule, new FastifyAdapter({ trustProxy: true }));
  const configService = app.get(ConfigService);
  const NOTIFICATION_APP_PORT = configService.get<number>('NOTIFICATION_APP_PORT') || 3002;
  await app.listen(NOTIFICATION_APP_PORT);
}
bootstrap();
