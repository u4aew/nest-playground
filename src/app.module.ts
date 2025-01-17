import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { GithubOauthModule } from './modules/github/github-oauth.module';
import { TokenModule } from './modules/token/token.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseExceptionFilter } from './shared/filters/database-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { typeOrmConfig } from './config/typeorm.config';
import { mailerConfig } from './config/mailer.config';
import { MailModule } from './modules/mail/mail.module';
import { CryptModule } from './modules/crypt/crypt.module';
import { GptModule } from './modules/gpt/gpt.module';
import { ParserModule } from './modules/parser/parser.module';
import { CopywriterModule } from './modules/copirater/copywriter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mailerConfig,
    }),
    RegistrationModule,
    AuthModule,
    UserModule,
    TokenModule,
    MailModule,
    GithubOauthModule,
    CryptModule,
    GptModule,
    ParserModule,
    CopywriterModule,
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
