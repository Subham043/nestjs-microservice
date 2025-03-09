import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { UsersModule } from './users/users.module';
import appConfig from './config/app.config';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottleModule } from '@app/commons';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/users/.env',
      load: [databaseConfig, appConfig],
      isGlobal: true
    }),
    UsersModule,
    PrismaModule,
    ThrottleModule,
  ],
})
export class UsersAppModule {}
