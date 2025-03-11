import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserNotificationsService } from './users.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RMQAccessTokenGuard, RabbitMQService, USER_EVENTS } from '@app/commons';
import { UserRegisteredPayload } from './user_notification.types';

@Controller({
  version: '1',
  path: 'notifications',
})
export class UserNotificationsController {
  constructor(
    private readonly notificationsService: UserNotificationsService,
    private readonly rmqService: RabbitMQService,
  ) {}

  @Get('/')
  @UseGuards(RMQAccessTokenGuard)
  getHello(): string {
    return this.notificationsService.getHello();
  }
  
  @EventPattern(USER_EVENTS.REGISTERED)
  userRegistered(@Payload() payload: UserRegisteredPayload, @Ctx() context: RmqContext): void {
    this.notificationsService.notifyRegisteredUser(payload);
    this.rmqService.ack(context);
    return;
  }
}
