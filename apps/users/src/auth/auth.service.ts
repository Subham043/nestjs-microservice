import { PrismaService } from '@app/commons/prisma/prisma.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ExtendedPrismaClient } from '@app/commons/types';
import { UserSignin, UserSignup } from './auth.schema';
import { UserType } from '../users/user.types';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '@app/commons/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from './events/user-registered.event';
import { USER_EVENTS } from '@app/commons';
import { JwtPayload, Token } from '@app/commons/jwtAuth/auth.types';

@Injectable()
export class AuthService {

  private readonly saltRounds:number = 10;
  private readonly prisma: ExtendedPrismaClient;
  private readonly ommitedFields = {password: true};

  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfigKey: ConfigType<typeof jwtConfig>,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ){
    this.prisma = this.prismaService.$extends({
      result: {
        user: {
          isVerified: {
            needs: { verifiedAt: true },
            compute(user) {
              return user.verifiedAt !== null
            },
          },
        },
      },
    })
  }

  async generateTokens(user: UserType): Promise<Token> {
    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: user.role,
      blocked: user.blocked,
      isVerified: user.verifiedAt !== null
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.jwtConfigKey.secret,
        expiresIn: this.jwtConfigKey.expiry,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.jwtConfigKey.refresh_secret,
        expiresIn: this.jwtConfigKey.refresh_expiry,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signIn(data: UserSignin): Promise<UserType & Token & {isVerified: boolean}> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (user===null)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const isMatch = await bcrypt.compare(data.password, user!.password);

    if (!isMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    const token = await this.generateTokens(user);
    // await this.storeRefreshToken({ email: dto.email }, token.refresh_token);
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id,
      verifiedAt: user.verifiedAt,
      isVerified: user.verifiedAt !== null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      blocked: user.blocked,
      ...token
    };
  }

  async signUp(data: UserSignup): Promise<UserType> {
    const {password, ...rest} = data;
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    const user = await this.prisma.user.create({
      data: {...rest, password: hashedPassword},
      omit: this.ommitedFields
    });
    this.eventEmitter.emit(USER_EVENTS.REGISTERED, new UserRegisteredEvent(user.id, user.name || '', user.email, user.role));
    return user;
  }

  async verifyRMQUser(payload: JwtPayload): Promise<UserType> {
    return await this.prisma.user.findUniqueOrThrow({
      where: {id: payload.id},
      omit: this.ommitedFields
    });
  }
  
}
