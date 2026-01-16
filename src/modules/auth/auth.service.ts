import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthInputDto, AuthResultDto, SignInDataDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(input: AuthInputDto): Promise<SignInDataDto> {
    const user = await this.usersService.findUserByName({
      username: input.username,
    });

    if (!user || user.password !== input.password) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return {
      id: user.id,
      username: user.username,
    };
  }

  async login(input: AuthInputDto): Promise<AuthResultDto> {
    const user = await this.validateUser(input);
    const tokenPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken: accessToken,
    };
  }
}
