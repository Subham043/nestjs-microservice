import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreate, userCreateValidator } from './user.schema';
import { Throttle } from '@nestjs/throttler';

@Controller({
  version: '1',
  path: 'users',
})
@Throttle({ default: { limit: 3, ttl: 60000 } })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  getHello(): string {
    return this.usersService.getHello();
  }

  @Post('/create')
  async create(
    @Body() userDTO: UserCreate,
  ) {
    const validate = await userCreateValidator.validate(userDTO)
    return validate;
  }
}
