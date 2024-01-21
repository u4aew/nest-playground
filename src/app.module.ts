import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { RegistrationModule } from './modules/registration/registration.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres', // тип базы данных
      host: 'postgres', // хост, используйте 'postgres' если запускаете через Docker Compose
      port: 5432, // порт, по умолчанию для PostgreSQL
      username: 'ADMIN', // ваше имя пользователя в PostgreSQL
      password: 'ROOT', // ваш пароль
      database: 'DB', // имя вашей базы данных
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // путь к вашим сущностям (таблицам)
      synchronize: true, // если true, TypeORM будет автоматически создавать таблицы на основе ваших сущностей при запуске приложения
    }),
    RegistrationModule,
    // другие модули...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
