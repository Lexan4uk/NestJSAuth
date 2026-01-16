import { IsString } from 'class-validator';
//1
export class UserDto {
  id: string;
  username: string;
  password: string;
}
export class findUserByNameDto {
  @IsString()
  username: string;
}
//2
