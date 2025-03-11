import { Module } from '@nestjs/common';
import { UserNotificationsController } from './users.controller';
import { UserNotificationsService } from './users.service';
import { JwtAuthRMQModule, RabbitMQService } from '@app/commons';

@Module({
  imports: [
    JwtAuthRMQModule.register(),
  ],
  controllers: [UserNotificationsController],
  providers: [UserNotificationsService, RabbitMQService],
})
export class UserNotificationsModule {}
