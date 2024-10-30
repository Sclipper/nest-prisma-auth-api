import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { Response } from 'express';
import { User } from 'src/user/dto/create-user.request';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      // Find user by email
      const user = await this.userService.user({ email });

      // Handle case if user is not found
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Compare password
      const authenticated = await compare(password, user.password);

      // Handle case if password does not match
      if (!authenticated) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // If successful, return user (omit password field from response)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return user;
    } catch (error) {
      // Log unexpected error (optional for debugging purposes)
      console.error('Unexpected error during validation:', error);

      // Throw UnauthorizedException with a generic message
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async login(user: User, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getMilliseconds() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getMilliseconds() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id.toString(),
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    await this.userService.updateUser({
      where: { id: user.id },
      data: {
        refresh_token: await hash(refreshToken, 10),
      },
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });
  }

  async verifyUserRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<User | null> {
    // Find user by ID
    const user = await this.userService.user({ id: userId });

    // Handle case if user is not found
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Compare refresh tokens
    const authenticated = await compare(refreshToken, user.refresh_token);

    // Handle case if refresh token does not match
    if (!authenticated) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Return the user if everything is valid
    return user;
  }
}
