import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { Auth2Module } from './modules/auth2/auth2.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, Auth2Module],
})
export class AppModule {}
