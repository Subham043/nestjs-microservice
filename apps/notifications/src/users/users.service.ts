import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserRegisteredPayload } from './user_notification.types';

@Injectable()
export class UserNotificationsService {
  constructor(private readonly mailerService: MailerService) {}

  getHello(): string {
    return 'Hello Notifications!';
  }
  
  notifyRegisteredUser(data: UserRegisteredPayload): void {
    this.mailerService
      .sendMail({
        to: data.email, // list of receivers
        subject: 'Registration Completed', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });
    return;
  }
}
