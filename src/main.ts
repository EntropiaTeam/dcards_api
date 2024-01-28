/* eslint-disable no-void */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap():Promise<void> {
  const app = await NestFactory.create(AppModule);
  const appVersion = process.env.APP_VERSION ?? 'development';
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    methods: 'GET,PUT,POST,DELETE,OPTIONS'
  });

  if (process.env.INCLUDE_DOCS) {
    const options = new DocumentBuilder()
      .setTitle('Printible API')
      .setDescription('Printible API docs')
      .setVersion(`nest-${appVersion}`)
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3001;

  await app.listen(port);
}
void bootstrap();
