import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { Auth2Dto } from '../auth2/auth2.dto';
import { findUserByNameDto, UserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //1
  async findUserByName({
    username,
  }: findUserByNameDto): Promise<UserDto | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });
    return user ?? null;
  }
  //2
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('Пользователь с таким id не наиден');
    return user;
  }

  async create(createData: Auth2Dto) {
    const user = {
      username: createData.username,
      password: await hash(createData.password),
    };
    const newUser = this.prisma.user.create({ data: user });
    if (!newUser)
      throw new InternalServerErrorException(
        'Ошибка сервера при создании пользователя',
      );
    return newUser;
  }
}
