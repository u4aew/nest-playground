import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationService } from './registration.service';
import { TokenService } from '../token/token.service';
import { Token } from '../token/entity/token.entity';
import { RegistrationController } from './registration.controller';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  providers: [RegistrationService, TokenService],
  controllers: [RegistrationController],
})
export class RegistrationModule {}
