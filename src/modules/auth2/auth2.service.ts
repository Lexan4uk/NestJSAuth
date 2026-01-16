import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { env } from 'prisma/config';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from '../users/users.service';
import { Auth2Dto } from './auth2.dto';

@Injectable()
export class Auth2Service {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private issueTokens(userId: string, username: string) {
    const accessPayload = { id: userId, username: username };
    const refreshPayload = { id: userId };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(input: Auth2Dto) {
    const user = await this.usersService.findUserByName({
      username: input.username,
    });
    if (!user) throw new UnauthorizedException('Пользователь не наиден');

    const isValid = await verify(user.password, input.password);

    if (!isValid) throw new UnauthorizedException('Неверный пароль');

    return {
      id: user.id,
      username: user.username,
    };
  }
  async login(loginData: Auth2Dto) {
    const user = await this.validateUser(loginData);

    const tokens = this.issueTokens(user.id, user.username);
    return {
      user,
      ...tokens,
    };
  }

  async register(loginData: Auth2Dto) {
    const userExists = await this.usersService.findUserByName({
      username: loginData.username,
    });
    if (userExists)
      throw new ConflictException(
        'Пользователь с таким же логином уже существует',
      );

    const newUser = await this.usersService.create(loginData);

    const tokens = this.issueTokens(newUser.id, newUser.username);
    return {
      newUser,
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Невалидный refresh token');

    const { password, ...user } = await this.usersService.getUserById(
      result.id,
    );
    const tokens = this.issueTokens(user.id, user.username);
    return {
      user,
      ...tokens,
    };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: env('COOKIES_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: env('COOKIES_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}
