import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'private-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'certificate.pem')),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors();
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
