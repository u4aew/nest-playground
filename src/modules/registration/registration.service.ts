import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { TokenService } from '../token/token.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { TokenType } from '../token/entity/token.entity';
import { UserService } from '../user/user.service';
import {
  USER_ALREADY_REGISTER,
  EMAILS_TEMPLATE_CONFIG,
  EMAIL_INVALID,
  SEND_EMAILS,
  TOKEN_INVALID,
  USER_NEED_CONFIRM_EMAIL,
  BCRYPT_SALT_ROUNDS,
  SUCCESS,
} from './const';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
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

    const emailConfirmationToken = await this.tokenService.saveUserToken(
      email,
      newUser,
      TokenType.EMAIL_CONFIRMATION,
    );

    return await this.sendEmail(
      newUser,
      EMAILS_TEMPLATE_CONFIG.CONFIRM_EMAIL.SUBJECT,
      EMAILS_TEMPLATE_CONFIG.CONFIRM_EMAIL.TEMPLATE,
      emailConfirmationToken,
    );
  }

  async confirmRegister(token: string): Promise<{ code: string }> {
    const user = await this.tokenService.findUserByToken(
      token,
      TokenType.EMAIL_CONFIRMATION,
    );
    if (!user) {
      throw new BadRequestException(TOKEN_INVALID);
    }
    user.isEmailConfirmed = true;
    await this.tokenService.removeTokenByUser(
      user,
      TokenType.EMAIL_CONFIRMATION,
    );
    await this.userService.save(user);
    return {
      code: SUCCESS,
    };
  }

  async resetPassword(email: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException(EMAIL_INVALID);
    }

    const passwordResetToken = await this.tokenService.saveUserToken(
      email,
      user,
      TokenType.PASSWORD_RESET,
    );

    await this.sendEmail(
      user,
      EMAILS_TEMPLATE_CONFIG.RESET_PASSWORD.SUBJECT,
      EMAILS_TEMPLATE_CONFIG.RESET_PASSWORD.TEMPLATE,
      passwordResetToken,
    );

    return user;
  }

  async confirmResetPassword(value: string, newPassword: string): Promise<any> {
    const user = await this.tokenService.findUserByToken(
      value,
      TokenType.PASSWORD_RESET,
    );
    user.password = await this.hashPassword(newPassword);
    await this.tokenService.removeTokenByUser(user, TokenType.PASSWORD_RESET);
    await this.userService.save(user);
    return true;
  }

  private async sendEmail(
    user: User,
    subject: string,
    template: string,
    token: string,
  ): Promise<void> {
    if (this.configService.get<string>(SEND_EMAILS) === 'true') {
      await this.mailerService.sendMail({
        to: user.email,
        subject,
        template,
        context: { name: user.name, token },
      });
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }
}
