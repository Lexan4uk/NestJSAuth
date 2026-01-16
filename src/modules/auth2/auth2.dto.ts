import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Auth2Dto {
  @ApiProperty({ example: 'user123', description: 'Имя пользователя' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsString()
  password: string;
}
