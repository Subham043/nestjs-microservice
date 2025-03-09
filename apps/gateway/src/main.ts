import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import proxy from '@fastify/http-proxy';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  // Register the http-proxy plugin with the desired options
  fastifyAdapter.register(proxy, {
    upstream: 'http://localhost:3001', // Target server
    prefix: '/api/users', // Proxy requests starting with '/api/users'
    rewritePrefix: '/users', // Rewrite '/api/users' to '/users'
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);

  // Get ConfigService from the app context
  const configService = app.get(ConfigService);

  // Retrieve environment variables
  const GATEWAY_APP_PORT = configService.get<number>('GATEWAY_APP_PORT') || 3000;

  await app.listen(GATEWAY_APP_PORT);
}
bootstrap();
