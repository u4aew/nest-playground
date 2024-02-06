import { Module } from '@nestjs/common';
import { Token } from './entity/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { CryptService } from '../crypt/crypt.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token, User])],
  controllers: [],
  providers: [TokenService, CryptService, UserService],
})
export class TokenModule {}
