import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/entity/user.entity';
import { SEND_EMAILS } from '../registration/const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly shouldSendEmails: boolean;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.shouldSendEmails =
      this.configService.get<string>(SEND_EMAILS) === 'true';
  }

  private async sendEmail(
    user: User,
    token: string,
    emailType: 'confirmation' | 'reset',
  ): Promise<void> {
    if (!this.shouldSendEmails) return;

    const subjectMap = {
      confirmation: 'Confirm Your Registration',
      reset: 'Reset Your Password',
    };

    const template = `${emailType}_${(user.locale || 'en').toLowerCase()}`;
    const subject = subjectMap[emailType];

    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: template,
      context: { name: user.name, token },
    });
  }

  async sendRegisterTokenEmail(user: User, token: string): Promise<void> {
    await this.sendEmail(user, token, 'confirmation');
  }

  async sendResetPasswordToken(user: User, token: string): Promise<void> {
    await this.sendEmail(user, token, 'reset');
  }
}
