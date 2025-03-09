import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreate, userCreateValidator } from './user.schema';

@Controller('users')
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
