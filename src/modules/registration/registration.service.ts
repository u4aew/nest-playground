import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async register(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    const savedUser = await this.userRepository.save(user);

    await this.sendConfirmationEmail(savedUser);

    return savedUser;
  }

  async sendConfirmationEmail(user: User) {
    const token = await bcrypt.hash(user.email, 10); // генерируем токен
    user.emailConfirmationToken = token;
    await this.userRepository.save(user);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Подтверждение почты',
      template: 'confirmation.html', // путь к вашему шаблону письма
      context: {
        name: user.name,
        token,
      },
    });
  }

  async confirmEmail(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { emailConfirmationToken: token },
    });

    if (!user) {
      return null;
    }

    user.isEmailConfirmed = true;
    user.emailConfirmationToken = null;

    return this.userRepository.save(user);
  }
}
