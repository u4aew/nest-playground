import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

export const mailerConfig = {
  transport: {
    host: 'smtp.office365.com',
    secure: false,
    port: 587,
    auth: {
      user: 'crudtestappnest123@outlook.com',
      pass: '550dON6e6ROu',
    },
  },
  defaults: {
    from: '"Test app" crudtestappnest123@outlook.com',
  },
  template: {
    dir: __dirname + '/templates',
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
};
