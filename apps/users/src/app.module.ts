import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule, ThrottleModule, userAppConfigValidator } from '@app/commons';
import databaseConfig from '@app/commons/config/database.config';
import appConfig from '@app/commons/config/app.config';
import redisConfig from '@app/commons/config/redis.config';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import jwtConfig from '@app/commons/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/users/.env',
      expandVariables: true,
      load: [databaseConfig, appConfig, redisConfig, jwtConfig],
      isGlobal: true,
      cache: true,
      validationSchema: userAppConfigValidator
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    ThrottleModule,
    UsersModule,
    AuthModule,
  ],
})
export class UsersAppModule {}
