import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>(`app.port`);
  const apiPrefix = configService.get<string>('app.apiPrefix');

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Blog Crud')
    .setDescription(
      `API documentation for your

## Blog RESTful API Documentation

This API provides complete blog functionality including:
- User authentication and management
- Crud operation on Blog
`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Blogs', 'Crud operation on Blogs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  console.log(
    `Swagger documentation : http:localhost:${port}/${apiPrefix}/docs`,
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
