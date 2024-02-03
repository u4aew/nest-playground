import { Module } from '@nestjs/common';
import { Token } from './entity/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token, User])],
  controllers: [],
  providers: [TokenService],
})
export class TokenModule {}
