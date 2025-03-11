import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRegisteredListener } from './listeners/user-registered.listener';
import { JwtAuthModule, QUEUE_USER, RabbitMQModule } from '@app/commons';

@Module({
  imports: [
    JwtAuthModule.register(),
    RabbitMQModule.register({ name: QUEUE_USER.NOTIFICATION }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRegisteredListener,
  ],
})
export class AuthModule {}
