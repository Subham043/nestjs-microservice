import { Controller, Get } from '@nestjs/common';
import { UserNotificationsService } from './users.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitMQService, USER_EVENTS } from '@app/commons';
import { UserRegisteredPayload } from './user_notification.types';

@Controller()
export class UserNotificationsController {
  constructor(
    private readonly notificationsService: UserNotificationsService,
    private readonly rmqService: RabbitMQService,
  ) {}

  @Get()
  getHello(): string {
    return this.notificationsService.getHello();
  }
  
  @EventPattern(USER_EVENTS.REGISTERED)
  userRegistered(@Payload() data: UserRegisteredPayload, @Ctx() context: RmqContext): void {
    this.notificationsService.notifyRegisteredUser(data);
    this.rmqService.ack(context);
    return;
  }
}
