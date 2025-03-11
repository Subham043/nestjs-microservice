import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule, RabbitMQModule, ThrottleModule, userAppConfigValidator } from '@app/commons';
import databaseConfig from '@app/commons/config/database.config';
import appConfig from '@app/commons/config/app.config';
import redisConfig from '@app/commons/config/redis.config';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import jwtConfig from '@app/commons/config/jwt.config';
import rabbitMQConfig from '@app/commons/config/rabbitMQ.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      expandVariables: true,
      load: [databaseConfig, appConfig, redisConfig, jwtConfig, rabbitMQConfig],
      isGlobal: true,
      cache: false,
      validationSchema: userAppConfigValidator
    }),
    EventEmitterModule.forRoot(),
    ThrottleModule.forRootAsync(),
    RabbitMQModule,
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
})
export class UsersAppModule {}
