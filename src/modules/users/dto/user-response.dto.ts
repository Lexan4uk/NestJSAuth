import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Имя пользователя',
  })
  username: string;
}

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Данные текущего пользователя',
    type: () => UserResponseDto,
    examples: {
      default: {
        value: {
          name: 'john123',
        },
      },
    },
  })
  user: UserResponseDto;
}
