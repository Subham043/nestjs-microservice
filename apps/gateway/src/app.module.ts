import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@app/commons/config/app.config';
import { gatewayAppConfigValidator } from '@app/commons';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/gateway/.env',
      load: [appConfig],
      isGlobal: true,
      cache: true,
      validationSchema: gatewayAppConfigValidator,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
