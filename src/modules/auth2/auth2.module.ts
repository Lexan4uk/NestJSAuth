import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../config/jwt.config';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { Auth2Controller } from './auth2.controller';
import { Auth2Service } from './auth2.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [Auth2Service, JwtStrategy],
  controllers: [Auth2Controller],
  imports: [
    UsersModule,
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
})
export class Auth2Module {}
