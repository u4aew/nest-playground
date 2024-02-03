import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { TokenService } from '../token/token.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { TokenType } from '../token/entity/token.entity';

const emailsTemplateConfig = {
  confirmEmail: {
    subject: 'Confirm mail',
    template: 'confirmation_ru',
  },
  resetPassword: {
    subject: 'Reset password',
    template: 'reset_ru',
  },
};
const BCRYPT_SALT_ROUNDS = 10;

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
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      if (user.isEmailConfirmed) {
        throw new BadRequestException('USER_ALREADY_REGISTER');
      } else {
        throw new BadRequestException('USER_NEED_CONFIRM_EMAIL');
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
      emailsTemplateConfig.confirmEmail.subject,
      emailsTemplateConfig.confirmEmail.template,
      emailConfirmationToken,
    );
  }

  async requestPasswordReset(email: string): Promise<User> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('Email invalid');
    }

    const passwordResetToken = await this.tokenService.saveUserToken(
      email,
      user,
      TokenType.PASSWORD_RESET,
    );

    await this.sendEmail(
      user,
      emailsTemplateConfig.resetPassword.subject,
      emailsTemplateConfig.resetPassword.template,
      passwordResetToken,
    );

    return user;
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const user = await this.tokenService.findUserByToken(
      token,
      TokenType.PASSWORD_RESET,
    );
    user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await this.tokenService.removeTokenByUser(user, TokenType.PASSWORD_RESET);
    await this.userRepository.save(user);
    return true;
  }

  async confirmEmail(token: string): Promise<{ code: string }> {
    const user = await this.tokenService.findUserByToken(
      token,
      TokenType.EMAIL_CONFIRMATION,
    );
    if (!user) {
      throw new BadRequestException('Token invalid');
    }
    user.isEmailConfirmed = true;
    await this.tokenService.removeTokenByUser(
      user,
      TokenType.EMAIL_CONFIRMATION,
    );
    await this.userRepository.save(user);
    return {
      code: 'SUCCESS',
    };
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async sendEmail(
    user: User,
    subject: string,
    template: string,
    token: string,
  ): Promise<void> {
    if (this.configService.get<string>('SEND_EMAILS') === 'true') {
      await this.mailerService.sendMail({
        to: user.email,
        subject,
        template,
        context: { name: user.name, token },
      });
    }
  }
}
