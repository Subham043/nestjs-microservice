import { PrismaService } from '@app/commons/prisma/prisma.service';
import { UnauthorizedException, Injectable } from '@nestjs/common';
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
      secretOrKey: process.env.JWT_SECRET_KEY as string,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
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
        isVerified: result.verifiedAt !== null
      };
      
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}