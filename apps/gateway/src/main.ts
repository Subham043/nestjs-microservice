import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import proxy from '@fastify/http-proxy';
import helmet from 'helmet';
import { QUEUE_USER, RabbitMQService, TransformInterceptor } from '@app/commons';
import { RmqOptions } from '@nestjs/microservices';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ trustProxy: true});

  // Register the http-proxy plugin with the desired options
  fastifyAdapter.register(proxy, {
    upstream: 'http://users:3001', // Target server
    prefix: '/api/v1/users', // Proxy requests starting with '/api/users'
    rewritePrefix: '/v1/users', // Rewrite '/api/users' to '/users'
  });
  
  fastifyAdapter.register(proxy, {
    upstream: 'http://users:3001', // Target server
    prefix: '/api/v1/auth', // Proxy requests starting with '/api/users'
    rewritePrefix: '/v1/auth', // Rewrite '/api/users' to '/users'
  });
  
  fastifyAdapter.register(proxy, {
    upstream: 'http://notifications:3002', // Target server
    prefix: '/api/v1/notifications', // Proxy requests starting with '/api/users'
    rewritePrefix: '/v1/notifications', // Rewrite '/api/users' to '/users'
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  const rmqService = app.get<RabbitMQService>(RabbitMQService);

  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Get ConfigService from the app context
  const configService = app.get(ConfigService);

  // Retrieve environment variables
  const GATEWAY_APP_PORT = configService.get<number>('GATEWAY_APP_PORT') as number;
  const GATEWAY_APP_URL = configService.get<string>('GATEWAY_APP_URL') as string;
  const USER_APP_URL = configService.get<string>('USER_APP_URL') as string;

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
      const whitelist = [GATEWAY_APP_URL, USER_APP_URL];
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
  
  app.connectMicroservice<RmqOptions>(rmqService.getOptions(QUEUE_USER.GATEWAY, true));
  
  await app.listen(GATEWAY_APP_PORT, '0.0.0.0');
  await app.startAllMicroservices();
}
bootstrap();
