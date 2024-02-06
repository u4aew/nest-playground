import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entity/token.entity';
import { CryptService } from '../crypt/crypt.service';
import { User } from '../user/entity/user.entity';
import { TOKEN_TYPE, TOKEN_VALUE_TYPE } from '../../shared/types';
import { UserService } from '../user/user.service';
import {
  TOKEN_INVALID,
  USER_NOT_FOUND,
  TOKEN_EXPIRATION,
} from '../../shared/const';

const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000;
const TOKEN_GENERATION_LIMIT_TIME = 3 * 60 * 1000;

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private cryptService: CryptService,
    private userService: UserService,
  ) {}

  async generateUserToken(
    data: string,
    user: User,
    type: TOKEN_TYPE,
    valueType: TOKEN_VALUE_TYPE = TOKEN_VALUE_TYPE.HASH,
  ) {
    const lastToken = await this.tokenRepository.findOne({
      where: { user: user, type: type },
      order: { createdAt: 'DESC' },
    });

    if (
      lastToken &&
      new Date().getTime() - lastToken.createdAt.getTime() <
        TOKEN_GENERATION_LIMIT_TIME
    ) {
      throw new BadRequestException('NEW_TOKEN_TIMEOUT');
    }

    if (lastToken) {
      await this.tokenRepository.remove(lastToken);
    }

    let tokenValue;
    if (valueType === TOKEN_VALUE_TYPE.OTP) {
      tokenValue = this.generateOtp();
    } else {
      tokenValue = await this.cryptService.hash(data);
    }
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME);
    const token = new Token();
    token.value = tokenValue;
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
      throw new BadRequestException(TOKEN_INVALID);
    }

    if (token.expiresAt < new Date()) {
      throw new BadRequestException(TOKEN_EXPIRATION);
    }

    return token.user;
  }

  async removeTokenByUser(user: User, type: TOKEN_TYPE) {
    const data = await this.userService.findById(user.id);
    if (!data) throw new NotFoundException(USER_NOT_FOUND);

    const token = await this.tokenRepository.findOne({
      where: { user: data, type },
      relations: ['user'],
    });

    if (token) {
      await this.tokenRepository.remove(token);
    }
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
