import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import rabbitMQConfig from '../config/rabbitMQ.config';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject(rabbitMQConfig.KEY)
    private rmqConfig: ConfigType<typeof rabbitMQConfig>,
  ) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [(this.rmqConfig.uri as string)],
        queue: queue,
        noAck,
        persistent: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}