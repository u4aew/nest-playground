import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { DatabaseExceptionFilter } from './shared/filters/database-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { typeOrmConfig } from './config/typeorm.config';
import { mailerConfig } from './config/mailer.config';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot(mailerConfig),
    RegistrationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
  ],
})
export class AppModule {}
