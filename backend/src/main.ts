/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common'; // <-- Agrega esta línea
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setGlobalPrefix('api');
  // Configuración de CORS para permitir peticiones desde el frontend Angular
  app.enableCors({
    origin: 'http://localhost:4200', // Reemplaza con la URL de tu frontend de Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  /**
   * Validación global de DTOs usando ValidationPipe:
   * - whitelist: elimina propiedades no definidas en el DTO
   * - forbidNonWhitelisted: lanza error si se envían propiedades extra
   * - transform: convierte automáticamente los tipos 
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );
    /**
   * Configuración de Swagger:
   * Genera y expone la documentación de la API en formato OpenAPI
   */
  const config = new DocumentBuilder()
    .setTitle('Documentación del proyecto paypal') //agregamos el titulo 
    .setDescription('Aqui veremos la documentacón Swagger del proyec (controller, Dto)')
    .setVersion('1.0') 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
