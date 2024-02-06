import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class CryptService {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, BCRYPT_SALT_ROUNDS);
  }
  async validate() {}

  async compare(value1, value2) {
    return bcrypt.compare(value1, value2);
  }
}
