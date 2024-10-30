import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from '@prisma/client';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: User) {
    console.log('user', user);
    return this.userService.user({ id: 'cm2u6oy3000005tl7f30gxycl' });
  }

  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    await this.userService.createUser(request);
  }
}
