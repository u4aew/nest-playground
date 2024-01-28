import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ResponseDto } from '../../shared/dto/response.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<ResponseDto> {
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.createUser(email, hashedPassword, name);
    await this.sendConfirmationEmail(newUser);
    return { message: 'User registered successfully' };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async createUser(
    email: string,
    hashedPassword: string,
    name: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    return this.userRepository.save(user);
  }

  private async generateEmailConfirmationToken(email: string): Promise<string> {
    return bcrypt.hash(email, 10);
  }

  private async sendConfirmationEmail(user: User) {
    const token = await this.generateEmailConfirmationToken(user.email);
    user.emailConfirmationToken = token;
    await this.userRepository.save(user);

    if (this.configService.get<string>('SEND_EMAILS') === 'true') {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Confirm mail',
        template: 'confirmation',
        context: {
          name: user.name,
          token,
        },
      });
    }
  }

  async requestPasswordReset(email: string): Promise<ResponseDto> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await bcrypt.hash(user.email, 10);
    user.passwordResetToken = token;
    await this.userRepository.save(user);
    if (this.configService.get<string>('SEND_EMAILS') === 'true') {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Reset password',
        template: 'reset',
        context: {
          name: user.name,
          token,
        },
      });
    }

    return { message: 'Password reset email sent' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ResponseDto> {
    const user = await this.userRepository.findOne({
      where: { passwordResetToken: token },
    });
    if (!user) {
      throw new NotFoundException('Invalid token');
    }

    user.password = await this.hashPassword(newPassword);
    user.passwordResetToken = null;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async confirmEmail(token: string): Promise<ResponseDto> {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    const user = await this.findUserByConfirmationToken(token);
    await this.markEmailAsConfirmed(user);
    return { message: 'Email confirmed successfully' };
  }

  private async findUserByConfirmationToken(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { emailConfirmationToken: token },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async markEmailAsConfirmed(user: User): Promise<User> {
    user.isEmailConfirmed = true;
    user.emailConfirmationToken = null;
    return this.userRepository.save(user);
  }
}
