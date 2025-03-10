import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../events/user-registered.event';

@Injectable()
export class UserRegisteredListener {
  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}