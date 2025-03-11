import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from '../config/jwt.config';
import { AccessTokenStrategy } from './strategy/access_token.strategy';
import { RefreshTokenStrategy } from './strategy/refresh_token.strategy';


@Module({
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [],
})
export class JwtAuthModule {
  static register(): DynamicModule {
    return {
      module: JwtAuthModule,
      imports: [
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
    };
  }
}