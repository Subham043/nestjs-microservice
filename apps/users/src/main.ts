import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { UsersAppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor, ValidationExceptionFilter } from '@app/commons';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(UsersAppModule, new FastifyAdapter());

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new ValidationExceptionFilter());

  // Get ConfigService from the app context
  const configService = app.get(ConfigService);
  
  // Retrieve environment variables
  const USER_APP_PORT = configService.get<number>('USER_APP_PORT') || 3001;

  await app.listen(USER_APP_PORT);
}
bootstrap();
