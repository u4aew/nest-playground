import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserInfo } from './types';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateInfo(
    id: number,
    newName: string,
    locale?: string,
  ): Promise<UserInfo> {
    const user = await this.findById(id);
    user.name = newName;

    if (locale) {
      user.locale = locale;
    }
    await this.userRepository.save(user);

    return { name: user.name, locale: user.locale, email: user.email };
  }

  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isOldPasswordValid = await this.validatePassword(user, oldPassword);

    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10); // use your salt rounds

    await this.userRepository.save(user);
  }

  async requestEmailUpdate(userId: number, newEmail: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    // генерируем OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // сохраняем OTP и новую почту в базе данных

    await this.userRepository.save(user);

    // отправляем OTP на старую почту пользователя
    await this.sendEmail(
      user,
      'Подтвердите новый адрес электронной почты',
      'change-email_ru',
      otp,
    );
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.validatePassword(password);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(email, hashedPassword, name): Promise<User> {
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    await this.save(newUser);
    return newUser;
  }

  async save(user) {
    await this.userRepository.save(user);
  }

  private async sendEmail(
    user: User,
    subject: string,
    template: string,
    otp: string,
  ): Promise<void> {
    if (this.configService.get<string>('SEND_EMAILS') === 'true') {
      await this.mailerService.sendMail({
        to: user.email,
        subject,
        template,
        context: { name: user.name, otp },
      });
    }
  }
}
