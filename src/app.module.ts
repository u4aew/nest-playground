import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres', // тип базы данных
      host: 'postgres', // хост, используйте 'postgres' если запускаете через Docker Compose
      // host: 'localhost', // хост, используйте 'postgres' если запускаете через Docker Compose
      port: 5432, // порт, по умолчанию для PostgreSQL
      username: 'ADMIN', // ваше имя пользователя в PostgreSQL
      password: 'ROOT', // ваш пароль
      database: 'DB', // имя вашей базы данных
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // путь к вашим сущностям (таблицам)
      synchronize: true, // если true, TypeORM будет автоматически создавать таблицы на основе ваших сущностей при запуске приложения
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com',
        secure: false, // false для порта 587 с STARTTLS, true для порта 465 с SSL
        port: 587,
        auth: {
          user: 'crudtestappnest123@outlook.com',
          pass: '550dON6e6ROu', // Ваш пароль от Outlook или специальный пароль приложения
        },
      },
      defaults: {
        from: '"Test app" crudtestappnest123@outlook.com', // Email, который будет отображаться как отправитель
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    RegistrationModule,
    // другие модули...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
