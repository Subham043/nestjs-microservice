import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/commons/prisma/prisma.service';
import { JwtRefreshPayload } from '../auth.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY as string,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any): JwtRefreshPayload {
    const result = this.prismaService.user.findFirst({
      where: {
        id: payload.id,
      },
    });
    if (!result) throw new ForbiddenException('Unauthorized');
    return payload;
  }
}