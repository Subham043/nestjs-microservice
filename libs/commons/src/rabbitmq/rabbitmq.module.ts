import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import rabbitMQConfig from '../config/rabbitMQ.config';

interface RmqModuleOptions {
  name: string;
}

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RabbitMQModule,
      imports: [
        // ClientsModule.registerAsync([
        //   {
        //     name,
        //     imports: [ConfigModule],
        //     inject: [rabbitMQConfig.KEY],
        //     useFactory: (config: ConfigType<typeof rabbitMQConfig>) => {
        //         return {
        //             transport: Transport.RMQ,
        //             options: {
        //               urls: [(config.uri as string)],
        //               queue: config.queue,
        //               queueOptions: {
        //                 durable: false
        //               },
        //             },
        //           };
        //     },
        //   },
        // ]),
        ClientsModule.register([
          {
            name,
            transport: Transport.RMQ,
            options: {
              urls: [(process.env.RABBITMQ_URI as string)],
              queue: process.env.RABBITMQ_QUEUE,
              queueOptions: {
                durable: false
              },
            },
          }
        ])
      ],
      exports: [ClientsModule],
    };
  }
}