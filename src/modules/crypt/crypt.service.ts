import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class CryptService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }
}
