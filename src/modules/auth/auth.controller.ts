import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthInputDto, AuthResultDto } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('auth1')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @ApiBody({ type: AuthInputDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() input: AuthInputDto): Promise<AuthResultDto> {
    const result = await this.authService.login(input);
    return result;
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() request) {
    return request.user;
  }
}
