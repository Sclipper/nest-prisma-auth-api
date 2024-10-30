import { User as UserWithPasswordAndRefreshToken } from '@prisma/client';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserRequest {
  name: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
}

export type User = Omit<
  UserWithPasswordAndRefreshToken,
  'password' | 'refresh_token'
> &
  Partial<Pick<UserWithPasswordAndRefreshToken, 'password' | 'refresh_token'>>;

export type UserWithSensitiveData = UserWithPasswordAndRefreshToken;
