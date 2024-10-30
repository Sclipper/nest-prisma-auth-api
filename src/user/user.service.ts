import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { handleDatabaseOperation } from 'src/prisma/prisma.utils';
import { User } from './dto/create-user.request';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    includeSensitiveInfo = false,
  ): Promise<User | null> {
    return handleDatabaseOperation(async () => {
      const user = await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });
      if (includeSensitiveInfo) {
        return user;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, refresh_token: __, ...result } = user;
      return result;
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return handleDatabaseOperation(async () => {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    }, 'Error retrieving users');
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return handleDatabaseOperation(async () => {
      return await this.prisma.user.create({
        data: {
          ...data,
          password: await hash(data.password, 10),
        },
      });
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput; // Unique identifier for the user
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
