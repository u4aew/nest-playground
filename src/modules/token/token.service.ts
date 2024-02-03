import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token, TokenType } from './entity/token.entity';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async saveUserToken(data: string, user: User, type: TokenType) {
    const hashedData = await bcrypt.hash(data, BCRYPT_SALT_ROUNDS);

    const token = new Token();
    token.value = hashedData;
    token.type = type;
    token.user = user;

    await this.tokenRepository.save(token);
    return token.value;
  }

  async findUserByToken(value: string, type: TokenType) {
    const data = await this.tokenRepository.findOne({
      where: { type, value },
      relations: ['user'],
    });
    if (!data)
      throw new NotFoundException(`User not found for token: ${value}`);
    return data.user;
  }

  async findTokenByUser(user: User, type: TokenType) {
    const data = await this.tokenRepository.findOne({
      where: { user, type },
      relations: ['user'],
    });

    if (!data) throw new NotFoundException(`Token not found for user`);
    return data;
  }

  async removeTokenByUser(user: User, type: TokenType) {
    const data = await this.userRepository.findOne({ where: { id: user.id } });
    if (!data) throw new NotFoundException(`User not found for ID: ${user.id}`);

    const token = await this.tokenRepository.findOne({
      where: { user: data, type },
      relations: ['user'],
    });

    if (token) {
      await this.tokenRepository.remove(token);
    }
  }
}
