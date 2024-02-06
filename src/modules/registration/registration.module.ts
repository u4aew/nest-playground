import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationService } from './registration.service';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { CryptService } from '../crypt/crypt.service';
import { Token } from '../token/entity/token.entity';
import { User } from '../user/entity/user.entity';
import { RegistrationController } from './registration.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  providers: [
    RegistrationService,
    TokenService,
    UserService,
    MailService,
    CryptService,
  ],
  controllers: [RegistrationController],
})
export class RegistrationModule {}
