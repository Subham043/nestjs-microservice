import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { UsersAppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService, TransformInterceptor, ValidationExceptionFilter } from '@app/commons';
import { VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(UsersAppModule, new FastifyAdapter({ trustProxy: true }));
  const configService = app.get(ConfigService);
  const USER_APP_PORT = configService.get<number>('USER_APP_PORT') || 3001;
  const GATEWAY_APP_URL = configService.get<string>('GATEWAY_APP_URL') || 'http://localhost:3000';
  const USER_APP_URL = configService.get<string>('USER_APP_URL') || 'http://localhost:3001';

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new ValidationExceptionFilter());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'style-src': ["'self'"],
          'script-src': ["'self'"],
          'font-src': ["'self'"],
          'object-src': ["'self'"],
          'img-src': ["'self'", GATEWAY_APP_URL, USER_APP_URL],
          'frame-src': ["'self'", GATEWAY_APP_URL, USER_APP_URL],
          'frame-ancestors': ["'self'", GATEWAY_APP_URL, USER_APP_URL],
          'connect-src': ["'self'", GATEWAY_APP_URL, USER_APP_URL],
          'form-action': ["'self'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      frameguard: {
        action: 'sameorigin',
      },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      referrerPolicy: { policy: 'no-referrer' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 15552000,
        includeSubDomains: true,
        preload: true,
      },
      xssFilter: true,
    }),
  );
  app.enableCors({
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'Range',
    ],
    origin: function (origin, callback) {
      const whitelist = [GATEWAY_APP_URL];
      if (origin) {
        if (whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'), false);
        }
      } else callback(null, true);
    },
    credentials: true,
    exposedHeaders: 'Content-Length',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  // Get ConfigService from the app context
  
  // Retrieve environment variables

  const rmqService = app.get<RabbitMQService>(RabbitMQService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));
  await app.startAllMicroservices();

  await app.listen(USER_APP_PORT);
}
bootstrap();
