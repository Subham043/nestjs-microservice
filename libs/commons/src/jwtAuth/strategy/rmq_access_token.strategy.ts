import { UnauthorizedException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.types';
import { QUEUE_USER } from '@app/commons/rabbitmq/rabbitmq.queue';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, tap } from 'rxjs';
import { AUTH_EVENTS } from '@app/commons/rabbitmq/rabbitmq.events';

@Injectable()
export class RMQAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(QUEUE_USER.AUTH) private authClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY as string,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const result = await lastValueFrom(this.authClient
        .send<JwtPayload>(AUTH_EVENTS.VERIFY_USER, {...payload}))
      return result;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}