import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { TokenService } from '../token/token.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { TokenType } from '../token/entity/token.entity';

const EMAILS_TEMPLATE_CONFIG = {
  CONFIRM_EMAIL: {
    SUBJECT: 'Confirm mail',
    TEMPLATE: 'confirmation_ru',
  },
  RESET_PASSWORD: {
    SUBJECT: 'Reset password',
    TEMPLATE: 'reset_ru',
  },
};
const BCRYPT_SALT_ROUNDS = 10;
const SEND_EMAILS = 'SEND_EMAILS';
const EMAIL_INVALID = 'EMAIL_INVALID';
const TOKEN_INVALID = 'TOKEN_INVALID';
const USER_ALREADY_REGISTER = 'USER_ALREADY_REGISTER';
const USER_NEED_CONFIRM_EMAIL = 'USER_NEED_CONFIRM_EMAIL';
const SUCCESS = 'SUCCESS';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async register(email: string, password: string, name: string): Promise<any> {
    const hashedPassword = await this.hashPassword(password);

    const user = await this.findUserByEmail(email);

    if (user) {
      if (user.isEmailConfirmed) {
        throw new BadRequestException(USER_ALREADY_REGISTER);
      } else {
        throw new BadRequestException(USER_NEED_CONFIRM_EMAIL);
      }
    }

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    await this.userRepository.save(newUser);

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

  async requestResetPassword(email: string): Promise<User> {
    const user = await this.findUserByEmail(email);

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
    await this.userRepository.save(user);
    return true;
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
    await this.userRepository.save(user);
    return {
      code: SUCCESS,
    };
  }

  private async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
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
