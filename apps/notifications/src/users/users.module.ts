import { Module } from '@nestjs/common';
import { UserNotificationsController } from './users.controller';
import { UserNotificationsService } from './users.service';
import { RabbitMQModule } from '@app/commons';

@Module({
  imports: [RabbitMQModule],
  controllers: [UserNotificationsController],
  providers: [UserNotificationsService],
})
export class UserNotificationsModule {}
