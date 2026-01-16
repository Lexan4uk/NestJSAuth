import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Auth2Dto } from './auth2.dto';
import { Auth2Service } from './auth2.service';

@ApiTags('auth2')
@Controller('auth2')
export class Auth2Controller {
  constructor(private auth2Service: Auth2Service) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: Auth2Dto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.auth2Service.login(dto);
    this.auth2Service.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() dto: Auth2Dto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.auth2Service.register(dto);

    this.auth2Service.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.auth2Service.REFRESH_TOKEN_NAME];
    if (!refreshTokenFromCookies) {
      this.auth2Service.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token не прошёл');
    }
    const { refreshToken, ...response } = await this.auth2Service.getNewTokens(
      refreshTokenFromCookies,
    );
    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.auth2Service.removeRefreshTokenFromResponse(res);

    return true;
  }
}
