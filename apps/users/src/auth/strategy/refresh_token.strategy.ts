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
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken =
            request?.cookies['auth._refresh_token.local']
              ?.replace('Bearer', '')
              .trim() ||
            request?.get('Authorization')?.replace('Bearer', '').trim();
          return refreshToken;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY || 'secretKey',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any): JwtRefreshPayload {
    const refreshToken =
      req?.cookies['auth._refresh_token.local']?.replace('Bearer', '').trim() ||
      req?.get('Authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    const result = this.prismaService.user.findFirst({
      where: {
        id: payload.id,
      },
    });
    if (!result) throw new ForbiddenException('Refresh token malformed');
    return {
      ...payload,
      refreshToken,
    };
  }
}