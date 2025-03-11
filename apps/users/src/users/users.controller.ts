import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreate, userCreateValidator } from './user.schema';
import { UserType } from './user.types';
import { PaginatedResult } from '@app/commons/types';
import { AccessTokenGuard, ValidQueryPaginatePipe } from '@app/commons';
import { ValidParamIdPipe } from '@app/commons/pipes/valid_param_id.pipes';

@Controller({
  version: '1',
  path: 'users',
})
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async paginateUsers(
    @Query('skip', ValidQueryPaginatePipe) skip: number|undefined,
    @Query('take', ValidQueryPaginatePipe) take: number|undefined,
  ): Promise<PaginatedResult<UserType>> {
    return await this.usersService.paginateUsers({skip, take});
  }

  @Post('/')
  async createUser(
    @Body() userDTO: UserCreate,
  ): Promise<UserType> 
  {
    const validate = await userCreateValidator.validate(userDTO)
    const user = await this.usersService.createUser(validate);
    return user;
  }

  @Get(':id')
  async getUser(@Param('id', ValidParamIdPipe) id: number): Promise<UserType> {
    try {
      return await this.usersService.getUserById(id);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id', ValidParamIdPipe) id: number): Promise<UserType> {
    return await this.usersService.deleteUserById(id);
  }
}
