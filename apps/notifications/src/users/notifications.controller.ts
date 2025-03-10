import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitMQService } from '@app/commons';

@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly rmqService: RabbitMQService,
  ) {}

  @Get()
  getHello(): string {
    return this.notificationsService.getHello();
  }
  
  @EventPattern('user.registered')
  test(@Payload() data: any, @Ctx() context: RmqContext): string {
    console.log('rmq: ',data);
    this.rmqService.ack(context);
    return this.notificationsService.getHello();
  }
}
