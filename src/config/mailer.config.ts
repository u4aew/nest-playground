import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

export const mailerConfig = (configService: ConfigService) => ({
  transport: {
    host: configService.get<string>('MAIL_HOST'),
    secure: false,
    port: configService.get<number>('MAIL_PORT'),
    auth: {
      user: configService.get<string>('MAIL_USER'),
      pass: configService.get<string>('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: configService.get<string>('MAIL_FROM'),
  },
  template: {
    dir: path.join(__dirname, '..', 'templates'),
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
});
