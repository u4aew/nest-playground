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

const BCRYPT_SALT_ROUNDS = 10;

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
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const emailConfirmationToken = await this.generateToken(email);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      emailConfirmationToken,
    });
    await this.userRepository.save(newUser);
    await this.sendEmail(
      newUser,
      'Confirm mail',
      'confirmation',
      emailConfirmationToken,
    );
    return { message: 'User registered successfully' };
  }

  async requestPasswordReset(email: string): Promise<ResponseDto> {
    const user = await this.findUserByEmail(email);
    const token = await this.generateToken(user.email);
    user.passwordResetToken = token;
    await this.userRepository.save(user);
    await this.sendEmail(user, 'Reset password', 'reset', token);
    return { message: 'Password reset email sent' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ResponseDto> {
    const user = await this.findUserByToken(token, 'passwordResetToken');
    user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    user.passwordResetToken = null;
    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  }

  async confirmEmail(token: string): Promise<ResponseDto> {
    if (!token) throw new BadRequestException('Token is required');
    const user = await this.findUserByToken(token, 'emailConfirmationToken');
    user.isEmailConfirmed = true;
    user.emailConfirmationToken = null;
    await this.userRepository.save(user);
    return { message: 'Email confirmed successfully' };
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async findUserByToken(
    token: string,
    tokenField: keyof User,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { [tokenField]: token },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async generateToken(data: string): Promise<string> {
    return bcrypt.hash(data, BCRYPT_SALT_ROUNDS);
  }

  private async sendEmail(
    user: User,
    subject: string,
    template: string,
    token: string,
  ) {
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
