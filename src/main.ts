import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет свойства, которые не имеют декораторов
      forbidNonWhitelisted: true, // выбрасывает исключение, если встречаются свойства без декораторов
      transform: true, // преобразует входящие данные к соответствующим типам DTO
      disableErrorMessages: false, // можно установить в true в продакшене для скрытия деталей ошибок
    }),
  );
  await app.listen(3000);
}
bootstrap();
