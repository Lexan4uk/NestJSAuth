import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthInputDto {
  @ApiProperty({ example: 'user123', description: 'Имя пользователя' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsString()
  password: string;
}
export class SignInDataDto {
  @ApiProperty({ example: 'user123', description: 'Имя пользователя' })
  username: string;

  @ApiProperty({ example: 'ssdadsdas', description: 'ID пользователя' })
  id: string;
}
export class AuthResultDto {
  @ApiProperty({ example: 'adsadsadsa', description: 'Токен доступа' })
  accessToken: string;
}
