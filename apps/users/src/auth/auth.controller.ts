import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignin, userSigninValidator, UserSignup, userSignupValidator } from './auth.schema';
import { UserType } from '../users/user.types';
import { Throttle } from '@nestjs/throttler';
import { Ctx, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { AUTH_EVENTS, RabbitMQService } from '@app/commons';
import { JwtPayload } from '@app/commons/jwtAuth/auth.types';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RabbitMQService,
  ) {}

  @Post('/signin')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async signin(
    @Body() userDTO: UserSignin,
  ): Promise<UserType> 
  {
    const validate = await userSigninValidator.validate(userDTO)
    const user = await this.authService.signIn(validate);
    return user;
  }
  
  @Post('/signup')
  @Throttle({ default: { limit: 3, ttl: 1000 } })
  async signUp(
    @Body() userDTO: UserSignup,
  ): Promise<UserType> 
  {
    const validate = await userSignupValidator.validate(userDTO)
    const user = await this.authService.signUp(validate);
    return user;
  }

  @MessagePattern(AUTH_EVENTS.VERIFY_USER)
  async verifyUser(@Payload() payload: JwtPayload, @Ctx() context: RmqContext): Promise<UserType> {
    try {
      const user = await this.authService.verifyRMQUser(payload);
      return user;
    } catch (error) {
      throw new RpcException(error);
    } finally {
      this.rmqService.ack(context);
    }
  }
}
