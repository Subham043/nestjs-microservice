import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from '../config/jwt.config';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { QUEUE_USER } from '../rabbitmq/rabbitmq.queue';
import { RMQAccessTokenStrategy } from './strategy/rmq_access_token.strategy';


@Module({})
export class JwtAuthRMQModule {
  static register(): DynamicModule {
    return {
      module: JwtAuthRMQModule,
      imports: [
        RabbitMQModule.register({ name: QUEUE_USER.AUTH }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [jwtConfig.KEY],
            useFactory: (config: ConfigType<typeof jwtConfig>) => ({
            secret: config.secret,
            signOptions: { expiresIn: config.expiry },
            })
        }),
      ],
      exports: [PassportModule, JwtModule],
      providers: [
        RMQAccessTokenStrategy
      ],
    };
  }
}