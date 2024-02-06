import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service'; // Импорт UserService
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../jwt/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptService } from '../crypt/crypt.service';
import { jwtConfig } from '../../config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  providers: [AuthService, JwtStrategy, UserService, CryptService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
