import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth2/decorators/auth.decorator';
import { CurrentUser } from '../auth2/decorators/user.decorator';
import { ProfileResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

//ИСКЛЮЧИТЕЛЬНО для auth2
@Auth()
@Controller('user/profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async profile(@CurrentUser('id') id: string): Promise<ProfileResponseDto> {
    const user = await this.usersService.getProfile(id);

    return {
      user,
    };
  }
}
