import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule, ThrottleModule, userAppConfigValidator } from '@app/commons';
import databaseConfig from '@app/commons/config/database.config';
import appConfig from '@app/commons/config/app.config';
import redisConfig from '@app/commons/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/users/.env',
      load: [databaseConfig, appConfig, redisConfig],
      isGlobal: true,
      cache: true,
      validationSchema: userAppConfigValidator
    }),
    UsersModule,
    PrismaModule,
    ThrottleModule,
  ],
})
export class UsersAppModule {}
