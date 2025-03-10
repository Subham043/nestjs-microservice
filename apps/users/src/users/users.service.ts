import { PrismaService } from '@app/commons/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserCreate } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { UserType } from './user.types';
import { ExtendedPrismaClient, PaginatedResult, PaginationParams } from '@app/commons/types';

@Injectable()
export class UsersService {

  private readonly saltRounds:number = 10;
  private readonly prisma: ExtendedPrismaClient;
  private readonly ommitedFields = {password: true};

  constructor(
    private prismaService: PrismaService
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

  async createUser(data: UserCreate): Promise<UserType> {
    const {password, ...rest} = data;
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return await this.prisma.user.create({
      data: {...rest, password: hashedPassword},
      omit: this.ommitedFields
    });
  }
  
  async paginateUsers({skip=0, take=10}: PaginationParams): Promise<PaginatedResult<UserType>> {
    const data = await this.prisma.user.findMany({
      skip,
      take,
      omit: this.ommitedFields,
      orderBy: {
        id: 'desc',
      },
    });
    const count = await this.prisma.user.count();
    return {data, count};
  }
  
  async getUserById(id: number): Promise<UserType> {
    return await this.prisma.user.findUniqueOrThrow({
      where: {id},
      omit: this.ommitedFields
    });
  }
  
  async deleteUserById(id: number): Promise<UserType> {
    return await this.prisma.user.delete({
      where: {id},
      omit: this.ommitedFields
    });
  }
}
