import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/commons/prisma/prisma.service';
import { JwtPayload, JwtRefreshPayload } from '../auth.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY as string,
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtRefreshPayload> {
    const refreshToken = req?.get('Authorization')?.replace('Bearer', '').trim();
    try {
      const result = await this.prismaService.user.findFirstOrThrow({
        where: {
          id: payload.id,
        },
        omit: {
          password: true
        }
      });
      return {
        ...result,
        name: result.name || '',
        isVerified: result.verifiedAt !== null,
        refreshToken: refreshToken || '',
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}