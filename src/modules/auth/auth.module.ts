import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'prisma/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: env('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
