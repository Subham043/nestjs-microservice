import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailerService: MailerService) {}

  getHello(): string {
    this.mailerService
      .sendMail({
        to: 'subham.backup043@gmail.com', // list of receivers
        from: 'no-reply@parcelcounter.in', // sender address
        subject: 'Testing Nest MailerModule', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {})
      .catch((e) => {
        console.log(e);
      });
    return 'Hello World!';
  }
}
