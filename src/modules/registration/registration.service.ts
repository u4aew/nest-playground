import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { TokenService } from '../token/token.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { TOKEN_TYPE } from '../../shared/types';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import {
  USER_ALREADY_REGISTER,
  EMAIL_INVALID,
  TOKEN_INVALID,
  USER_NEED_CONFIRM_EMAIL,
  BCRYPT_SALT_ROUNDS,
  SUCCESS,
} from './const';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async register(email: string, password: string, name: string): Promise<any> {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      if (user.isEmailConfirmed) {
        throw new BadRequestException(USER_ALREADY_REGISTER);
      } else {
        throw new BadRequestException(USER_NEED_CONFIRM_EMAIL);
      }
    }

    const newUser = await this.userService.create(email, hashedPassword, name);

    const token = await this.tokenService.saveUserToken(
      email,
      newUser,
      TOKEN_TYPE.EMAIL_CONFIRMATION,
    );

    return await this.mailService.sendRegisterTokenEmail(user, token);
  }

  async confirmRegister(token: string): Promise<{ code: string }> {
    const user = await this.tokenService.findUserByToken(
      token,
      TOKEN_TYPE.EMAIL_CONFIRMATION,
    );
    if (!user) {
      throw new BadRequestException(TOKEN_INVALID);
    }
    user.isEmailConfirmed = true;
    await this.tokenService.removeTokenByUser(
      user,
      TOKEN_TYPE.EMAIL_CONFIRMATION,
    );
    await this.userService.save(user);
    return {
      code: SUCCESS,
    };
  }

  async resetPassword(email: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException(EMAIL_INVALID);
    }

    const token = await this.tokenService.saveUserToken(
      email,
      user,
      TOKEN_TYPE.PASSWORD_RESET,
    );

    return await this.mailService.sendResetPasswordToken(user, token);
  }

  async confirmResetPassword(value: string, newPassword: string): Promise<any> {
    const user = await this.tokenService.findUserByToken(
      value,
      TOKEN_TYPE.PASSWORD_RESET,
    );
    user.password = await this.hashPassword(newPassword);
    await this.tokenService.removeTokenByUser(user, TOKEN_TYPE.PASSWORD_RESET);
    await this.userService.save(user);
    return true;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }
}
