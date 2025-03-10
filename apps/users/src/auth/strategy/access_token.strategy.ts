import { PrismaService } from '@app/commons/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET_KEY || 'secretKey',
    });
  }

  validate(payload: JwtPayload) {
    const result = this.prismaService.user.findFirst({
      where: {
        id: payload.id,
      },
    });
    if (!result) throw new ForbiddenException('Access token malformed');
    return payload;
  }
}