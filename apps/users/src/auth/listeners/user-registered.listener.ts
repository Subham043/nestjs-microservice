import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { QUEUE_USER } from '@app/commons';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserRegisteredListener {
  constructor(
    @Inject(QUEUE_USER.NOTIFICATION) private notificationClient: ClientProxy,
  ) {}

  @OnEvent('user.registered')
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log('user_event: ', event);
    await lastValueFrom(
      this.notificationClient.emit('user.registered', {
        ...event
      }),
    );
  }
}