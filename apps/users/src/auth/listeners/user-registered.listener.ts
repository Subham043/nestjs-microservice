import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { QUEUE_USER, USER_EVENTS } from '@app/commons';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserRegisteredListener {
  constructor(
    @Inject(QUEUE_USER.NOTIFICATION) private notificationClient: ClientProxy,
  ) {}

  @OnEvent(USER_EVENTS.REGISTERED)
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    await lastValueFrom(
      this.notificationClient.emit(USER_EVENTS.REGISTERED, {
        ...event
      }),
    );
  }
}