import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@app/commons/config/app.config';
import { gatewayAppConfigValidator, QUEUE_USER, RabbitMQModule } from '@app/commons';
import rabbitMQConfig from '@app/commons/config/rabbitMQ.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      expandVariables: true,
      load: [appConfig, rabbitMQConfig],
      isGlobal: true,
      cache: false,
      validationSchema: gatewayAppConfigValidator,
    }),
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
