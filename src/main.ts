import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Docs')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Удаляет несоответствующие свойства из объекта
    forbidNonWhitelisted: true, // Генерирует ошибку при обнаружении лишних свойств
    transform: true, // Преобразует входные данные в соответствующие DTO классы
  }));
  await app.listen(3000);
}
bootstrap();
