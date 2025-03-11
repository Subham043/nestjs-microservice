import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { notificationAppConfigValidator, RabbitMQModule } from '@app/commons';
import { UserNotificationsModule } from './users/users.module';
import notificationAppConfig from '@app/commons/config/notificationApp.config';
import mailConfig from '@app/commons/config/mail.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';
import rabbitMQConfig from '@app/commons/config/rabbitMQ.config';
import jwtConfig from '@app/commons/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      expandVariables: true,
      load: [notificationAppConfig, mailConfig, rabbitMQConfig, jwtConfig],
      isGlobal: true,
      cache: false,
      validationSchema: notificationAppConfigValidator
    }),
    MailerModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [mailConfig.KEY],
        useFactory: (config: ConfigType<typeof mailConfig>) => ({
          transport: {
            host: config.mail_host,
            port: Number(config.mail_port),
            tls: {
              rejectUnauthorized: false,
            },
            secure: false,
            auth: {
              user: config.mail_user,
              pass: config.mail_password,
            },
          },
          defaults: {
            from: '"No Reply - ParcelCounter" <no-reply@parcelcounter.in>',
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new PugAdapter({
              inlineCssEnabled: false,
            }), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        })
      }
    ),
    RabbitMQModule,
    UserNotificationsModule,
  ],
})
export class NotificationsAppModule {}
