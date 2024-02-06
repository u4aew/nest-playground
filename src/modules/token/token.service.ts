import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entity/token.entity';
import { User } from '../user/entity/user.entity';
import { TOKEN_TYPE } from '../../shared/types';
import * as bcrypt from 'bcrypt';
const BCRYPT_SALT_ROUNDS = 10;
const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000;

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async generateUserToken(data: string, user: User, type: TOKEN_TYPE) {
    const hashedData = await bcrypt.hash(data, BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME);
    const token = new Token();
    token.value = hashedData;
    token.type = type;
    token.user = user;
    token.expiresAt = expiresAt;

    await this.tokenRepository.save(token);
    return token.value;
  }

  async findUserByToken(
    tokenValue: string,
    tokenType: TOKEN_TYPE,
  ): Promise<User> {
    const token = await this.tokenRepository.findOne({
      where: { value: tokenValue, type: tokenType },
    });

    if (!token) {
      throw new BadRequestException('TOKEN_INVALID');
    }

    if (token.expiresAt < new Date()) {
      throw new BadRequestException('TOKEN_EXPIRED');
    }

    return token.user;
  }

  async findTokenByUser(user: User, type: TOKEN_TYPE) {
    const data = await this.tokenRepository.findOne({
      where: { user, type },
      relations: ['user'],
    });

    if (!data) throw new NotFoundException(`Token not found for user`);
    return data;
  }

  async removeTokenByUser(user: User, type: TOKEN_TYPE) {
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
